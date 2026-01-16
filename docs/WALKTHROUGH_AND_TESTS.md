# Banking App Backend - Complete Project Walkthrough & Test Documentation

---

## Table of Contents
1. [Video Walkthrough Script](#video-walkthrough-script)
2. [Test Implementation Documentation](#test-implementation-documentation)
3. [Test Summary](#test-summary)

---

# Video Walkthrough Script

**Duration: 5-6 Minutes | Backend Focus**

## Video Timing Overview

| Section | Duration | Content |
|---------|----------|---------|
| Introduction & Tech Stack | 45 sec | Project overview, technologies |
| Architecture & Structure | 45 sec | Package organization |
| Security & JWT | 1:30 min | JWT, Spring Security |
| Core Banking Features | 1:30 min | Transfers, Deposits, Withdrawals |
| Payment Gateway | 45 sec | Razorpay integration |
| Exception Handling | 30 sec | Global handler, validation |
| Conclusion | 15 sec | Summary |

---

## SECTION 1: Introduction (0:00 - 0:45)

> **[SHOW: Project README]**

**SPEAK:**

> "Hello everyone! Today I'm walking you through the backend of my **Nex-Gen Banking Application** - a secure RESTful API built with modern Java technologies.
>
> **Tech Stack:**
> - **Java 17** - LTS programming language
> - **Spring Boot 4.0.1** - Application framework
> - **Spring Security** - JWT authentication
> - **Spring Data JPA + MySQL** - Database ORM
> - **JJWT 0.11.5** - Token handling
> - **Razorpay SDK** - Payment gateway
> - **Lombok** - Boilerplate reduction"

---

## SECTION 2: Architecture (0:45 - 1:30)

> **[SHOW: Project folder structure]**

**SPEAK:**

> "I've followed a **layered architecture** pattern:
>
> - **`config/`** - SecurityConfig, CORS configuration
> - **`controller/`** - 8 REST API controllers
> - **`service/`** - Business logic layer
> - **`repository/`** - JPA repositories
> - **`models/`** - JPA entities: Users, Account, Transaction, Payment
> - **`dto/`** - Data Transfer Objects
> - **`security/`** - JWT utilities and filters
> - **`exception/`** - Custom exceptions and global handler
>
> This separation ensures **Single Responsibility Principle**."

---

## SECTION 3: Security & JWT (1:30 - 3:00)

> **[SHOW: SecurityConfig.java]**

**SPEAK:**

> "Security is the most critical part. Here's my `SecurityConfig`:
>
> - **CORS enabled** for frontend communication
> - **CSRF disabled** - JWT tokens are immune to CSRF
> - **Session: STATELESS** - No server-side sessions
> - Public endpoints: `/api/auth/login`, `/api/accounts/open`
> - **All other requests require authentication**

> **[SHOW: JwtUtil.java]**

> `JwtUtil` handles JWT operations:
> - **`generateToken()`** - Creates signed JWT with HMAC SHA-256
> - **Token expiration: 24 hours**
> - **`isValid()`** - Validates token integrity
> - **`extractSubject()`** - Gets user email from token

> **[SHOW: JwtAuthenticationFilter.java]**

> This filter intercepts every request:
> 1. Extracts token from **Authorization: Bearer** header
> 2. Validates using JwtUtil
> 3. Sets **SecurityContext** with authenticated user

> **[SHOW: AuthService.java]**

> Login flow:
> 1. User can login with **email OR phone**
> 2. Password verified using **BCrypt encoder**
> 3. Account status verified as **ACTIVE**
> 4. Returns JWT token with account details"

---

## SECTION 4: Core Banking (3:00 - 4:30)

> **[SHOW: TransferService.java]**

**SPEAK:**

> "Let's look at **fund transfers**.
>
> Notice **`@Transactional`** - ensures:
> - If any step fails, the entire operation **rolls back**
> - Database remains in **consistent state**
>
> Transfer logic:
> 1. Get authenticated user from **SecurityContextHolder**
> 2. Verify both sender and receiver accounts are **ACTIVE**
> 3. **Prevent self-transfers**
> 4. Check for **sufficient balance** - log failed transaction if not
> 5. Update both balances **atomically**
> 6. Create **two transaction records**

> **[SHOW: Transaction.java]**

> Each transaction records:
> - **Unique transaction ID** (UUID)
> - **Type**: DEPOSIT, WITHDRAW, TRANSFER
> - **Amount** with 19-digit precision, 2 decimals
> - **Balance before and after** - audit trail
> - **Status**: SUCCESS or FAILED
> - **Timestamp** via `@PrePersist`

> **[SHOW: Account.java]**

> Account entity uses:
> - **Unique account number**
> - **`BigDecimal`** for balance - never use `double` for money!
> - **Status**: ACTIVE, INACTIVE, BLOCKED
> - **ManyToOne** relationship with Users"

---

## SECTION 5: Razorpay Integration (4:30 - 5:15)

> **[SHOW: RazorpayService.java]**

**SPEAK:**

> "For deposits, I've integrated **Razorpay**.
>
> API keys injected from **application.properties** using `@Value`.
>
> **createOrder** method:
> 1. Converts amount to **paise**
> 2. Creates order with unique receipt ID
> 3. Returns order details for frontend
>
> **verifySignature** method:
> 1. Uses **HMAC SHA-256** signature verification
> 2. Concatenates orderId + paymentId
> 3. Compares with Razorpay's signature
>
> **[SHOW: PaymentController.java]**
>
> Two-step security:
> 1. Create order → save with CREATED status
> 2. Verify payment → update to SUCCESS → deposit funds"

---

## SECTION 6: Exception Handling (5:15 - 5:45)

> **[SHOW: GlobalExceptionHandler.java]**

**SPEAK:**

> "Centralized exception handling using `@RestControllerAdvice`:
>
> - **InvalidCredentialsException** → 401 UNAUTHORIZED
> - **AccountNotFoundException** → 404 NOT FOUND
> - **AccountNotActiveException** → 403 FORBIDDEN
> - **DuplicateResourceException** → 409 CONFLICT
>
> Best practices used:
> - **DTO pattern** for API contracts
> - **Constructor injection** for dependencies
> - **Input validation** using `@Valid`
> - **Builder pattern** with Lombok"

---

## SECTION 7: Conclusion (5:45 - 6:00)

**SPEAK:**

> "To summarize, this banking backend demonstrates:
> - **Secure JWT authentication** with Spring Security
> - **Transactional integrity** for financial operations
> - **Payment gateway integration** with verification
> - **Clean architecture** with separation of concerns
>
> Thank you for watching!"

---

## Files to Show During Recording

1. `pom.xml` - Dependencies
2. Project folder structure
3. `SecurityConfig.java`
4. `JwtUtil.java`
5. `JwtAuthenticationFilter.java`
6. `AuthService.java`
7. `TransferService.java`
8. `Transaction.java`
9. `RazorpayService.java`
10. `PaymentController.java`
11. `GlobalExceptionHandler.java`

---

# Test Implementation Documentation

## Test Classes Created

### 1. JwtUtilTest.java (8 tests)
**Location:** `src/test/java/com/bank/banking_app/security/`

| Test Method | Description |
|-------------|-------------|
| `generateToken_ShouldReturnValidToken` | Verifies token has 3 parts (JWT format) |
| `extractSubject_ShouldReturnCorrectEmail` | Extracts correct email from token |
| `isValid_ShouldReturnTrue_ForValidToken` | Valid token returns true |
| `isValid_ShouldReturnFalse_ForInvalidToken` | Invalid token returns false |
| `isValid_ShouldReturnFalse_ForTamperedToken` | Tampered token fails validation |
| `isValid_ShouldReturnFalse_ForNullToken` | Null token returns false |
| `isValid_ShouldReturnFalse_ForEmptyToken` | Empty token returns false |
| `generateToken_ShouldGenerateDifferentTokens` | Different emails create different tokens |

---

### 2. AuthServiceTest.java (5 tests)
**Location:** `src/test/java/com/bank/banking_app/service/`

| Test Method | Description |
|-------------|-------------|
| `login_WithValidEmail_ShouldReturnToken` | Login with email returns JWT |
| `login_WithValidPhone_ShouldReturnToken` | Login with phone returns JWT |
| `login_WithWrongPassword_ShouldThrowException` | Wrong password throws InvalidCredentialsException |
| `login_WithNonExistentUser_ShouldThrowException` | Non-existent user throws exception |
| `login_WithInactiveAccount_ShouldThrowException` | Inactive account throws AccountNotActiveException |

---

### 3. OpenAccountServiceTest.java (5 tests)
**Location:** `src/test/java/com/bank/banking_app/service/`

| Test Method | Description |
|-------------|-------------|
| `openAccount_ShouldCreateUserAndAccount` | Creates user and 12-digit account number |
| `openAccount_WithDuplicateEmail_ShouldThrowException` | Duplicate email throws BadRequestException |
| `openAccount_WithDuplicatePhone_ShouldThrowException` | Duplicate phone throws exception |
| `openAccount_WithDuplicateAadhaar_ShouldThrowException` | Duplicate Aadhaar throws exception |
| `openAccount_WithDuplicatePan_ShouldThrowException` | Duplicate PAN throws exception |

---

### 4. TransferServiceTest.java (6 tests)
**Location:** `src/test/java/com/bank/banking_app/service/`

| Test Method | Description |
|-------------|-------------|
| `transfer_ShouldDebitSenderAndCreditReceiver` | Successful transfer updates both balances |
| `transfer_WithInsufficientBalance_ShouldThrowAndLogFailedTransaction` | Logs failed transaction on insufficient funds |
| `transfer_ToSameAccount_ShouldThrowException` | Self-transfer throws IllegalArgumentException |
| `transfer_WithInactiveSenderAccount_ShouldThrowException` | Inactive sender throws exception |
| `transfer_WithInactiveReceiverAccount_ShouldThrowException` | Inactive receiver throws exception |
| `transfer_ToNonExistentAccount_ShouldThrowException` | Non-existent receiver throws AccountNotFoundException |

---

### 5. DepositServiceTest.java (3 tests)
**Location:** `src/test/java/com/bank/banking_app/service/`

| Test Method | Description |
|-------------|-------------|
| `deposit_ShouldIncreaseBalanceAndCreateTransaction` | Deposit increases balance, creates transaction |
| `deposit_WithInactiveAccount_ShouldThrowException` | Inactive account throws exception |
| `deposit_MultipleTimes_ShouldAccumulateBalance` | Multiple deposits accumulate correctly |

---

### 6. WithDrawServiceTest.java (4 tests)
**Location:** `src/test/java/com/bank/banking_app/serviceTest/`

| Test Method | Description |
|-------------|-------------|
| `testForWithDrawService` | Successful withdrawal updates balance |
| `withdraw_WithInsufficientBalance_ShouldThrowAndCreateFailedTransaction` | Logs failed transaction on insufficient funds |
| `withdraw_WithInactiveAccount_ShouldThrowException` | Inactive account throws exception |
| `withdraw_ExactBalance_ShouldLeaveZeroBalance` | Exact withdrawal leaves zero balance |

---

# Test Summary

## Total Tests: 31

| Test Class | Tests | Type |
|------------|-------|------|
| JwtUtilTest | 8 | Unit |
| AuthServiceTest | 5 | Integration |
| OpenAccountServiceTest | 5 | Integration |
| TransferServiceTest | 6 | Integration |
| DepositServiceTest | 3 | Integration |
| WithDrawServiceTest | 4 | Integration |

## Run Tests

```bash
# Run all tests
./mvnw test

# Run specific test class
./mvnw test -Dtest=JwtUtilTest
./mvnw test -Dtest=AuthServiceTest
./mvnw test -Dtest=TransferServiceTest
```

## Test Pattern Used

All integration tests follow:
- `@SpringBootTest` - Full application context
- `@Transactional` - Automatic rollback after each test
- `@BeforeEach` - Clean database before each test
- Helper methods for entity creation and security context setup

---

## Key Testing Highlights

1. **Security Context Setup** - Tests set authenticated user via `SecurityContextHolder`
2. **Transaction Logging** - Failed operations still create FAILED transaction records
3. **Balance Verification** - Using `BigDecimal.compareTo()` for precise comparisons
4. **Edge Cases** - Testing inactive accounts, insufficient balance, duplicate records

---

*Generated for Banking App Backend Project Walkthrough*
