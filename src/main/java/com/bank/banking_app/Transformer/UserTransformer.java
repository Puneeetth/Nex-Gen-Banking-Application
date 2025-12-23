package com.bank.banking_app.Transformer;

import com.bank.banking_app.dto.request.OpenAccountRequest;
import com.bank.banking_app.enums.KycStatus;
import com.bank.banking_app.models.Users;
import org.springframework.security.crypto.password.PasswordEncoder;

public class UserTransformer {

    public static Users accountRequestToUser(OpenAccountRequest request, PasswordEncoder encoder) {
        return Users.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .password(encoder.encode(request.getPassword()))
                .aadhaarNumber(request.getAadhaarNumber())
                .panCardNumber(request.getPanCardNumber())
                .kycStatus(KycStatus.VERIFIED)
                .build();
    }
}