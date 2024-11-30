package com.poly.service;

import java.math.BigDecimal;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.poly.dto.CartDTO;
import com.poly.entity.Orders;
import com.poly.entity.Payment;
import com.poly.entity.Size;
import com.poly.repository.CartsRepository;
import com.poly.repository.OrdersRepository;
import com.poly.repository.PaymentRepository;
import com.poly.repository.SizeRepository;

@Service
public class PaymentService {

	private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);

	@Autowired
	private SizeRepository sizeRepository;

	@Autowired
	private PaymentRepository paymentRepository;

	private final OrdersRepository ordersRepository;

	@Autowired
	private VNPayService vnPayService;

	public PaymentService(OrdersRepository ordersRepository, PaymentRepository paymentRepository) {
		this.ordersRepository = ordersRepository;
		this.paymentRepository = paymentRepository;
	}

	@Transactional
	public String createPaymentUrl(Orders order, List<CartDTO> cartDTOs) {
		// Tính tổng số tiền cho các sản phẩm trong giỏ hàng
		BigDecimal amount = calculateTotalAmount(cartDTOs).multiply(BigDecimal.valueOf(100)); // Chuyển sang đơn vị tiền
																								// tệ (đồng)

		// Lấy phí vận chuyển từ đơn hàng
		BigDecimal shipmentFee = order.getShipmentFee().multiply(BigDecimal.valueOf(100)); // Chuyển sang đơn vị tiền tệ
																							// (đồng)

		// Tính tổng số tiền bao gồm phí vận chuyển
		BigDecimal totalAmount = amount.add(shipmentFee);

		// Tạo URL thanh toán thông qua VNPayService
		String paymentUrl = vnPayService.createOrder(order.getId(), totalAmount.intValue(), "Thanh toán đơn hàng");

		logger.info("Payment URL: {}", paymentUrl);
		return paymentUrl;
	}

	// Phương thức tính tổng số tiền cho các sản phẩm trong giỏ hàng
	private BigDecimal calculateTotalAmount(List<CartDTO> cartItems) {
		return cartItems.stream().map(cartItem -> {
			// Kiểm tra và lấy đúng kích thước (size) và sản phẩm (product)
			Size size = sizeRepository.findById(cartItem.getSize().getId())
					.orElseThrow(() -> new RuntimeException("Size not found"));

			// Lấy giá sản phẩm từ size (đảm bảo giá tồn tại)
			BigDecimal productPrice = size.getProduct().getPrice();
			if (productPrice == null) {
				throw new RuntimeException("Product price not found");
			}

			// Lấy số lượng sản phẩm và đảm bảo là giá trị hợp lệ
			BigDecimal quantity = new BigDecimal(cartItem.getQuantity());
			if (quantity.compareTo(BigDecimal.ZERO) <= 0) {
				throw new RuntimeException("Quantity must be greater than zero");
			}

			// Tính toán giá trị cho sản phẩm này
			return productPrice.multiply(quantity);
		})
				// Tổng hợp giá trị từ tất cả các sản phẩm
				.reduce(BigDecimal.ZERO, BigDecimal::add);
	}

	public List<Payment> findAll() {
		return paymentRepository.findAll();
	}

	public Payment findById(Integer id) {
		return paymentRepository.findById(id).orElse(null);
	}

	public Payment save(Payment payment) {
		return paymentRepository.save(payment);
	}

	public Payment update(Integer id, Payment payment) {
		payment.setId(id);
		return paymentRepository.save(payment);
	}

	public void delete(Integer id) {
		paymentRepository.deleteById(id);
	}
}
