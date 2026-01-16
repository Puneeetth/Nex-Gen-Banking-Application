package com.bank.banking_app.security;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Unit tests for JwtUtil class
 * Tests JWT token generation, validation, and subject extraction
 */
class JwtUtilTest {

    private static final String TEST_EMAIL = "test@example.com";

    @Test
    @DisplayName("generateToken should return a non-null token")
    void generateToken_ShouldReturnValidToken() {
        // When
        String token = JwtUtil.generateToken(TEST_EMAIL);

        // Then
        assertThat(token).isNotNull();
        assertThat(token).isNotEmpty();
        assertThat(token.split("\\.")).hasSize(3); // JWT has 3 parts
    }

    @Test
    @DisplayName("extractSubject should return correct email from token")
    void extractSubject_ShouldReturnCorrectEmail() {
        // Given
        String token = JwtUtil.generateToken(TEST_EMAIL);

        // When
        String extractedEmail = JwtUtil.extraSubject(token);

        // Then
        assertThat(extractedEmail).isEqualTo(TEST_EMAIL);
    }

    @Test
    @DisplayName("isValid should return true for valid token")
    void isValid_ShouldReturnTrue_ForValidToken() {
        // Given
        String token = JwtUtil.generateToken(TEST_EMAIL);

        // When
        boolean isValid = JwtUtil.isValid(token);

        // Then
        assertThat(isValid).isTrue();
    }

    @Test
    @DisplayName("isValid should return false for invalid token")
    void isValid_ShouldReturnFalse_ForInvalidToken() {
        // Given
        String invalidToken = "invalid.token.here";

        // When
        boolean isValid = JwtUtil.isValid(invalidToken);

        // Then
        assertThat(isValid).isFalse();
    }

    @Test
    @DisplayName("isValid should return false for tampered token")
    void isValid_ShouldReturnFalse_ForTamperedToken() {
        // Given
        String token = JwtUtil.generateToken(TEST_EMAIL);
        String tamperedToken = token.substring(0, token.length() - 5) + "XXXXX";

        // When
        boolean isValid = JwtUtil.isValid(tamperedToken);

        // Then
        assertThat(isValid).isFalse();
    }

    @Test
    @DisplayName("isValid should return false for null token")
    void isValid_ShouldReturnFalse_ForNullToken() {
        // When
        boolean isValid = JwtUtil.isValid(null);

        // Then
        assertThat(isValid).isFalse();
    }

    @Test
    @DisplayName("isValid should return false for empty token")
    void isValid_ShouldReturnFalse_ForEmptyToken() {
        // When
        boolean isValid = JwtUtil.isValid("");

        // Then
        assertThat(isValid).isFalse();
    }

    @Test
    @DisplayName("Different emails should generate different tokens")
    void generateToken_ShouldGenerateDifferentTokens_ForDifferentEmails() {
        // Given
        String email1 = "user1@example.com";
        String email2 = "user2@example.com";

        // When
        String token1 = JwtUtil.generateToken(email1);
        String token2 = JwtUtil.generateToken(email2);

        // Then
        assertThat(token1).isNotEqualTo(token2);
    }
}
