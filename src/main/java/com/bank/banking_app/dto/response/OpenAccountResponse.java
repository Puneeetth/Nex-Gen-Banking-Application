package com.bank.banking_app.dto.response;

import com.bank.banking_app.enums.AccountType;
import com.bank.banking_app.enums.KycStatus;
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
    private KycStatus.AccountStatus status;
    private String customerName;
    private String message;
}