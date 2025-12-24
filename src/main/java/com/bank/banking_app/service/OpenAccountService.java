package com.bank.banking_app.service;

import com.bank.banking_app.Transformer.AccountTransformer;
import com.bank.banking_app.Transformer.UserTransformer;
import com.bank.banking_app.dto.request.OpenAccountRequest;
import com.bank.banking_app.dto.response.OpenAccountResponse;
import com.bank.banking_app.enums.KycStatus;
import com.bank.banking_app.exception.BadRequestException;
import com.bank.banking_app.models.Account;
import com.bank.banking_app.models.Users;
import com.bank.banking_app.repository.AccountRepository;
import com.bank.banking_app.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class OpenAccountService {
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;

    public OpenAccountService(UserRepository userRepository, AccountRepository accountRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public OpenAccountResponse openAccount(OpenAccountRequest request){
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists");
        }

        if (userRepository.existsByPhone(request.getPhone())) {
            throw new BadRequestException("Phone already exists");
        }

        if (userRepository.existsByAadhaarNumber(request.getAadhaarNumber())) {
            throw new BadRequestException("Aadhaar already exists");
        }

        if (userRepository.existsByPanCardNumber(request.getPanCardNumber())) {
            throw new BadRequestException("PAN already exists");
        }
        Users user = UserTransformer.accountRequestToUser(request,passwordEncoder);
        Users savedUser = userRepository.save(user);

        Account account = AccountTransformer.accountRequestToAccount(
                generateAccountNumber(),
                request.getAccountType(),
                request.getInitialDeposit(),
                KycStatus.AccountStatus.ACTIVE,
                savedUser
        );
        Account savedAccount = accountRepository.save(account);

        return AccountTransformer.accountToAccountResponse(savedAccount);
}

    private String generateAccountNumber() {
        return String.valueOf(
                100000000000L + (long) (Math.random() * 900000000000L)
        );
    }
}
