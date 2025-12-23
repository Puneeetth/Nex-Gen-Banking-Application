package com.bank.banking_app.controller;

import com.bank.banking_app.dto.request.OpenAccountRequest;
import com.bank.banking_app.dto.response.OpenAccountResponse;
import com.bank.banking_app.service.OpenAccountService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/accounts")
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:5174", "http://localhost:3000" })
public class OpenAccountController {

    private final OpenAccountService openAccountService;

    public OpenAccountController(OpenAccountService openAccountService) {
        this.openAccountService = openAccountService;
    }

    @PostMapping("/open")
    public ResponseEntity<OpenAccountResponse> openAccount(
            @Valid @RequestBody OpenAccountRequest request) {

        OpenAccountResponse response = openAccountService.openAccount(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}