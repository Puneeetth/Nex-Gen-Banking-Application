package com.bank.banking_app.dto.response;

import com.bank.banking_app.AccountStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class LoginResponse {
    private String token;
    private String accountNumber;
    private AccountStatus accountStatus;
}
