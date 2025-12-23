package com.bank.banking_app.Transformer;

import com.bank.banking_app.AccountStatus;
import com.bank.banking_app.dto.response.OpenAccountResponse;
import com.bank.banking_app.enums.AccountType;
import com.bank.banking_app.models.Account;
import com.bank.banking_app.models.Users;

import java.math.BigDecimal;

public class AccountTransformer {

        public static Account accountRequestToAccount(String accountNumber,
                                                      AccountType accountType,
                                                      BigDecimal balance,
                                                      AccountStatus status,
                                                      Users user) {
            return Account.builder()
                    .accountNumber(accountNumber)
                    .accountType(accountType)
                    .balance(balance)
                    .status(status)
                    .user(user)
                    .build();
        }

        public static OpenAccountResponse accountToAccountResponse(Account account) {
            OpenAccountResponse response = new OpenAccountResponse();
            response.setAccountNumber(account.getAccountNumber());
            response.setAccountType(account.getAccountType());
            response.setStatus(account.getStatus());
            response.setCustomerName(account.getUser().getFullName());
            response.setMessage("Account created successfully");
            return response;
        }
}
