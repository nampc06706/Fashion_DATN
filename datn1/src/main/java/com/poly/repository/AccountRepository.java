package com.poly.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.poly.entity.Account;

@Repository
public interface AccountRepository extends JpaRepository<Account, Integer> {
    @Query("SELECT acc FROM Account acc WHERE acc.username = ?1 AND acc.password = ?2")
    Account findByUsernameAndPassword(String username, String password);

    Account findByUsername(String username);

    Account findByEmail(String email);
    
    Account findByPhone(String phone);

    @Modifying // Đánh dấu phương thức là sửa đổi dữ liệu
    @Transactional // Đánh dấu phương thức là giao dịch
    @Query("UPDATE Account acc SET acc.password = ?1 WHERE acc.email = ?2")
    int updatePasswordByEmail(String newPassword, String email);
}

