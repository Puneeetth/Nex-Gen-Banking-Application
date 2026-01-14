package com.bank.banking_app.service;

import com.bank.banking_app.Transformer.TransactionTransformer;
import com.bank.banking_app.dto.request.WithDrawRequest;
import com.bank.banking_app.enums.KycStatus;
import com.bank.banking_app.enums.TransactionStatus;
import com.bank.banking_app.exception.AccountNotActiveException;
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
public class WithDrawService {
        private final TransactionRepository transactionRepository;
        private final AccountRepository accountRepository;
        private final UserRepository userRepository;

        public WithDrawService(TransactionRepository transactionRepository, AccountRepository accountRepository,
                        UserRepository userRepository) {
                this.transactionRepository = transactionRepository;
                this.accountRepository = accountRepository;
                this.userRepository = userRepository;
        }

        @Transactional
        public void withDraw(WithDrawRequest request) {
                String email = SecurityContextHolder
                                .getContext()
                                .getAuthentication()
                                .getName();
                Users user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new InvalidCredentialsException("User Not found"));

                Account account = accountRepository.findByUser(user)
                                .orElseThrow(() -> new InvalidCredentialsException("Account not found"));

                if (account.getStatus() != KycStatus.AccountStatus.ACTIVE) {
                        throw new AccountNotActiveException("Account is not active");
                }
                BigDecimal balanceBefore = account.getBalance();

                if (balanceBefore.compareTo(request.getAmount()) < 0) {
                        Transaction failedTxn = TransactionTransformer.withDrawTransaction(
                                        account,
                                        request.getAmount(),
                                        balanceBefore,
                                        balanceBefore,
                                        TransactionStatus.FAILED

                        );
                        transactionRepository.save(failedTxn);
                        throw new InsufficientBalanceException("Insufficient balance");
                }
                BigDecimal balanceAfter = balanceBefore.subtract(request.getAmount());

                account.setBalance(balanceAfter);
                accountRepository.save(account);

                Transaction successTnx = TransactionTransformer.withDrawTransaction(
                                account,
                                request.getAmount(),
                                balanceBefore,
                                balanceAfter,
                                TransactionStatus.SUCCESS);

                transactionRepository.save(successTnx);
        }
}
