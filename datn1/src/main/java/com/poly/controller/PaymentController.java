package com.poly.controller;

import java.math.BigDecimal;
import java.net.URI;
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
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.poly.dto.OrderRequestDTO;
import com.poly.entity.Orders;
import com.poly.entity.Payment;
import com.poly.service.OrdersService;
import com.poly.service.PaymentService;
import com.poly.service.VNPayService;

@RestController
@RequestMapping("/api/user/payments")
public class PaymentController {

	@Autowired
	private PaymentService paymentService;
	@Autowired
	private OrdersService ordersService;

	@Autowired
	private VNPayService vnPayService;
	private static final Logger logger = LoggerFactory.getLogger(PaymentController.class);

	// Endpoint để tạo URL thanh toán
	@PostMapping("/create-payment-url")
	@PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF', 'USER')")
	public ResponseEntity<Map<String, String>> createPaymentUrl(@RequestBody OrderRequestDTO orderRequestDTO) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		// Kiểm tra xác thực
		if (authentication == null || !authentication.isAuthenticated()) {
			logger.error("Authentication is null or not authenticated.");
			Map<String, String> response = new HashMap<>();
			response.put("message", "You are not authorized to perform this action.");
			return ResponseEntity.ok(response);
		}

		try {
			Orders orders = ordersService.createOrder(orderRequestDTO);
			if (orderRequestDTO.getPaymentId() == 1) {
				// Gọi phương thức createPaymentUrl để tạo link thanh toán
				String paymentUrl = paymentService.createPaymentUrl(orders, orderRequestDTO.getCartItems());
				// Trả về link thanh toán dưới dạng JSON
				Map<String, String> response = new HashMap<>();
				response.put("vnpayUrl", paymentUrl);
				return ResponseEntity.ok(response);
			} else {
				// Trả về phản hồi thành công
				Map<String, String> response = new HashMap<>();
				response.put("message", "Đơn hàng đã được xử lý thành công!");
				return ResponseEntity.ok(response);
			}
		} catch (Exception e) {
			// Xử lý khi có lỗi và trả về thông báo lỗi
			Map<String, String> errorResponse = new HashMap<>();
			errorResponse.put("error", e.getMessage());
			return ResponseEntity.status(500).body(errorResponse);
		}
	}

	@GetMapping("/vnpay/callback")
	public ResponseEntity<Map<String, String>> paymentCallback(@RequestParam Map<String, String> allParams) {
		Map<String, String> fields = new HashMap<>(allParams);
		try {
			String txnRef = fields.get("vnp_TxnRef");
			String vnp_Amount = fields.get("vnp_Amount");
			String vnp_ResponseCode = fields.get("vnp_ResponseCode");

			// Kiểm tra thông tin đơn hàng
			if (txnRef == null || vnp_Amount == null || vnp_ResponseCode == null) {
				return ResponseEntity.ok(Map.of("RspCode", "99", "Message", "Missing parameters"));
			}

			int orderID = Integer.valueOf(txnRef);
			boolean checkOrderId = ordersService.checkOrderExists(orderID);
			boolean checkOrderStatus = ordersService.checkOrderStatus(orderID);

			if (checkOrderId) {
				if (checkOrderStatus) {
					// Cập nhật trạng thái thanh toán
					if ("00".equals(vnp_ResponseCode)) {
						ordersService.updateOrderStatus(orderID, 0); // 0 là trạng thái thành công

						// Điều hướng đến trang Success với các thông tin cần thiết
						String redirectUrl = String.format(
								"http://localhost:5173/checkout/succes?orderID=%d&amount=%s&paymentMethod=VNPay",
								orderID, vnp_Amount);
						return ResponseEntity.status(HttpStatus.FOUND).location(URI.create(redirectUrl)).build();
					} else {
						ordersService.updateOrderStatus(orderID, 99); // 99 là trạng thái thất bại
						// Điều hướng đến trang thất bại
						String redirectUrl = String.format(
								"http://localhost:5173/checkout/payment-failed?orderID=%d&amount=%s&paymentMethod=VNPay",
								orderID, vnp_Amount);
						ordersService.restoreOrderStock(orderID); // Hoàn lại kho nếu thanh toán thất bại
						return ResponseEntity.status(HttpStatus.FOUND).location(URI.create(redirectUrl)).build();
					}
				} else {
					// Cập nhật trạng thái thanh toán
					if ("00".equals(vnp_ResponseCode)) {
						ordersService.updateOrderStatus(orderID, 0); // 0 là trạng thái thành công

						// Điều hướng đến trang Success với các thông tin cần thiết
						String redirectUrl = String.format(
								"http://localhost:5173/checkout/succes?orderID=%d&amount=%s&paymentMethod=VNPay",
								orderID, vnp_Amount);
						return ResponseEntity.status(HttpStatus.FOUND).location(URI.create(redirectUrl)).build();
					} else {
						ordersService.updateOrderStatus(orderID, 99); // 99 là trạng thái thất bại
						// Điều hướng đến trang thất bại
						String redirectUrl = String.format(
								"http://localhost:5173/checkout/payment-failed?orderID=%d&amount=%s&paymentMethod=VNPay",
								orderID, vnp_Amount);
						ordersService.restoreOrderStock(orderID); // Hoàn lại kho nếu thanh toán thất bại
						return ResponseEntity.status(HttpStatus.FOUND).location(URI.create(redirectUrl)).build();
					}
				}
			} else {
				return ResponseEntity.ok(Map.of("RspCode", "01", "Message", "Order not Found"));
			}
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Map.of("RspCode", "99", "Message", "Unknown error: " + e.getMessage()));
		}
	}

	@PostMapping("/payment-again")
	@PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF', 'USER')")
	public ResponseEntity<Map<String, String>> createPaymentAgain(Orders order,
	        @RequestBody Map<String, String> payload) {
	    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
	    if (authentication == null || !authentication.isAuthenticated()) {
	        logger.error("Authentication is null or not authenticated.");
	        Map<String, String> response = new HashMap<>();
	        response.put("message", "You are not authorized to perform this action.");
	        return ResponseEntity.ok(response);
	    }
	    try {
	        String orderIdStr = payload.get("orderId");
	        Orders orders = ordersService.findById(Integer.valueOf(orderIdStr));

	        BigDecimal totalAmount = orders.getOrderDetails().stream()
	                .map(od -> od.getPrice().multiply(BigDecimal.valueOf(od.getQuantity())))
	                .reduce(BigDecimal.ZERO, BigDecimal::add);

	        BigDecimal shipmentFee = orders.getShipmentFee();
	        BigDecimal totalAmountWithShipping = totalAmount.add(shipmentFee);

	        int amountInVND = totalAmountWithShipping.multiply(BigDecimal.valueOf(100)).intValue();


	        logger.info("Total Amount: {}", totalAmount);
	        logger.info("Shipment Fee: {}", shipmentFee);
	        logger.info("Total Amount with Shipping: {}", totalAmountWithShipping);
	        logger.info("Amount in VND: {}", amountInVND);

	        String paymentUrl = vnPayService.createOrder(orders.getId(), amountInVND, "Thanh toán đơn hàng");
	        Map<String, String> response = new HashMap<>();
	        response.put("vnpayUrl", paymentUrl);
	        return ResponseEntity.ok(response);
	    } catch (Exception e) {
	        Map<String, String> errorResponse = new HashMap<>();
	        errorResponse.put("error", e.getMessage());
	        return ResponseEntity.status(500).body(errorResponse);
	    }
	}


	@GetMapping("/{id}")
	public ResponseEntity<Payment> getPaymentById(@PathVariable Integer id) {
		Payment payment = paymentService.findById(id);
		return payment != null ? new ResponseEntity<>(payment, HttpStatus.OK)
				: new ResponseEntity<>(HttpStatus.NOT_FOUND);
	}

	@GetMapping
	public ResponseEntity<List<Payment>> getAllPayments() {
		List<Payment> payments = paymentService.findAll();
		return new ResponseEntity<>(payments, HttpStatus.OK);
	}

	@PostMapping
	public ResponseEntity<Payment> createPayment(@RequestBody Payment payment) {
		Payment createdPayment = paymentService.save(payment);
		return new ResponseEntity<>(createdPayment, HttpStatus.CREATED);
	}

	@PutMapping("/{id}")
	public ResponseEntity<Payment> updatePayment(@PathVariable Integer id, @RequestBody Payment payment) {
		Payment updatedPayment = paymentService.update(id, payment);
		return new ResponseEntity<>(updatedPayment, HttpStatus.OK);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deletePayment(@PathVariable Integer id) {
		paymentService.delete(id);
		return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	}
}
