package com.bank.banking_app.repository;

import com.bank.banking_app.models.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<Users, Long> {
    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);

    boolean existsByAadhaarNumber(String aadhaarNumber);

    boolean existsByPanCardNumber(String panCardNumber);

    Optional<Users> findByEmail(String email);

    Optional<Users> findByPhone(String phone);
}
