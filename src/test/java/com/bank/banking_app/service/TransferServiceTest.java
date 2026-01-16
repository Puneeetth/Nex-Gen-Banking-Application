package com.bank.banking_app.service;

import com.bank.banking_app.dto.request.TransferRequest;
import com.bank.banking_app.enums.AccountType;
import com.bank.banking_app.enums.KycStatus;
import com.bank.banking_app.enums.TransactionStatus;
import com.bank.banking_app.enums.TransactionType;
import com.bank.banking_app.exception.AccountNotActiveException;
import com.bank.banking_app.exception.AccountNotFoundException;
import com.bank.banking_app.exception.InsufficientBalanceException;
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
 * Integration tests for TransferService
 * Tests fund transfer functionality and various error scenarios
 */
@SpringBootTest
@Transactional
class TransferServiceTest {

        @Autowired
        private TransferService transferService;

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private AccountRepository accountRepository;

        @Autowired
        private TransactionRepository transactionRepository;

        @Autowired
        private PaymentRepository paymentRepository;

        private static final String SENDER_EMAIL = "sender@example.com";
        private static final String RECEIVER_EMAIL = "receiver@example.com";
        private Account senderAccount;
        private Account receiverAccount;

        @BeforeEach
        void setUp() {
                paymentRepository.deleteAll();
                transactionRepository.deleteAll();
                accountRepository.deleteAll();
                userRepository.deleteAll();

                setSecurityContext(SENDER_EMAIL);
                createSenderAndReceiver();
        }

        @Test
        @DisplayName("Transfer should debit sender and credit receiver correctly")
        void transfer_ShouldDebitSenderAndCreditReceiver() {
                // Given
                TransferRequest request = new TransferRequest();
                request.setReceiverAccountNumber(receiverAccount.getAccountNumber());
                request.setAmount(new BigDecimal("2000.00"));

                // When
                transferService.transfer(request);

                // Then
                Account updatedSender = accountRepository.findById(senderAccount.getId()).get();
                Account updatedReceiver = accountRepository.findById(receiverAccount.getId()).get();

                assertThat(updatedSender.getBalance().compareTo(new BigDecimal("8000.00"))).isEqualTo(0);
                assertThat(updatedReceiver.getBalance().compareTo(new BigDecimal("7000.00"))).isEqualTo(0);

                // Verify transactions were created
                List<Transaction> transactions = transactionRepository.findAll();
                assertThat(transactions).hasSize(2);

                // Verify both transactions are of TRANSFER type
                assertThat(transactions.stream()
                                .allMatch(t -> t.getTransactionType() == TransactionType.TRANSFER)).isTrue();

                // Verify sender (debit) transaction
                Transaction senderTxn = transactions.stream()
                                .filter(t -> t.getAccount().getId().equals(senderAccount.getId()))
                                .findFirst().orElseThrow();
                assertThat(senderTxn.getStatus()).isEqualTo(TransactionStatus.SUCCESS);
                assertThat(senderTxn.getBalanceBefore().compareTo(new BigDecimal("10000.00"))).isEqualTo(0);
                assertThat(senderTxn.getBalanceAfter().compareTo(new BigDecimal("8000.00"))).isEqualTo(0);

                // Verify receiver (credit) transaction
                Transaction receiverTxn = transactions.stream()
                                .filter(t -> t.getAccount().getId().equals(receiverAccount.getId()))
                                .findFirst().orElseThrow();
                assertThat(receiverTxn.getStatus()).isEqualTo(TransactionStatus.SUCCESS);
        }

        @Test
        @DisplayName("Transfer with insufficient balance should throw and log failed transaction")
        void transfer_WithInsufficientBalance_ShouldThrowAndLogFailedTransaction() {
                // Given
                TransferRequest request = new TransferRequest();
                request.setReceiverAccountNumber(receiverAccount.getAccountNumber());
                request.setAmount(new BigDecimal("15000.00")); // More than sender's balance

                // When & Then
                assertThatThrownBy(() -> transferService.transfer(request))
                                .isInstanceOf(InsufficientBalanceException.class)
                                .hasMessageContaining("Insufficient balance");

                // Verify failed transaction was logged
                List<Transaction> transactions = transactionRepository.findAll();
                assertThat(transactions).hasSize(1);
                assertThat(transactions.get(0).getStatus()).isEqualTo(TransactionStatus.FAILED);
        }

        @Test
        @DisplayName("Transfer to same account should throw exception")
        void transfer_ToSameAccount_ShouldThrowException() {
                // Given
                TransferRequest request = new TransferRequest();
                request.setReceiverAccountNumber(senderAccount.getAccountNumber());
                request.setAmount(new BigDecimal("1000.00"));

                // When & Then
                assertThatThrownBy(() -> transferService.transfer(request))
                                .isInstanceOf(IllegalArgumentException.class)
                                .hasMessageContaining("Cannot transfer to same account");
        }

        @Test
        @DisplayName("Transfer with inactive sender account should throw exception")
        void transfer_WithInactiveSenderAccount_ShouldThrowException() {
                // Given
                senderAccount.setStatus(KycStatus.AccountStatus.INACTIVE);
                accountRepository.save(senderAccount);

                TransferRequest request = new TransferRequest();
                request.setReceiverAccountNumber(receiverAccount.getAccountNumber());
                request.setAmount(new BigDecimal("1000.00"));

                // When & Then
                assertThatThrownBy(() -> transferService.transfer(request))
                                .isInstanceOf(AccountNotActiveException.class);
        }

        @Test
        @DisplayName("Transfer with inactive receiver account should throw exception")
        void transfer_WithInactiveReceiverAccount_ShouldThrowException() {
                // Given
                receiverAccount.setStatus(KycStatus.AccountStatus.INACTIVE);
                accountRepository.save(receiverAccount);

                TransferRequest request = new TransferRequest();
                request.setReceiverAccountNumber(receiverAccount.getAccountNumber());
                request.setAmount(new BigDecimal("1000.00"));

                // When & Then
                assertThatThrownBy(() -> transferService.transfer(request))
                                .isInstanceOf(AccountNotActiveException.class);
        }

        @Test
        @DisplayName("Transfer to non-existent account should throw exception")
        void transfer_ToNonExistentAccount_ShouldThrowException() {
                // Given
                TransferRequest request = new TransferRequest();
                request.setReceiverAccountNumber("999999999999");
                request.setAmount(new BigDecimal("1000.00"));

                // When & Then
                assertThatThrownBy(() -> transferService.transfer(request))
                                .isInstanceOf(AccountNotFoundException.class)
                                .hasMessageContaining("Receiver account not found");
        }

        // Helper methods
        private void setSecurityContext(String email) {
                Authentication auth = new UsernamePasswordAuthenticationToken(email, null, new ArrayList<>());
                SecurityContext context = SecurityContextHolder.createEmptyContext();
                context.setAuthentication(auth);
                SecurityContextHolder.setContext(context);
        }

        private void createSenderAndReceiver() {
                // Create sender
                Users sender = Users.builder()
                                .fullName("Sender User")
                                .email(SENDER_EMAIL)
                                .phone("9111111111")
                                .password("senderpass")
                                .aadhaarNumber("111111111111")
                                .panCardNumber("SENDA1234A")
                                .kycStatus(KycStatus.VERIFIED)
                                .build();
                sender = userRepository.save(sender);

                senderAccount = Account.builder()
                                .accountNumber("200000000001")
                                .accountType(AccountType.SAVINGS)
                                .balance(new BigDecimal("10000.00"))
                                .status(KycStatus.AccountStatus.ACTIVE)
                                .user(sender)
                                .build();
                senderAccount = accountRepository.save(senderAccount);

                // Create receiver
                Users receiver = Users.builder()
                                .fullName("Receiver User")
                                .email(RECEIVER_EMAIL)
                                .phone("9222222222")
                                .password("receiverpass")
                                .aadhaarNumber("222222222222")
                                .panCardNumber("RECVB5678B")
                                .kycStatus(KycStatus.VERIFIED)
                                .build();
                receiver = userRepository.save(receiver);

                receiverAccount = Account.builder()
                                .accountNumber("200000000002")
                                .accountType(AccountType.SAVINGS)
                                .balance(new BigDecimal("5000.00"))
                                .status(KycStatus.AccountStatus.ACTIVE)
                                .user(receiver)
                                .build();
                receiverAccount = accountRepository.save(receiverAccount);
        }
}
