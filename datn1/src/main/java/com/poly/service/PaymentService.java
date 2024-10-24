package com.poly.service;

import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Optional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.poly.dto.CartDTO;
import com.poly.dto.OrderRequestDTO;
import com.poly.entity.Account;
import com.poly.entity.Address;
import com.poly.entity.Carts;
import com.poly.entity.OrderDetails;
import com.poly.entity.Orders;
import com.poly.entity.Payment;
import com.poly.entity.ShippingMethods;
import com.poly.entity.Size;
import com.poly.repository.AccountRepository;
import com.poly.repository.AddressRepository;
import com.poly.repository.CartsRepository;
import com.poly.repository.OrderDetailsRepository;
import com.poly.repository.OrdersRepository;
import com.poly.repository.PaymentRepository;
import com.poly.repository.ShippingMethodsRepository;
import com.poly.repository.SizeRepository;

@Service
public class PaymentService {

	private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);

	@Autowired
	private AccountRepository accountRepository;

	@Autowired
	private AddressRepository addressRepository;

	@Autowired
	private ShippingMethodsRepository shippingMethodsRepository;

	@Autowired
	private OrderDetailsRepository orderDetailsRepository;

	@Autowired
	private SizeRepository sizeRepository;

	@Autowired
	private PaymentRepository paymentRepository;
	
	@Autowired
	private CartsRepository cartRepository;

	@Value("${vnp.apiUrl}")
	private String vnpApiUrl;

	@Value("${vnp.tmnCode}")
	private String tmnCode;

	@Value("${vnp.secretKey}")
	private String secretKey;

	@Value("${vnp.returnUrl}")
	private String returnUrl;

	private final OrdersRepository ordersRepository;

	public PaymentService(OrdersRepository ordersRepository, PaymentRepository paymentRepository) {
		this.ordersRepository = ordersRepository;
		this.paymentRepository = paymentRepository;
	}

	@Transactional
	public String createPaymentUrl(OrderRequestDTO orderRequest) {
		// Tạo đối tượng Orders mới
		Orders order = new Orders();
		order.setDate(LocalDateTime.now());
		order.setNote(orderRequest.getNote());
		order.setStatus(1); // 1 là trạng thái mới

		// Liên kết Account
		Account account = accountRepository.findById(orderRequest.getAccountId())
				.orElseThrow(() -> new RuntimeException("Account not found"));
		order.setAccount(account);

		// Liên kết Address
		Address address = addressRepository.findById(orderRequest.getAddressId())
				.orElseThrow(() -> new RuntimeException("Address not found"));
		order.setAddress(address);

		// Liên kết Payment
		Payment payment = paymentRepository.findById(orderRequest.getPaymentId())
				.orElseThrow(() -> new RuntimeException("Payment method not found"));
		order.setPayment(payment);

		// Liên kết ShippingMethod
		ShippingMethods shippingMethod = shippingMethodsRepository.findById(orderRequest.getShippingMethodId())
				.orElseThrow(() -> new RuntimeException("Shipping method not found"));
		order.setShippingMethod(shippingMethod);

		// Lưu đơn hàng
		Orders savedOrder = ordersRepository.save(order);

		// Xử lý từng item trong giỏ hàng
		List<CartDTO> cartItems = orderRequest.getCartItems();
		List<OrderDetails> orderDetailsList = new ArrayList<>();

		for (CartDTO cartItem : cartItems) {
			logger.info("Processing cart item: {}", cartItem);

			OrderDetails orderDetail = new OrderDetails();
			orderDetail.setOrder(savedOrder);

			// Lấy Size từ SizeDTO
			Size size = sizeRepository.findById(cartItem.getSize().getId())
					.orElseThrow(() -> new RuntimeException("Size not found"));

			// Kiểm tra xem size có product không
			if (size.getProduct() == null) {
				throw new RuntimeException("Product not found for size: " + size.getId());
			}

			orderDetail.setSize(size);
			orderDetail.setQuantity(cartItem.getQuantity());

			// Tính giá
			BigDecimal price = size.getProduct().getPrice().multiply(new BigDecimal(cartItem.getQuantity()));
			orderDetail.setPrice(price);

			// Giảm tồn kho
			if (size.getQuantityInStock() < cartItem.getQuantity()) {
				throw new RuntimeException("Insufficient stock for size: " + size.getId());
			}
			size.setQuantityInStock(size.getQuantityInStock() - cartItem.getQuantity());

			// Cập nhật Size trong cơ sở dữ liệu
			sizeRepository.save(size);
			orderDetailsList.add(orderDetail); // Thêm vào danh sách chi tiết đơn hàng
		}

		// Lưu tất cả chi tiết đơn hàng
		orderDetailsRepository.saveAll(orderDetailsList);

		// Xóa sản phẩm khỏi giỏ hàng sau khi đặt hàng thành công
		for (CartDTO cartItem : cartItems) {
			deleteCartFromDatabase(cartItem.getId(), account.getId());
		}

		// Tạo tham số VNPAY
		Map<String, String> vnpParams = new HashMap<>();
		vnpParams.put("vnp_Version", "2.0.0");
		vnpParams.put("vnp_Command", "pay");
		vnpParams.put("vnp_TmnCode", tmnCode);
		vnpParams.put("vnp_Amount", String.valueOf(orderDetailsList.stream().map(OrderDetails::getPrice)
				.reduce(BigDecimal.ZERO, BigDecimal::add).multiply(new BigDecimal(100)).intValue())); // Chuyển sang đơn
																										// vị tiền tệ
																										// (đồng)
		vnpParams.put("vnp_Currency", "VND");
		vnpParams.put("vnp_TxnRef", String.valueOf(order.getId())); // ID đơn hàng
		vnpParams.put("vnp_OrderInfo", "Thanh toán đơn hàng #" + order.getId());
		vnpParams.put("vnp_Locale", "vn");
		vnpParams.put("vnp_ReturnUrl", returnUrl);
		vnpParams.put("vnp_CreateDate",
				LocalDateTime.now().toString().replace("T", "").replace("-", "").replace(":", "").substring(0, 14));
		vnpParams.put("vnp_BankCode", "VNPAY"); // Thay đổi theo ngân hàng nếu cần

		// Tạo chữ ký
		String vnp_SecureHash = createSignature(vnpParams);
		vnpParams.put("vnp_SecureHash", vnp_SecureHash);

		// Tạo URL
		StringBuilder paymentUrl = new StringBuilder(vnpApiUrl);
		paymentUrl.append("?").append(buildQueryString(vnpParams));

		logger.info("Payment URL: {}", paymentUrl);
		return paymentUrl.toString();
	}

	private String createSignature(Map<String, String> params) {
		// Sắp xếp tham số theo tên và tạo chuỗi
		StringBuilder data = new StringBuilder();
		params.keySet().stream().sorted().forEach(key -> {
			if (data.length() > 0) {
				data.append("&");
			}
			data.append(key).append("=").append(params.get(key));
		});

		try {
			Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
			SecretKeySpec secret_key = new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
			sha256_HMAC.init(secret_key);
			return bytesToHex(sha256_HMAC.doFinal(data.toString().getBytes(StandardCharsets.UTF_8)));
		} catch (Exception e) {
			throw new RuntimeException("Error while creating signature: " + e.getMessage());
		}
	}

	// Phương thức xóa giỏ hàng
	private void deleteCartFromDatabase(Integer id, Integer accountId) {
		System.out.println("Giá trị cartId: " + id);
		System.out.println("Giá trị accountId: " + accountId);

		Optional<Carts> cartOptional = cartRepository.findByIdAndAccountId(id, accountId);
		System.out.println("Tìm giỏ hàng: " + cartOptional);

		if (cartOptional.isPresent()) {
			cartRepository.delete(cartOptional.get());
			System.out.println("Giỏ hàng đã được xóa thành công.");
		} else {
			System.err.println("Không tìm thấy giỏ hàng với ID: " + id + " và Account ID: " + accountId);
			throw new NoSuchElementException("Không tìm thấy giỏ hàng.");
		}
	}

	private String buildQueryString(Map<String, String> params) {
		StringBuilder query = new StringBuilder();
		for (Map.Entry<String, String> entry : params.entrySet()) {
			if (query.length() > 0) {
				query.append("&");
			}
			query.append(URLEncoder.encode(entry.getKey(), StandardCharsets.UTF_8));
			query.append("=");
			query.append(URLEncoder.encode(entry.getValue(), StandardCharsets.UTF_8));
		}
		return query.toString();
	}

	private String bytesToHex(byte[] bytes) {
		StringBuilder sb = new StringBuilder();
		for (byte b : bytes) {
			sb.append(String.format("%02x", b));
		}
		return sb.toString();
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
