package com.poly.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.poly.entity.OrderDetails;
import com.poly.entity.Orders;
import com.poly.entity.Size;

@Repository
public interface OrderDetailsRepository extends JpaRepository<OrderDetails, Integer> {
	List<OrderDetails> findByOrderId(Integer orderId);
	@Query("SELECT od FROM OrderDetails od JOIN FETCH od.size s JOIN FETCH s.product p JOIN FETCH p.images WHERE od.order.id = :orderId")
    List<OrderDetails> findDetailsWithImagesByOrderId(@Param("orderId") Integer orderId);
	
	// Tìm chi tiết đơn hàng theo Order và Size
    Optional<OrderDetails> findByOrderAndSize(Orders order, Size size);
}
