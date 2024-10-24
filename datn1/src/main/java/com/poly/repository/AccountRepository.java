package com.poly.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.poly.entity.Account;

@Repository
public interface AccountRepository extends JpaRepository<Account, Integer> {
    @Query("SELECT acc FROM Account acc WHERE acc.username = ?1 AND acc.password = ?2")
    Account findByUsernameAndPassword(String username, String password);

    Account findByUsername(String username);

    Account findByEmail(String email);
    Account findByPhone(String phone);
    // Không cần thiết nếu các phương thức trên đã đúng
    // Optional<Account> findByUsername1(String username);
    // Optional<Account> findByUsernameAndPassword1(String username, String password);
}
