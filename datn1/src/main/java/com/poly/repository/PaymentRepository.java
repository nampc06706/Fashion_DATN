package com.poly.repository;

import com.poly.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    // Thêm các phương thức truy vấn tùy chỉnh nếu cần
}
