package com.bank.banking_app.controller;

import com.bank.banking_app.dto.request.DepositRequest;
import com.bank.banking_app.dto.request.PaymentVerifyRequest;
import com.bank.banking_app.dto.response.RazorpayOrderResponse;
import com.bank.banking_app.enums.PaymentStatus;
import com.bank.banking_app.exception.AccountNotFoundException;
import com.bank.banking_app.exception.InvalidCredentialsException;
import com.bank.banking_app.models.Account;
import com.bank.banking_app.models.Payment;
import com.bank.banking_app.models.Users;
import com.bank.banking_app.repository.AccountRepository;
import com.bank.banking_app.repository.PaymentRepository;
import com.bank.banking_app.repository.UserRepository;
import com.bank.banking_app.service.DepositService;
import com.bank.banking_app.service.RazorpayService;
import com.razorpay.RazorpayException;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:5174", "http://localhost:3000" })
public class PaymentController {

    private final RazorpayService razorpayService;
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final DepositService depositService;

    public PaymentController(RazorpayService razorpayService,
            PaymentRepository paymentRepository,
            UserRepository userRepository,
            AccountRepository accountRepository,
            DepositService depositService) {
        this.razorpayService = razorpayService;
        this.paymentRepository = paymentRepository;
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.depositService = depositService;
    }

    @PostMapping("/create-order")
    public ResponseEntity<RazorpayOrderResponse> createOrder(@RequestBody Map<String, Object> request) {
        try {
            BigDecimal amount = new BigDecimal(request.get("amount").toString());

            // Get current user's account
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            Users user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new InvalidCredentialsException("User not found"));
            Account account = accountRepository.findByUser(user)
                    .orElseThrow(() -> new AccountNotFoundException("Account not found"));

            // Create Razorpay order
            RazorpayOrderResponse orderResponse = razorpayService.createOrder(amount);

            // Save payment record with CREATED status
            Payment payment = Payment.builder()
                    .razorpayOrderId(orderResponse.getOrderId())
                    .amount(amount)
                    .status(PaymentStatus.CREATED)
                    .account(account)
                    .build();
            paymentRepository.save(payment);

            return ResponseEntity.ok(orderResponse);
        } catch (RazorpayException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<String> verifyPayment(@Valid @RequestBody PaymentVerifyRequest request) {
        // Verify signature
        boolean isValid = razorpayService.verifySignature(
                request.getRazorpayOrderId(),
                request.getRazorpayPaymentId(),
                request.getRazorpaySignature());

        if (!isValid) {
            // Update payment status to FAILED
            paymentRepository.findByRazorpayOrderId(request.getRazorpayOrderId())
                    .ifPresent(payment -> {
                        payment.setStatus(PaymentStatus.FAILED);
                        paymentRepository.save(payment);
                    });
            return ResponseEntity.badRequest().body("Payment verification failed");
        }

        // Update payment with success details
        Payment payment = paymentRepository.findByRazorpayOrderId(request.getRazorpayOrderId())
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        payment.setRazorpayPaymentId(request.getRazorpayPaymentId());
        payment.setRazorpaySignature(request.getRazorpaySignature());
        payment.setStatus(PaymentStatus.SUCCESS);
        paymentRepository.save(payment);

        // Process the deposit - add funds to account
        depositService.deposit(new DepositRequest(payment.getAmount()));

        return ResponseEntity.ok("Payment verified and deposit successful");
    }
}
