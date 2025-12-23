package com.bank.banking_app.service;

import com.bank.banking_app.AccountStatus;
import com.bank.banking_app.dto.request.LoginRequest;
import com.bank.banking_app.dto.response.LoginResponse;
import com.bank.banking_app.exception.AccountNotActiveException;
import com.bank.banking_app.exception.InvalidCredentialsException;
import com.bank.banking_app.models.Account;
import com.bank.banking_app.models.Users;
import com.bank.banking_app.repository.AccountRepository;
import com.bank.banking_app.repository.UserRepository;
import com.bank.banking_app.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository,
                       AccountRepository accountRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.passwordEncoder = passwordEncoder;
    }
       public LoginResponse login(LoginRequest request){
           Users user = userRepository.findByEmail(request.getIdentifier())
                   .or(()->userRepository.findByPhone(request.getIdentifier()))
                   .orElseThrow(()->new InvalidCredentialsException("Invalid Credentials"));

           if(!passwordEncoder.matches(request.getPassword(),user.getPassword()))
               throw new InvalidCredentialsException("Incorrect Password");
           Account account = accountRepository.findByUser(user)
                   .orElseThrow(()->new AccountNotActiveException("Account Not Found"));

           if(account.getStatus() != AccountStatus.ACTIVE)
               throw new AccountNotActiveException("Your Account is not Active");

           LoginResponse response = new LoginResponse();
           response.setToken(JwtUtil.generateToken(user.getEmail()));
           response.setAccountNumber(account.getAccountNumber());
           response.setAccountStatus(account.getStatus());

           return response;
       }

}
