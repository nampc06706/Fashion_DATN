package com.poly.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.poly.dto.CartDTO;
import com.poly.dto.OrderRequestDTO;
import com.poly.entity.Account;
import com.poly.entity.Address;
import com.poly.entity.Carts;
import com.poly.entity.OrderDetails;
import com.poly.entity.Orders;
import com.poly.entity.Payment;
import com.poly.entity.ProductImages;
import com.poly.entity.Products;
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

import jakarta.transaction.Transactional;

@Service
public class OrdersService {
	private static final Logger logger = LoggerFactory.getLogger(OrdersService.class);
	@Autowired
	private OrdersRepository ordersRepository;

	@Autowired
	private AccountRepository accountRepository;

	@Autowired
	private AddressRepository addressRepository;

	@Autowired
	private PaymentRepository paymentRepository;

	@Autowired
	private ShippingMethodsRepository shippingMethodsRepository;

	@Autowired
	private OrderDetailsRepository orderDetailsRepository;

	@Autowired
	private SizeRepository sizeRepository;

	@Autowired
	private CartsRepository cartRepository;

	@Transactional
	public Orders createOrder(OrderRequestDTO orderRequest) {
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
		for (CartDTO cartItem : cartItems) {
			logger.info("Processing cart item: {}", cartItem);

			OrderDetails orderDetail = new OrderDetails();
			orderDetail.setOrder(savedOrder);

			// Lấy Size từ SizeDTO
			Size size = sizeRepository.findById(cartItem.getSize().getId())
					.orElseThrow(() -> new RuntimeException("Size not found"));

			System.out.println("Retrieved size: " + size);

			// Kiểm tra xem size có product không
			if (size.getProduct() == null) {
				throw new RuntimeException("Product not found for size: " + size.getId());
			}

			orderDetail.setSize(size);
			orderDetail.setQuantity(cartItem.getQuantity());

			// Tính giá
			BigDecimal price = size.getProduct().getPrice().multiply(new BigDecimal(cartItem.getQuantity()));
			orderDetail.setPrice(price);

			logger.info("OrderDetail before saving: {}", orderDetail);

			// Giảm tồn kho
			if (size.getQuantityInStock() < cartItem.getQuantity()) {
				throw new RuntimeException("Insufficient stock for size: " + size.getId());
			}
			size.setQuantityInStock(size.getQuantityInStock() - cartItem.getQuantity());

			// Cập nhật Size trong cơ sở dữ liệu
			sizeRepository.save(size);

			// Lưu chi tiết đơn hàng
			try {
				orderDetailsRepository.save(orderDetail);
				System.out.println("OrderDetail saved successfully: " + orderDetail);
			} catch (Exception e) {
				e.printStackTrace(); // In ra lỗi nếu không lưu được
			}
		}

		// Xóa sản phẩm khỏi giỏ hàng sau khi đặt hàng thành công
		for (CartDTO cartItem : cartItems) {
			deleteCartFromDatabase(cartItem.getId(), account.getId());
		}

		return savedOrder;
	}

	// Phương thức xóa giỏ hàng''
	@Transactional
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

	@Transactional
	public List<Orders> getOrdersByAccountId(Integer accountId) {
	    List<Orders> orders = ordersRepository.findByAccountId(accountId);
	    if (orders.isEmpty()) {
	        throw new NoSuchElementException("Không tìm thấy hóa đơn cho người dùng với ID: " + accountId);
	    }

	    System.out.println("Số hóa đơn tìm thấy: " + orders.size());
	    for (Orders order : orders) {
	        // Kiểm tra địa chỉ có phải là null không
	        if (order.getAddress() == null) {
	            System.out.println("Địa chỉ hóa đơn ID " + order.getId() + " là null");
	            // Có thể gán một giá trị mặc định hoặc xử lý theo cách nào đó
	        }

	        // Lấy OrderDetails
	        List<OrderDetails> orderDetails = orderDetailsRepository.findByOrderId(order.getId());

	        // Gán danh sách chi tiết vào đơn hàng
	        for (OrderDetails detail : orderDetails) {
	            if (detail != null) {
	                Size size = detail.getSize();
	                if (size != null) {
	                    Products product = size.getProduct();
	                    if (product != null) {
	                        List<ProductImages> images = product.getImages();
	                        detail.setImages(images);
	                    }
	                }
	            }
	        }
	        order.setOrderDetails(orderDetails); // Gán danh sách chi tiết vào đơn hàng
	    }

	    return orders; // Trả về danh sách đơn hàng cùng với chi tiết của chúng
	}

}
