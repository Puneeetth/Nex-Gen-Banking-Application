package com.bank.banking_app.controller;

import com.bank.banking_app.dto.request.WithDrawRequest;
import com.bank.banking_app.service.WithDrawService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/transactions")
public class WithDrawController {

    private final WithDrawService withdrawService;

    public WithDrawController(WithDrawService withdrawService) {
        this.withdrawService = withdrawService;
    }

    @PostMapping("/withdraw")
    public ResponseEntity<String> withdraw(
            @Valid @RequestBody WithDrawRequest request) {

        withdrawService.withDraw(request);
        return ResponseEntity.ok("Withdrawal successful");
    }
}
