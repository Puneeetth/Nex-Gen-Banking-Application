package com.bank.banking_app.dto.response;

import com.bank.banking_app.AccountStatus;
import com.bank.banking_app.enums.AccountType;
import com.bank.banking_app.enums.KycStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MeResponse {
    private String fullName;
    private String email;
    private String phone;

    private String accountNumber;
    private AccountType accountType;
    private BigDecimal balance;
    private AccountStatus status;

    private KycStatus kycStatus;
}
