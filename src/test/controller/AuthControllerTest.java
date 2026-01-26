package com.bank.banking_app.controller;

import com.bank.banking_app.dto.request.LoginRequest;
import com.bank.banking_app.dto.response.LoginResponse;
import com.bank.banking_app.enums.AccountType;
import com.bank.banking_app.enums.KycStatus;
import com.bank.banking_app.models.Account;
import com.bank.banking_app.models.Users;
import com.bank.banking_app.repository.AccountRepository;
import com.bank.banking_app.repository.PaymentRepository;
import com.bank.banking_app.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import java.math.BigDecimal;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for AuthController
 * Tests login endpoint with various scenarios
 */
@SpringBootTest
@Transactional
class AuthControllerTest {

    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private static final String LOGIN_URL = "/api/auth/login";
    private static final String TEST_EMAIL = "controller.test@example.com";
    private static final String TEST_PHONE = "9876543210";
    private static final String TEST_PASSWORD = "password123";

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        paymentRepository.deleteAll();
        accountRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    @DisplayName("POST /api/auth/login - Success - Returns 200 with token")
    void login_WithValidCredentials_ReturnsToken() throws Exception {
        // Given
        createUserWithActiveAccount();
        LoginRequest request = new LoginRequest();
        request.setIdentifier(TEST_EMAIL);
        request.setPassword(TEST_PASSWORD);

        // When & Then
        mockMvc.perform(post(LOGIN_URL)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.accountNumber").isNotEmpty())
                .andExpect(jsonPath("$.accountStatus").value("ACTIVE"));
    }

    @Test
    @DisplayName("POST /api/auth/login - With phone number - Returns 200 with token")
    void login_WithPhoneNumber_ReturnsToken() throws Exception {
        // Given
        createUserWithActiveAccount();
        LoginRequest request = new LoginRequest();
        request.setIdentifier(TEST_PHONE);
        request.setPassword(TEST_PASSWORD);

        // When & Then
        mockMvc.perform(post(LOGIN_URL)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty());
    }

    @Test
    @DisplayName("POST /api/auth/login - Invalid password - Returns 401")
    void login_WithInvalidPassword_ReturnsUnauthorized() throws Exception {
        // Given
        createUserWithActiveAccount();
        LoginRequest request = new LoginRequest();
        request.setIdentifier(TEST_EMAIL);
        request.setPassword("wrongpassword");

        // When & Then
        mockMvc.perform(post(LOGIN_URL)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("POST /api/auth/login - Non-existent user - Returns 401")
    void login_WithNonExistentUser_ReturnsUnauthorized() throws Exception {
        // Given
        LoginRequest request = new LoginRequest();
        request.setIdentifier("nonexistent@example.com");
        request.setPassword(TEST_PASSWORD);

        // When & Then
        mockMvc.perform(post(LOGIN_URL)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("POST /api/auth/login - Missing identifier - Returns 400")
    void login_WithMissingIdentifier_ReturnsBadRequest() throws Exception {
        // Given
        LoginRequest request = new LoginRequest();
        request.setPassword(TEST_PASSWORD);

        // When & Then
        mockMvc.perform(post(LOGIN_URL)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("POST /api/auth/login - Missing password - Returns 400")
    void login_WithMissingPassword_ReturnsBadRequest() throws Exception {
        // Given
        LoginRequest request = new LoginRequest();
        request.setIdentifier(TEST_EMAIL);

        // When & Then
        mockMvc.perform(post(LOGIN_URL)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    // Helper method
    private void createUserWithActiveAccount() {
        Users user = Users.builder()
                .fullName("Controller Test User")
                .email(TEST_EMAIL)
                .phone(TEST_PHONE)
                .password(passwordEncoder.encode(TEST_PASSWORD))
                .aadhaarNumber("777788889999")
                .panCardNumber("CTRLR1234A")
                .kycStatus(KycStatus.VERIFIED)
                .build();
        user = userRepository.save(user);

        Account account = Account.builder()
                .accountNumber("200000000001")
                .accountType(AccountType.SAVINGS)
                .balance(new BigDecimal("10000.00"))
                .status(KycStatus.AccountStatus.ACTIVE)
                .user(user)
                .build();
        accountRepository.save(account);
    }
}
