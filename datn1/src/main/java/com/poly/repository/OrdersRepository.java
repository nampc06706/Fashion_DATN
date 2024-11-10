package com.poly.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.poly.entity.Orders;

import jakarta.transaction.Transactional;

@Repository
public interface OrdersRepository extends JpaRepository<Orders, Integer> {
	// Tìm hóa đơn theo Account ID
	List<Orders> findByAccountId(Integer accountId);

	boolean existsByAddressId(Integer addressId);

	// Cập nhật trạng thái của đơn hàng theo Order ID
	@Modifying
	@Transactional
	@Query("UPDATE Orders o SET o.status = :status WHERE o.id = :orderId")
	int updateOrderStatusById(@Param("orderId") Integer orderId, @Param("status") String status);

	// Đếm số lượng đơn hàng có status và thuộc accountId cụ thể
    long countByStatusAndAccount_Id(Integer status, Integer accountId);

}
