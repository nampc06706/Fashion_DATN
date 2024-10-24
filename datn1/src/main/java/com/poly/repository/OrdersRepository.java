package com.poly.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.poly.entity.Orders;

@Repository
public interface OrdersRepository extends JpaRepository<Orders, Integer> {
	// Tìm hóa đơn theo Account ID
    List<Orders> findByAccountId(Integer accountId);
    boolean existsByAddressId(Integer addressId);

}
