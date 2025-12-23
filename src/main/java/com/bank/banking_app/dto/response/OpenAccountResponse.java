package com.bank.banking_app.dto.response;

import com.bank.banking_app.AccountStatus;
import com.bank.banking_app.enums.AccountType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OpenAccountResponse {

    private String accountNumber;
    private AccountType accountType;
    private AccountStatus status;
    private String customerName;
    private String message;
}