package com.bank.banking_app.service;

import com.bank.banking_app.dto.request.DepositRequest;
import com.bank.banking_app.enums.AccountType;
import com.bank.banking_app.enums.KycStatus;
import com.bank.banking_app.enums.TransactionStatus;
import com.bank.banking_app.enums.TransactionType;
import com.bank.banking_app.exception.AccountNotActiveException;
import com.bank.banking_app.models.Account;
import com.bank.banking_app.models.Transaction;
import com.bank.banking_app.models.Users;
import com.bank.banking_app.repository.AccountRepository;
import com.bank.banking_app.repository.PaymentRepository;
import com.bank.banking_app.repository.TransactionRepository;
import com.bank.banking_app.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * Integration tests for DepositService
 * Tests deposit functionality and account status validation
 */
@SpringBootTest
@Transactional
class DepositServiceTest {

    @Autowired
    private DepositService depositService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    private static final String TEST_EMAIL = "deposit@example.com";
    private Account testAccount;

    @BeforeEach
    void setUp() {
        paymentRepository.deleteAll();
        transactionRepository.deleteAll();
        accountRepository.deleteAll();
        userRepository.deleteAll();

        setSecurityContext(TEST_EMAIL);
        createUserWithActiveAccount();
    }

    @Test
    @DisplayName("Deposit should increase balance and create transaction")
    void deposit_ShouldIncreaseBalanceAndCreateTransaction() {
        // Given
        DepositRequest request = new DepositRequest(new BigDecimal("5000.00"));

        // When
        depositService.deposit(request);

        // Then
        Account updatedAccount = accountRepository.findById(testAccount.getId()).get();
        assertThat(updatedAccount.getBalance().compareTo(new BigDecimal("15000.00"))).isEqualTo(0);

        // Verify transaction was created
        List<Transaction> transactions = transactionRepository.findAll();
        assertThat(transactions).hasSize(1);

        Transaction txn = transactions.get(0);
        assertThat(txn.getTransactionType()).isEqualTo(TransactionType.DEPOSIT);
        assertThat(txn.getStatus()).isEqualTo(TransactionStatus.SUCCESS);
        assertThat(txn.getAmount().compareTo(new BigDecimal("5000.00"))).isEqualTo(0);
        assertThat(txn.getBalanceBefore().compareTo(new BigDecimal("10000.00"))).isEqualTo(0);
        assertThat(txn.getBalanceAfter().compareTo(new BigDecimal("15000.00"))).isEqualTo(0);
    }

    @Test
    @DisplayName("Deposit with inactive account should throw exception")
    void deposit_WithInactiveAccount_ShouldThrowException() {
        // Given
        testAccount.setStatus(KycStatus.AccountStatus.INACTIVE);
        accountRepository.save(testAccount);

        DepositRequest request = new DepositRequest(new BigDecimal("5000.00"));

        // When & Then
        assertThatThrownBy(() -> depositService.deposit(request))
                .isInstanceOf(AccountNotActiveException.class)
                .hasMessageContaining("not active");
    }

    @Test
    @DisplayName("Multiple deposits should accumulate correctly")
    void deposit_MultipleTimes_ShouldAccumulateBalance() {
        // Given
        DepositRequest request1 = new DepositRequest(new BigDecimal("1000.00"));
        DepositRequest request2 = new DepositRequest(new BigDecimal("2000.00"));

        // When
        depositService.deposit(request1);
        depositService.deposit(request2);

        // Then
        Account updatedAccount = accountRepository.findById(testAccount.getId()).get();
        assertThat(updatedAccount.getBalance().compareTo(new BigDecimal("13000.00"))).isEqualTo(0);

        // Verify both transactions were created
        List<Transaction> transactions = transactionRepository.findAll();
        assertThat(transactions).hasSize(2);
    }

    // Helper methods
    private void setSecurityContext(String email) {
        Authentication auth = new UsernamePasswordAuthenticationToken(email, null, new ArrayList<>());
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(auth);
        SecurityContextHolder.setContext(context);
    }

    private void createUserWithActiveAccount() {
        Users user = Users.builder()
                .fullName("Deposit Test User")
                .email(TEST_EMAIL)
                .phone("9333333333")
                .password("depositpass")
                .aadhaarNumber("333333333333")
                .panCardNumber("DEPOC1234C")
                .kycStatus(KycStatus.VERIFIED)
                .build();
        user = userRepository.save(user);

        testAccount = Account.builder()
                .accountNumber("300000000001")
                .accountType(AccountType.SAVINGS)
                .balance(new BigDecimal("10000.00"))
                .status(KycStatus.AccountStatus.ACTIVE)
                .user(user)
                .build();
        testAccount = accountRepository.save(testAccount);
    }
}
