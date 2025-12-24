package com.bank.banking_app.Transformer;

import com.bank.banking_app.enums.TransactionStatus;
import com.bank.banking_app.enums.TransactionType;
import com.bank.banking_app.models.Account;
import com.bank.banking_app.models.Transaction;

import java.math.BigDecimal;

public class TransactionTransformer {

    public static Transaction depositTransaction(Account account,
                                                 BigDecimal amount,
                                                 BigDecimal balanceBefore,
                                                 BigDecimal balanceAfter) {

        return Transaction.builder()
                .transactionType(TransactionType.DEPOSIT)
                .amount(amount)
                .balanceBefore(balanceBefore)
                .balanceAfter(balanceAfter)
                .status(TransactionStatus.SUCCESS)
                .account(account)
                .build();
    }

    public static Transaction withDrawTransaction(Account account,
                                                  BigDecimal amount,
                                                  BigDecimal balanceBefore,
                                                  BigDecimal balanceAfter,
                                                  TransactionStatus status) {
        return Transaction.builder()
                .transactionType(TransactionType.WITHDRAW)
                .amount(amount)
                .balanceBefore(balanceBefore)
                .balanceAfter(balanceAfter)
                .status(status)
                .account(account)
                .build();

    }
    public static Transaction transferDebit(Account account,
                                            BigDecimal amount,
                                            BigDecimal before,
                                            BigDecimal after,
                                            TransactionStatus status) {

        return Transaction.builder()
                .transactionType(TransactionType.TRANSFER)
                .amount(amount)
                .balanceBefore(before)
                .balanceAfter(after)
                .status(status)
                .account(account)
                .build();
    }
    public static Transaction transferCredit(Account account,
                                             BigDecimal amount,
                                             BigDecimal before,
                                             BigDecimal after) {

        return Transaction.builder()
                .transactionType(TransactionType.TRANSFER)
                .amount(amount)
                .balanceBefore(before)
                .balanceAfter(after)
                .status(TransactionStatus.SUCCESS)
                .account(account)
                .build();
    }
}

