package com.bank.banking_app.serviceTest;

import com.bank.banking_app.dto.request.WithDrawRequest;
import com.bank.banking_app.enums.AccountType;
import com.bank.banking_app.enums.KycStatus;
import com.bank.banking_app.enums.TransactionStatus;
import com.bank.banking_app.exception.AccountNotActiveException;
import com.bank.banking_app.exception.InsufficientBalanceException;
import com.bank.banking_app.models.Account;
import com.bank.banking_app.models.Transaction;
import com.bank.banking_app.models.Users;
import com.bank.banking_app.repository.AccountRepository;
import com.bank.banking_app.repository.PaymentRepository;
import com.bank.banking_app.repository.TransactionRepository;
import com.bank.banking_app.repository.UserRepository;
import com.bank.banking_app.service.WithDrawService;

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
 * Integration tests for WithDrawService
 * Tests withdrawal functionality and various error scenarios
 */
@SpringBootTest
@Transactional
public class WithDrawServiceTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private WithDrawService withDrawService;

    @Autowired
    private PaymentRepository paymentRepository;

    private static final String TEST_EMAIL = "test@gmail.com";
    private Account testAccount;

    @BeforeEach
    void setUp() {
        paymentRepository.deleteAll();
        transactionRepository.deleteAll();
        accountRepository.deleteAll();
        userRepository.deleteAll();
        setSecurityContext(TEST_EMAIL);
        testAccount = createUserWithAccount(new BigDecimal("5000.00"), KycStatus.AccountStatus.ACTIVE);
    }

    @Test
    @DisplayName("Successful withdraw should update balance and create success transaction")
    void testForWithDrawService() {
        // Given
        WithDrawRequest request = createWithDraw(new BigDecimal("2000.00"));

        // When
        withDrawService.withDraw(request);

        // Then
        Users user = userRepository.findByEmail(TEST_EMAIL).get();
        Account account = accountRepository.findByUser(user).get();

        assertThat(account.getBalance().compareTo(new BigDecimal("3000.00"))).isEqualTo(0);

        List<Transaction> txns = transactionRepository.findAll();
        assertThat(txns.size()).isEqualTo(1);

        Transaction txn = txns.get(0);
        assertThat(txn.getStatus()).isEqualTo(TransactionStatus.SUCCESS);
        assertThat(txn.getBalanceBefore().compareTo(new BigDecimal("5000.00"))).isEqualTo(0);
        assertThat(txn.getBalanceAfter().compareTo(new BigDecimal("3000.00"))).isEqualTo(0);
    }

    @Test
    @DisplayName("Withdraw with insufficient balance should throw and create failed transaction")
    void withdraw_WithInsufficientBalance_ShouldThrowAndCreateFailedTransaction() {
        // Given
        WithDrawRequest request = createWithDraw(new BigDecimal("10000.00")); // More than balance

        // When & Then
        assertThatThrownBy(() -> withDrawService.withDraw(request))
                .isInstanceOf(InsufficientBalanceException.class)
                .hasMessageContaining("Insufficient balance");

        // Verify failed transaction was logged
        List<Transaction> transactions = transactionRepository.findAll();
        assertThat(transactions).hasSize(1);
        assertThat(transactions.get(0).getStatus()).isEqualTo(TransactionStatus.FAILED);
        assertThat(transactions.get(0).getBalanceBefore()).isEqualTo(transactions.get(0).getBalanceAfter());
    }

    @Test
    @DisplayName("Withdraw with inactive account should throw exception")
    void withdraw_WithInactiveAccount_ShouldThrowException() {
        // Given - recreate with inactive account
        transactionRepository.deleteAll();
        accountRepository.deleteAll();
        userRepository.deleteAll();
        setSecurityContext("inactive@gmail.com");
        createUserWithAccount(new BigDecimal("5000.00"), KycStatus.AccountStatus.INACTIVE);

        WithDrawRequest request = createWithDraw(new BigDecimal("1000.00"));

        // When & Then
        assertThatThrownBy(() -> withDrawService.withDraw(request))
                .isInstanceOf(AccountNotActiveException.class)
                .hasMessageContaining("not active");
    }

    @Test
    @DisplayName("Withdraw exact balance should leave zero balance")
    void withdraw_ExactBalance_ShouldLeaveZeroBalance() {
        // Given
        WithDrawRequest request = createWithDraw(new BigDecimal("5000.00"));

        // When
        withDrawService.withDraw(request);

        // Then
        Users user = userRepository.findByEmail(TEST_EMAIL).get();
        Account account = accountRepository.findByUser(user).get();
        assertThat(account.getBalance().compareTo(BigDecimal.ZERO)).isEqualTo(0);
    }

    // Helper methods
    private WithDrawRequest createWithDraw(BigDecimal amount) {
        return WithDrawRequest.builder().amount(amount).build();
    }

    private void setSecurityContext(String email) {
        Authentication auth = new UsernamePasswordAuthenticationToken(email, null, new ArrayList<>());
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(auth);
        SecurityContextHolder.setContext(context);
    }

    private Account createUserWithAccount(BigDecimal balance, KycStatus.AccountStatus status) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        Users user = new Users();
        user.setEmail(email);
        user.setFullName("Test User");
        user.setPassword("pass");
        user.setPhone("9999999999");
        user.setAadhaarNumber("123412341234");
        user.setPanCardNumber("ABCDE1234F");
        user.setKycStatus(KycStatus.VERIFIED);

        user = userRepository.save(user);

        Account account = Account.builder()
                .accountNumber("400000000001")
                .accountType(AccountType.SAVINGS)
                .balance(balance)
                .status(status)
                .user(user)
                .build();

        return accountRepository.save(account);
    }
}
