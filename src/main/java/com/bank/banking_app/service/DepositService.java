package com.bank.banking_app.service;

import com.bank.banking_app.Transformer.TransactionTransformer;
import com.bank.banking_app.dto.request.DepositRequest;
import com.bank.banking_app.enums.KycStatus;
import com.bank.banking_app.exception.AccountNotActiveException;
import com.bank.banking_app.exception.AccountNotFoundException;
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
public class DepositService {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    public DepositService(UserRepository userRepository,
                          AccountRepository accountRepository,
                          TransactionRepository transactionRepository) {
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
    }

    @Transactional
    public void deposit(DepositRequest request) {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        Users user = userRepository.findByEmail(email)
                .orElseThrow(() -> new InvalidCredentialsException("User not found"));

        Account account = accountRepository.findByUser(user)
                .orElseThrow(() -> new AccountNotFoundException("Account not found"));

        if (account.getStatus() != KycStatus.AccountStatus.ACTIVE)
            throw new AccountNotActiveException("Account is not active");

        BigDecimal balanceBefore = account.getBalance();
        BigDecimal balanceAfter = balanceBefore.add(request.getAmount());

        account.setBalance(balanceAfter);
        accountRepository.save(account);

        Transaction transaction =
                TransactionTransformer.depositTransaction(
                        account,
                        request.getAmount(),
                        balanceBefore,
                        balanceAfter
                );

        transactionRepository.save(transaction);
    }
}
