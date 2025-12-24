package com.bank.banking_app.repository;

import com.bank.banking_app.models.Account;
import com.bank.banking_app.models.Transaction;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByAccount(Account account);

    List<Transaction> findByAccountOrderByCreatedAtDesc(Account account);

    Page<Transaction> findByAccount(Account account, Pageable pageable);
}
