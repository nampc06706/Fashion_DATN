package com.poly.repository;

import com.poly.entity.ShippingMethods;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShippingMethodsRepository extends JpaRepository<ShippingMethods, Integer> {
    // Thêm các phương thức truy vấn tùy chỉnh nếu cần
}
