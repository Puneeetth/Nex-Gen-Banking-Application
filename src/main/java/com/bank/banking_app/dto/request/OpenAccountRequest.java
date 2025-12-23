package com.bank.banking_app.dto.request;

import com.bank.banking_app.enums.AccountType;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OpenAccountRequest {
    @NotBlank
    private String fullName;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    @Pattern(regexp = "^[6-9]\\d{9}$")
    private String phone;

    @NotBlank
    @Size(min = 8)
    private String password;
    @NotBlank
    @Pattern(regexp = "\\d{12}")
    private String aadhaarNumber;

    @NotBlank
    @Pattern(regexp = "[A-Z]{5}[0-9]{4}[A-Z]")
    private String panCardNumber;
    @NotNull
    private AccountType accountType;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    private BigDecimal initialDeposit;
}
