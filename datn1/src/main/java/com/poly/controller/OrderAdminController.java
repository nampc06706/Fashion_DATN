package com.poly.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.poly.entity.Orders;
import com.poly.service.OrdersService;

@RestController
@RequestMapping("/api/staff/orders")
public class OrderAdminController {

	private static final Logger logger = LoggerFactory.getLogger(OrdersController.class);

	@Autowired
	private OrdersService ordersService;

	@PreAuthorize("hasAnyAuthority('ADMIN','STAFF')")
	@GetMapping()
	public ResponseEntity<List<Orders>> getAllOrders() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		// Kiểm tra xác thực
		if (authentication == null || !authentication.isAuthenticated()) {
			logger.error("Authentication is null or not authenticated.");
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // Trả về mã 401 Unauthorized
		}
		List<Orders> orders = ordersService.getAllOrders();
		return new ResponseEntity<>(orders, HttpStatus.OK);
	}

	@PreAuthorize("hasAnyAuthority('ADMIN','STAFF')")
	@PutMapping()
	public ResponseEntity<Map<String, Object>> updateStatus(@RequestParam Integer orderId,
			@RequestParam String status) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		// Kiểm tra xác thực
		if (authentication == null || !authentication.isAuthenticated()) {
			logger.error("Authentication is null or not authenticated.");
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // Trả về mã 401 Unauthorized
		}

		Map<String, Object> response = new HashMap<>();

		try {
			// Kiểm tra xem orderId có null không
			if (orderId == null) {
				logger.error("orderId is null.");
				return ResponseEntity.badRequest().build(); // Trả về mã 400 Bad Request
			}
			Orders statusOrder = ordersService.updateOrderStatus(orderId, status);
			response.put("status", HttpStatus.CREATED.value()); // 201
			response.put("data", statusOrder);
			return ResponseEntity.status(HttpStatus.CREATED).body(response);
		} catch (Exception e) {
			response.put("status", HttpStatus.BAD_REQUEST.value()); // 400
			response.put("data", e.getMessage());
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
		}

	}

}
