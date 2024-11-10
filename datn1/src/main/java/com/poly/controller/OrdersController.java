package com.poly.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.poly.dto.OrderRequestDTO;
import com.poly.entity.Orders;
import com.poly.service.OrdersService;

@RestController
@RequestMapping("/api/user/orders")
public class OrdersController {

	private static final Logger logger = LoggerFactory.getLogger(OrdersController.class);

	@Autowired
	private OrdersService ordersService;

	@PostMapping("/create")
	@PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF', 'USER')")
	public ResponseEntity<?> createOrder(@RequestBody OrderRequestDTO orderRequest) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		if (authentication == null || !authentication.isAuthenticated()) {
			logger.error("Authentication is null or not authenticated.");
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not authorized to perform this action.");
		}

		logger.info("Current user: {}, with roles: {}", authentication.getName(), authentication.getAuthorities());
		logger.info("Received order request: {}", orderRequest);

		try {
			Orders createdOrder = ordersService.createOrder(orderRequest);
			// Có thể sử dụng DTO để kiểm soát dữ liệu phản hồi
			return ResponseEntity.ok(createdOrder);
		} catch (RuntimeException e) {
			logger.error("Error creating order: {}", e.getMessage());
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to create order. " + e.getMessage());
		} catch (Exception e) {
			logger.error("Unexpected error: ", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("An unexpected error occurred. Please try again later.");
		}
	}

	// Lấy tất cả hóa đơn của người dùng theo Account ID
	@PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF', 'USER')")
	@GetMapping("/{accountId}")
	public ResponseEntity<List<Orders>> getOrdersByAccountId(@PathVariable Integer accountId) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		// Kiểm tra xác thực
		if (authentication == null || !authentication.isAuthenticated()) {
			logger.error("Authentication is null or not authenticated.");
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // Trả về mã 401 Unauthorized
		}

		// Gọi dịch vụ để lấy danh sách đơn hàng
		List<Orders> orders = ordersService.getOrdersByAccountId(accountId);

		if (orders.isEmpty()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); // Trả về mã 404 nếu không tìm thấy hóa đơn
		}

		return ResponseEntity.ok(orders); // Trả về danh sách hóa đơn
	}

	@PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF', 'USER')")
	@PutMapping("/{orderId}/setStatus")
	public ResponseEntity<String> setOrderStatusToCompleted(@PathVariable int orderId) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		// Kiểm tra xác thực
		if (authentication == null || !authentication.isAuthenticated()) {
			logger.error("Authentication is null or not authenticated.");
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // Trả về mã 401 Unauthorized
		}
		int result = ordersService.updateOrderStatusById1(orderId, "5");

		if (result > 0) {
			return ResponseEntity.ok("Order status updated to 5 (completed).");
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found or update failed.");
		}
	}

	// API đếm số lượng đơn hàng có status = 1 theo accountId
	@PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF', 'USER')")
	@GetMapping("/count/new/{accountId}")
	public long countNewOrdersByAccount(@PathVariable("accountId") Integer accountId) {
		return ordersService.countOrdersWithStatusOneByAccountId(accountId);
	}

	// API đếm số lượng đơn hàng có status = 3 theo accountId
	@PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF', 'USER')")
	@GetMapping("/count/delivering/{accountId}")
	public long countDeliveringOrdersByAccount(@PathVariable("accountId") Integer accountId) {
		return ordersService.countOrdersWithStatusThreeByAccountId(accountId);
	}

	// API đếm số lượng đơn hàng có status = 5 theo accountId
	@PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF', 'USER')")
	@GetMapping("/count/complete/{accountId}")
	public long countCompleteOrdersByAccount(@PathVariable("accountId") Integer accountId) {
		return ordersService.countOrdersWithStatusFourByAccountId(accountId);
	}

}
