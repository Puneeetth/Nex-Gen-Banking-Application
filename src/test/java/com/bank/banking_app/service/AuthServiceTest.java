package com.bank.banking_app.service;

import com.bank.banking_app.dto.request.LoginRequest;
import com.bank.banking_app.dto.response.LoginResponse;
import com.bank.banking_app.enums.AccountType;
import com.bank.banking_app.enums.KycStatus;
import com.bank.banking_app.exception.AccountNotActiveException;
import com.bank.banking_app.exception.InvalidCredentialsException;
import com.bank.banking_app.models.Account;
import com.bank.banking_app.models.Users;
import com.bank.banking_app.repository.AccountRepository;
import com.bank.banking_app.repository.PaymentRepository;
import com.bank.banking_app.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * Integration tests for AuthService
 * Tests login functionality with email/phone and various error scenarios
 */
@SpringBootTest
@Transactional
class AuthServiceTest {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private static final String TEST_EMAIL = "authtest@example.com";
    private static final String TEST_PHONE = "9876543210";
    private static final String TEST_PASSWORD = "password123";

    @BeforeEach
    void setUp() {
        paymentRepository.deleteAll();
        accountRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    @DisplayName("Login with valid email should return JWT token")
    void login_WithValidEmail_ShouldReturnToken() {
        // Given
        createUserWithActiveAccount();
        LoginRequest request = new LoginRequest();
        request.setIdentifier(TEST_EMAIL);
        request.setPassword(TEST_PASSWORD);

        // When
        LoginResponse response = authService.login(request);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getToken()).isNotNull();
        assertThat(response.getToken()).isNotEmpty();
        assertThat(response.getAccountStatus()).isEqualTo(KycStatus.AccountStatus.ACTIVE);
    }

    @Test
    @DisplayName("Login with valid phone number should return JWT token")
    void login_WithValidPhone_ShouldReturnToken() {
        // Given
        createUserWithActiveAccount();
        LoginRequest request = new LoginRequest();
        request.setIdentifier(TEST_PHONE);
        request.setPassword(TEST_PASSWORD);

        // When
        LoginResponse response = authService.login(request);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getToken()).isNotNull();
        assertThat(response.getAccountNumber()).isNotNull();
    }

    @Test
    @DisplayName("Login with wrong password should throw InvalidCredentialsException")
    void login_WithWrongPassword_ShouldThrowException() {
        // Given
        createUserWithActiveAccount();
        LoginRequest request = new LoginRequest();
        request.setIdentifier(TEST_EMAIL);
        request.setPassword("wrongpassword");

        // When & Then
        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(InvalidCredentialsException.class)
                .hasMessageContaining("Incorrect Password");
    }

    @Test
    @DisplayName("Login with non-existent user should throw InvalidCredentialsException")
    void login_WithNonExistentUser_ShouldThrowException() {
        // Given
        LoginRequest request = new LoginRequest();
        request.setIdentifier("nonexistent@example.com");
        request.setPassword(TEST_PASSWORD);

        // When & Then
        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(InvalidCredentialsException.class)
                .hasMessageContaining("Invalid Credentials");
    }

    @Test
    @DisplayName("Login with inactive account should throw AccountNotActiveException")
    void login_WithInactiveAccount_ShouldThrowException() {
        // Given
        createUserWithInactiveAccount();
        LoginRequest request = new LoginRequest();
        request.setIdentifier(TEST_EMAIL);
        request.setPassword(TEST_PASSWORD);

        // When & Then
        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(AccountNotActiveException.class)
                .hasMessageContaining("not Active");
    }

    // Helper methods
    private void createUserWithActiveAccount() {
        Users user = Users.builder()
                .fullName("Auth Test User")
                .email(TEST_EMAIL)
                .phone(TEST_PHONE)
                .password(passwordEncoder.encode(TEST_PASSWORD))
                .aadhaarNumber("111122223333")
                .panCardNumber("AUTHP1234A")
                .kycStatus(KycStatus.VERIFIED)
                .build();
        user = userRepository.save(user);

        Account account = Account.builder()
                .accountNumber("100000000001")
                .accountType(AccountType.SAVINGS)
                .balance(new BigDecimal("10000.00"))
                .status(KycStatus.AccountStatus.ACTIVE)
                .user(user)
                .build();
        accountRepository.save(account);
    }

    private void createUserWithInactiveAccount() {
        Users user = Users.builder()
                .fullName("Inactive Test User")
                .email(TEST_EMAIL)
                .phone(TEST_PHONE)
                .password(passwordEncoder.encode(TEST_PASSWORD))
                .aadhaarNumber("444455556666")
                .panCardNumber("INACP5678B")
                .kycStatus(KycStatus.VERIFIED)
                .build();
        user = userRepository.save(user);

        Account account = Account.builder()
                .accountNumber("100000000002")
                .accountType(AccountType.SAVINGS)
                .balance(new BigDecimal("5000.00"))
                .status(KycStatus.AccountStatus.INACTIVE)
                .user(user)
                .build();
        accountRepository.save(account);
    }
}
