package com.bank.banking_app.service;

import com.bank.banking_app.Transformer.TransactionTransformer;
import com.bank.banking_app.dto.request.TransferRequest;
import com.bank.banking_app.enums.KycStatus;
import com.bank.banking_app.enums.TransactionStatus;
import com.bank.banking_app.exception.AccountNotActiveException;
import com.bank.banking_app.exception.AccountNotFoundException;
import com.bank.banking_app.exception.InsufficientBalanceException;
import com.bank.banking_app.exception.InvalidCredentialsException;
import com.bank.banking_app.models.Account;
import com.bank.banking_app.models.Transaction;
import com.bank.banking_app.models.Users;
import com.bank.banking_app.repository.AccountRepository;
import com.bank.banking_app.repository.TransactionRepository;
import com.bank.banking_app.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class TransferService {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    public TransferService(UserRepository userRepository,
                           AccountRepository accountRepository,
                           TransactionRepository transactionRepository) {
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
    }

    @Transactional
    public void transfer(TransferRequest request) {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        Users senderUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new InvalidCredentialsException("User not found"));

        Account sender = accountRepository.findByUser(senderUser)
                .orElseThrow(() -> new AccountNotFoundException("Sender account not found"));

        if (sender.getStatus() != KycStatus.AccountStatus.ACTIVE)
            throw new AccountNotActiveException("Sender account inactive");

        Account receiver = accountRepository
                .findByAccountNumber(request.getReceiverAccountNumber())
                .orElseThrow(() -> new AccountNotFoundException("Receiver account not found"));

        if (receiver.getStatus() != KycStatus.AccountStatus.ACTIVE)
            throw new AccountNotActiveException("Receiver account inactive");

        if (sender.getAccountNumber().equals(receiver.getAccountNumber()))
            throw new IllegalArgumentException("Cannot transfer to same account");

        BigDecimal amount = request.getAmount();
        BigDecimal senderBefore = sender.getBalance();

        if (senderBefore.compareTo(amount) < 0) {

            Transaction failedDebit =
                    TransactionTransformer.transferDebit(
                            sender,
                            amount,
                            senderBefore,
                            senderBefore,
                            TransactionStatus.FAILED
                    );

            transactionRepository.save(failedDebit);
            throw new InsufficientBalanceException("Insufficient balance");
        }

        BigDecimal senderAfter = senderBefore.subtract(amount);
        BigDecimal receiverBefore = receiver.getBalance();
        BigDecimal receiverAfter = receiverBefore.add(amount);

        sender.setBalance(senderAfter);
        receiver.setBalance(receiverAfter);

        accountRepository.save(sender);
        accountRepository.save(receiver);

        Transaction debitTxn =
                TransactionTransformer.transferDebit(
                        sender,
                        amount,
                        senderBefore,
                        senderAfter,
                        TransactionStatus.SUCCESS
                );

        Transaction creditTxn =
                TransactionTransformer.transferCredit(
                        receiver,
                        amount,
                        receiverBefore,
                        receiverAfter
                );

        transactionRepository.save(debitTxn);
        transactionRepository.save(creditTxn);
    }
}
