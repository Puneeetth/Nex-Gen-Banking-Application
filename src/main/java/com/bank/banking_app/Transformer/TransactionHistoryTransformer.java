package com.bank.banking_app.Transformer;

import com.bank.banking_app.dto.response.TransactionHistoryResponse;
import com.bank.banking_app.models.Transaction;

public class TransactionHistoryTransformer {

    public static TransactionHistoryResponse transactionToResponse(Transaction transaction) {

        return TransactionHistoryResponse.builder()
                .transactionId(transaction.getTransactionId())
                .transactionType(transaction.getTransactionType())
                .amount(transaction.getAmount())
                .balanceBefore(transaction.getBalanceBefore())
                .balanceAfter(transaction.getBalanceAfter())
                .status(transaction.getStatus())
                .createdAt(transaction.getCreatedAt())
                .build();
    }
}
