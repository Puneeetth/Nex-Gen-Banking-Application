package com.bank.banking_app.service;

import com.bank.banking_app.dto.request.OpenAccountRequest;
import com.bank.banking_app.dto.response.OpenAccountResponse;
import com.bank.banking_app.enums.AccountType;
import com.bank.banking_app.enums.KycStatus;
import com.bank.banking_app.exception.BadRequestException;
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
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * Integration tests for OpenAccountService
 * Tests account creation and duplicate validation
 */
@SpringBootTest
@Transactional
class OpenAccountServiceTest {

    @Autowired
    private OpenAccountService openAccountService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @BeforeEach
    void setUp() {
        paymentRepository.deleteAll();
        accountRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    @DisplayName("Open account should create user and account successfully")
    void openAccount_ShouldCreateUserAndAccount() {
        // Given
        OpenAccountRequest request = createOpenAccountRequest();

        // When
        OpenAccountResponse response = openAccountService.openAccount(request);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getAccountNumber()).isNotNull();
        assertThat(response.getAccountNumber()).hasSize(12);

        // Verify user was created
        assertThat(userRepository.existsByEmail("newuser@example.com")).isTrue();

        // Verify account was created with correct balance
        Users user = userRepository.findByEmail("newuser@example.com").get();
        Account account = accountRepository.findByUser(user).get();
        assertThat(account.getBalance().compareTo(new BigDecimal("5000.00"))).isEqualTo(0);
        assertThat(account.getStatus()).isEqualTo(KycStatus.AccountStatus.ACTIVE);
    }

    @Test
    @DisplayName("Open account with duplicate email should throw exception")
    void openAccount_WithDuplicateEmail_ShouldThrowException() {
        // Given
        createExistingUser();
        OpenAccountRequest request = createOpenAccountRequest();
        request.setEmail("existing@example.com"); // Use existing email

        // When & Then
        assertThatThrownBy(() -> openAccountService.openAccount(request))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Email already exists");
    }

    @Test
    @DisplayName("Open account with duplicate phone should throw exception")
    void openAccount_WithDuplicatePhone_ShouldThrowException() {
        // Given
        createExistingUser();
        OpenAccountRequest request = createOpenAccountRequest();
        request.setPhone("9111111111"); // Use existing phone

        // When & Then
        assertThatThrownBy(() -> openAccountService.openAccount(request))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Phone already exists");
    }

    @Test
    @DisplayName("Open account with duplicate Aadhaar should throw exception")
    void openAccount_WithDuplicateAadhaar_ShouldThrowException() {
        // Given
        createExistingUser();
        OpenAccountRequest request = createOpenAccountRequest();
        request.setAadhaarNumber("999988887777"); // Use existing Aadhaar

        // When & Then
        assertThatThrownBy(() -> openAccountService.openAccount(request))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Aadhaar already exists");
    }

    @Test
    @DisplayName("Open account with duplicate PAN should throw exception")
    void openAccount_WithDuplicatePan_ShouldThrowException() {
        // Given
        createExistingUser();
        OpenAccountRequest request = createOpenAccountRequest();
        request.setPanCardNumber("EXIST1234A"); // Use existing PAN

        // When & Then
        assertThatThrownBy(() -> openAccountService.openAccount(request))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("PAN already exists");
    }

    // Helper methods
    private OpenAccountRequest createOpenAccountRequest() {
        return OpenAccountRequest.builder()
                .fullName("New Test User")
                .email("newuser@example.com")
                .phone("9876543210")
                .password("password123")
                .aadhaarNumber("123456789012")
                .panCardNumber("NEWABC1234D")
                .accountType(AccountType.SAVINGS)
                .initialDeposit(new BigDecimal("5000.00"))
                .build();
    }

    private void createExistingUser() {
        Users user = Users.builder()
                .fullName("Existing User")
                .email("existing@example.com")
                .phone("9111111111")
                .password("existingpass")
                .aadhaarNumber("999988887777")
                .panCardNumber("EXIST1234A")
                .kycStatus(KycStatus.VERIFIED)
                .build();
        userRepository.save(user);
    }
}
