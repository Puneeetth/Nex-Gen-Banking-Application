package com.bank.banking_app.enums;

public enum KycStatus {
    PENDING,
    VERIFIED,
    REJECTED;

    public enum AccountStatus {
        ACTIVE,
        INACTIVE,
        CLOSED,
        BLOCKED
    }
}
