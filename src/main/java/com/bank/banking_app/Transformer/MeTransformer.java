package com.bank.banking_app.Transformer;

import com.bank.banking_app.dto.response.MeResponse;
import com.bank.banking_app.models.Account;
import com.bank.banking_app.models.Users;

public class MeTransformer {
    public static MeResponse userAndAccountToMeResponse(Users user, Account account){
        return MeResponse.builder()
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .kycStatus(user.getKycStatus())
                .accountNumber(account.getAccountNumber())
                .accountType(account.getAccountType())
                .balance(account.getBalance())
                .status(account.getStatus())
                .build();
    }
}
