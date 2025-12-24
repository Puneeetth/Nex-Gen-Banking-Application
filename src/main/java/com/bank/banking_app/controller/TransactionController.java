package com.bank.banking_app.controller;

import com.bank.banking_app.dto.request.DepositRequest;
import com.bank.banking_app.service.DepositService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:5174", "http://localhost:3000" })

public class TransactionController {

    private final DepositService depositService;

    public TransactionController(DepositService depositService) {
        this.depositService = depositService;
    }

    @PostMapping("/deposit")
    public ResponseEntity<String> deposit(
            @Valid @RequestBody DepositRequest request) {

        depositService.deposit(request);
        return ResponseEntity.ok("Deposit successful");
    }
}
