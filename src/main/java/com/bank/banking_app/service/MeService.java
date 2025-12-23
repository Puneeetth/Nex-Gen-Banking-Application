package com.bank.banking_app.service;

import com.bank.banking_app.Transformer.MeTransformer;
import com.bank.banking_app.dto.response.MeResponse;
import com.bank.banking_app.exception.AccountNotFoundException;
import com.bank.banking_app.exception.InvalidCredentialsException;
import com.bank.banking_app.models.Account;
import com.bank.banking_app.models.Users;
import com.bank.banking_app.repository.AccountRepository;
import com.bank.banking_app.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class MeService {
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;

    public MeService(UserRepository userRepository,
                     AccountRepository accountRepository) {
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
    }
    public MeResponse me() {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        Users user = userRepository.findByEmail(email)
                .orElseThrow(() -> new InvalidCredentialsException("User not found"));

        Account account = accountRepository.findByUser(user)
                .orElseThrow(() -> new AccountNotFoundException("Account not found"));

        return MeTransformer.userAndAccountToMeResponse(user, account);
    }
}
