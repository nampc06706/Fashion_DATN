package com.poly.service;

import java.io.IOException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.poly.dto.CartDTO;
import com.poly.dto.ColorDTO;
import com.poly.dto.QuantityUpdateRequest;
import com.poly.dto.SizeDTO;
import com.poly.entity.Carts;
import com.poly.entity.Size;
import com.poly.repository.CartsRepository;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;

@Service
public class CartService {

	@Autowired
	private CartsRepository cartRepository;

	@Autowired
	private SizeService sizeService;

	@Autowired
	private AccountService accountService;

	private ObjectMapper objectMapper = new ObjectMapper();

	private static final AtomicInteger idCounter = new AtomicInteger(0);

	@Transactional
	public List<CartDTO> getCart(Integer accountId, HttpServletRequest request) throws IOException {
		if (accountId != null) {
			return getCartFromDatabase(accountId);
		}
		return getCartFromCookie(request);
	}

	private List<CartDTO> getCartFromDatabase(Integer accountId) {
		if (accountId == null) {
			throw new IllegalArgumentException("Account ID không thể null");
		}

		List<Carts> carts = cartRepository.findByAccountId(accountId);

		return carts.stream().map(cart -> {
			CartDTO cartDTO = new CartDTO();
			cartDTO.setId(cart.getId());
			cartDTO.setQuantity(cart.getQuantity());
			cartDTO.setAccountId(cart.getAccount() != null ? cart.getAccount().getId() : null);

			Size size = cart.getSize();
			if (size != null) {
				SizeDTO sizeDTO = new SizeDTO();
				sizeDTO.setId(size.getId());
				sizeDTO.setProductId(size.getProduct() != null ? size.getProduct().getId() : null);
				sizeDTO.setName(size.getName());
				sizeDTO.setQuantityInStock(size.getQuantityInStock());

				if (size.getColor() != null) {
					ColorDTO colorDTO = new ColorDTO(size.getColor().getId(), size.getColor().getName());
					sizeDTO.setColor(colorDTO);
				}

				cartDTO.setSize(sizeDTO);
			}

			return cartDTO;
		}).collect(Collectors.toList());
	}

	private Optional<Cookie> findCookie(String name, HttpServletRequest request) {
		Cookie[] cookies = request.getCookies();
		if (cookies == null) {
			return Optional.empty();
		}
		for (Cookie cookie : cookies) {
			if (cookie.getName().equals(name)) {
				return Optional.of(cookie);
			}
		}
		return Optional.empty();
	}

	private Integer generateTempId() {
		return idCounter.incrementAndGet(); // Tăng dần và trả về ID mới
	}

	private void saveCartToCookie(CartDTO cartDTO, HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		// Lấy danh sách giỏ hàng từ cookie hiện tại
		List<CartDTO> cartList = getCartFromCookie(request);
		boolean found = false;

		// Kiểm tra sản phẩm đã có trong giỏ hàng chưa
		for (CartDTO existingCart : cartList) {
			if (existingCart.getSize().getId().equals(cartDTO.getSize().getId())) {
				existingCart.setQuantity(existingCart.getQuantity() + cartDTO.getQuantity());
				found = true;
				break;
			}
		}

		// Nếu chưa có, thêm ID tạm thời vào cartDTO
		if (!found) {
			cartDTO.setId(generateTempId()); // Gán ID tạm thời
			Size size = sizeService.getSizeById(cartDTO.getSize().getId());
			if (size == null) {
				throw new IllegalArgumentException("Size không tồn tại.");
			}

			// Cập nhật thông tin từ size
			cartDTO.getSize().setProductId(size.getProduct() != null ? size.getProduct().getId() : null);
			cartDTO.getSize().setName(size.getName());
			cartDTO.getSize().setQuantityInStock(size.getQuantityInStock());

			if (size.getColor() != null) {
				cartDTO.getSize().setColor(new ColorDTO(size.getColor().getId(), size.getColor().getName()));
			}

			// Thêm mới vào danh sách giỏ hàng
			cartList.add(cartDTO);
		}

		// Lưu danh sách giỏ hàng vào cookie
		String updatedCartJson = objectMapper.writeValueAsString(cartList);
		String encodedCartJson = URLEncoder.encode(updatedCartJson, StandardCharsets.UTF_8);

		Cookie cartCookie = new Cookie("cart", encodedCartJson);
		cartCookie.setMaxAge(7 * 24 * 60 * 60); // Cookie tồn tại 7 ngày
		cartCookie.setHttpOnly(false); // Nếu cần hỗ trợ JavaScript
		cartCookie.setPath("/");
		response.addCookie(cartCookie);
	}

	private void validateCartDTO(CartDTO cartDTO) {
		if (cartDTO == null) {
			throw new IllegalArgumentException("CartDTO không thể null.");
		}
		if (cartDTO.getSize() == null || cartDTO.getSize().getId() == null) {
			throw new IllegalArgumentException("Kích thước và ID kích thước không thể null.");
		}
		if (cartDTO.getQuantity() == null || cartDTO.getQuantity() <= 0) {
			throw new IllegalArgumentException("Số lượng phải lớn hơn 0.");
		}
	}

	private void saveCartToDatabase(CartDTO cartDTO) {
	    validateCartDTO(cartDTO); // Kiểm tra đầu vào

	    // Tìm Size
	    Size size = sizeService.getSizeById(cartDTO.getSize().getId());
	    if (size == null) {
	        throw new IllegalArgumentException("Không tìm thấy kích thước.");
	    }

	    // Kiểm tra stock
	    int stock = size.getQuantityInStock();
	    if (cartDTO.getQuantity() > stock) {
	        throw new IllegalArgumentException("Số lượng vượt quá số lượng tồn kho.");
	    }

	    // Tìm giỏ hàng có cùng Account, Size và Color
	    List<Carts> existingCarts = cartRepository.findByAccountIdAndSizeIdAndColorId(
	            cartDTO.getAccountId(), size.getId(), cartDTO.getSize().getColor().getId());

	    Carts cart;
	    if (!existingCarts.isEmpty()) {
	        cart = existingCarts.get(0);

	        // Kiểm tra tổng số lượng sau khi cộng
	        int newQuantity = cart.getQuantity() + cartDTO.getQuantity();
	        if (newQuantity > stock) {
	            throw new IllegalArgumentException("Số lượng vượt quá số lượng tồn kho.");
	        }

	        // Cập nhật số lượng
	        cart.setQuantity(newQuantity);
	    } else {
	        // Nếu không tồn tại, tạo mới giỏ hàng
	        cart = new Carts();
	        cart.setAccount(accountService.getAccountById(cartDTO.getAccountId())); // Lấy tài khoản
	        cart.setSize(size);
	        cart.setQuantity(cartDTO.getQuantity());
	    }

	    // Lưu vào cơ sở dữ liệu
	    cartRepository.save(cart);
	}

	@Transactional
	public void saveCart(CartDTO cartDTO, HttpServletRequest request, HttpServletResponse response) throws IOException {
		// Tạo ID tạm thời nếu accountId là null
		if (cartDTO.getAccountId() == null) {
			cartDTO.setId(generateTempId()); // Gán ID tạm thời
			saveCartToCookie(cartDTO, request, response);

			// Trả về cartDTO đã được cập nhật ID tạm thời
			response.setContentType("application/json");
			response.getWriter().write(objectMapper.writeValueAsString(cartDTO));
		} else {
			saveCartToDatabase(cartDTO);
		}
	}

	public List<CartDTO> getCartFromCookie(HttpServletRequest request) {
		Cookie[] cookies = request.getCookies();
		if (cookies != null) {
			for (Cookie cookie : cookies) {
				if ("cart".equals(cookie.getName())) {
					try {
						String decodedCartJson = URLDecoder.decode(cookie.getValue(), StandardCharsets.UTF_8);
						List<CartDTO> cartList = objectMapper.readValue(decodedCartJson,
								new TypeReference<List<CartDTO>>() {
								});
						cartList.forEach(cart -> {
							// System.out.println("ID trong giỏ hàng từ cookie: " + cart.getId()); // In ID
							// từ giỏ hàng
						});
						return cartList;
					} catch (IOException e) {
						e.printStackTrace();
					}
				}
			}
		}
		// Nếu không có giỏ hàng trong cookie, khởi tạo giỏ hàng mới
		return new ArrayList<>();
	}

	@Transactional
	public void deleteCartById(Integer id, Integer accountId, HttpServletRequest request,
	        HttpServletResponse response) throws IOException {
	    if (accountId != null) {
	        // Xóa từ cơ sở dữ liệu nếu người dùng đã đăng nhập
	        deleteCartFromDatabase(id, accountId);
	    } else {
	        // Xóa từ cookie nếu người dùng chưa đăng nhập
	        deleteCartFromCookie(id, request, response);
	    }
	}

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


	private void deleteCartFromCookie(Integer id, HttpServletRequest request, HttpServletResponse response)
	        throws IOException {
	    Optional<Cookie> cartCookieOpt = findCookie("cart", request);
	    if (cartCookieOpt.isEmpty()) {
	        throw new IllegalArgumentException("Không có giỏ hàng nào trong cookie.");
	    }

	    String cartJson = URLDecoder.decode(cartCookieOpt.get().getValue(), StandardCharsets.UTF_8);
	    List<CartDTO> cartList = objectMapper.readValue(cartJson, new TypeReference<List<CartDTO>>() {});

	    // Lọc ra sản phẩm không khớp với cartId
	    List<CartDTO> updatedCartList = cartList.stream()
	            .filter(cartDTO -> !cartDTO.getId().equals(id))
	            .collect(Collectors.toList());

	    // Cập nhật cookie
	    String updatedCartJson = objectMapper.writeValueAsString(updatedCartList);
	    Cookie cartCookie = new Cookie("cart", URLEncoder.encode(updatedCartJson, StandardCharsets.UTF_8));
	    cartCookie.setMaxAge(7 * 24 * 60 * 60);
	    cartCookie.setHttpOnly(false);
	    cartCookie.setPath("/");
	    response.addCookie(cartCookie);
	}


	@Transactional
	public void updateCartQuantity(@RequestBody QuantityUpdateRequest request, HttpServletRequest httpRequest, HttpServletResponse response) throws IOException {
	    Integer id = request.getId(); // Lấy ID từ request
	    Integer accountId = request.getAccountId(); // Lấy accountId từ request
	    Integer newQuantity = request.getNewQuantity(); // Lấy newQuantity từ request

	    if (newQuantity <= 0) {
	        throw new IllegalArgumentException("Số lượng phải lớn hơn 0.");
	    }

	    if (accountId != null) {
	        // Nếu người dùng đã đăng nhập, cập nhật trong cơ sở dữ liệu
	        updateCartQuantityInDatabase(id, newQuantity);
	    } else {
	        // Nếu người dùng chưa đăng nhập, cập nhật trong cookie
	        updateCartQuantityInCookie(id, newQuantity, httpRequest, response);
	    }
	}


	private void updateCartQuantityInDatabase(Integer id, Integer newQuantity) {
	    System.out.println("Cập nhật số lượng cho sản phẩm ID: " + id + " với số lượng: " + newQuantity);
	    
	    Optional<Carts> optionalCart = cartRepository.findById(id);
	    if (optionalCart.isPresent()) {
	        Carts cart = optionalCart.get();
	        cart.setQuantity(newQuantity);
	        cartRepository.save(cart);
	        System.out.println("Cập nhật thành công cho sản phẩm ID: " + id);
	    } else {
	        System.err.println("Không tìm thấy sản phẩm trong giỏ hàng với ID: " + id);
	        throw new NoSuchElementException("Không tìm thấy sản phẩm trong giỏ hàng.");
	    }
	}




	private void updateCartQuantityInCookie(Integer id, Integer newQuantity, HttpServletRequest request,
	        HttpServletResponse response) throws IOException {
	    Optional<Cookie> cartCookieOpt = findCookie("cart", request);
	    if (cartCookieOpt.isEmpty()) {
	        throw new IllegalArgumentException("Không có giỏ hàng nào trong cookie.");
	    }

	    String cartJson = URLDecoder.decode(cartCookieOpt.get().getValue(), StandardCharsets.UTF_8);
	    System.out.println("Cart JSON: " + cartJson);

	    List<CartDTO> cartList = objectMapper.readValue(cartJson, new TypeReference<List<CartDTO>>() {});
	    System.out.println("Giỏ hàng hiện tại: " + cartList);

	    boolean found = false;
	    for (CartDTO cartDTO : cartList) {
	        if (cartDTO.getId().equals(id)) {
	            cartDTO.setQuantity(newQuantity);
	            found = true;
	            break;
	        }
	    }

	    if (!found) {
	        throw new NoSuchElementException("Không tìm thấy sản phẩm trong giỏ hàng.");
	    }

	    String updatedCartJson = objectMapper.writeValueAsString(cartList);
	    Cookie cartCookie = new Cookie("cart", URLEncoder.encode(updatedCartJson, StandardCharsets.UTF_8));
	    cartCookie.setMaxAge(7 * 24 * 60 * 60);
	    cartCookie.setHttpOnly(false);
	    cartCookie.setPath("/");
	    response.addCookie(cartCookie);
	}



}
