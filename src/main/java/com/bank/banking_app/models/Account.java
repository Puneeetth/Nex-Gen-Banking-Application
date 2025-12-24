package com.bank.banking_app.models;

import com.bank.banking_app.enums.AccountType;
import com.bank.banking_app.enums.KycStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name = "accounts")

public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = true, updatable = false)
    private String accountNumber;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AccountType accountType;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal balance;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private KycStatus.AccountStatus status;
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private Users user;
    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void createdAt(){
        this.createdAt = LocalDateTime.now();
    }
}
