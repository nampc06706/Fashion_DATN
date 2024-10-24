package com.poly.controller;

import java.io.IOException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.poly.dto.CartDTO;
import com.poly.dto.QuantityUpdateRequest;
import com.poly.service.CartService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/guest/carts")
public class CartController {

	@Autowired
	private CartService cartService;

	// Lấy giỏ hàng
	@GetMapping
	public ResponseEntity<List<CartDTO>> getCart(@RequestParam(value = "accountId", required = false) Integer accountId,
			HttpServletRequest request) throws IOException {
		List<CartDTO> cartItems = cartService.getCart(accountId, request);
		return ResponseEntity.ok(cartItems);
	}

	// Lưu giỏ hàng
	@PostMapping
	public ResponseEntity<Void> saveCart(@RequestBody CartDTO cartDTO, HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		cartService.saveCart(cartDTO, request, response); // Gọi phương thức saveCart với danh sách
		return ResponseEntity.status(201).build(); // Trả về mã 201 Created
	}

	@PutMapping("/quantity")
	public ResponseEntity<Void> updateCartQuantity(@RequestBody QuantityUpdateRequest request,
			HttpServletRequest httpRequest, HttpServletResponse response) {
		try {
			// Gọi phương thức cập nhật số lượng trong service
			cartService.updateCartQuantity(request, httpRequest, response);
			return ResponseEntity.noContent().build();
		} catch (IllegalArgumentException e) {
			System.err.println("Dữ liệu không hợp lệ: " + e.getMessage());
			return ResponseEntity.badRequest().build(); // Trả về 400 nếu dữ liệu không hợp lệ
		} catch (NoSuchElementException e) {
			System.err.println("Không tìm thấy sản phẩm: " + e.getMessage());
			return ResponseEntity.notFound().build(); // Trả về 404 nếu không tìm thấy sản phẩm
		} catch (Exception e) {
			System.err.println("Lỗi khi cập nhật số lượng sản phẩm: " + e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // Trả về 500 cho lỗi nội bộ
		}
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteCart(@PathVariable Integer id, HttpServletRequest request,
	                                       HttpServletResponse response) {
	    try {
	        // Log để theo dõi đầu vào
//	        System.out.println("Bắt đầu phương thức deleteCart với cartId: " + id);
//	        System.out.println("Request method: " + request.getMethod());
//	        System.out.println("Request URI: " + request.getRequestURI());
//
//	        // Log thêm các thông tin từ headers và cookies
//	        System.out.println("Headers: " + Collections.list(request.getHeaderNames()));
//	        System.out.println("Cookies: " + Arrays.toString(request.getCookies()));

	        Integer accountId = getAccountIdFromRequest(request); // Lấy accountId từ request
	        //System.out.println("accountId: " + accountId); // Log giá trị của accountId

	        // Kiểm tra accountId
	        if (accountId == null) {
	            //System.out.println("accountId không hợp lệ, trả về 400.");
	            return ResponseEntity.badRequest().build(); // Trả về 400 nếu accountId không hợp lệ
	        }

	        // Log trước khi gọi service để xóa
	        //System.out.println("Gọi service để xóa giỏ hàng với ID: " + id + " và accountId: " + accountId);

	        // Gọi service để xóa sản phẩm
	        cartService.deleteCartById(id, accountId, request, response);
	        //System.out.println("Xóa thành công giỏ hàng với ID: " + id);
	        
	        return ResponseEntity.noContent().build(); // Trả về 204 nếu xóa thành công
	    } catch (IllegalArgumentException e) {
	        //System.err.println("Dữ liệu không hợp lệ: " + e.getMessage());
	        e.printStackTrace(); // In ra stack trace
	        return ResponseEntity.badRequest().build(); // Trả về 400 nếu dữ liệu không hợp lệ
	    } catch (NoSuchElementException e) {
	        //System.err.println("Không tìm thấy giỏ hàng: " + e.getMessage());
	        return ResponseEntity.notFound().build(); // Trả về 404 nếu không tìm thấy giỏ hàng
	    } catch (Exception e) {
	        //System.err.println("Lỗi khi xóa sản phẩm trong giỏ hàng: " + e.getMessage());
	        e.printStackTrace(); // In ra stack trace
	        
	        // Kiểm tra lỗi liên quan đến quyền truy cập (403)
	        if (e.getMessage().contains("Access is denied")) {
	            //System.err.println("Lỗi 403 - Không có quyền truy cập: " + e.getMessage());
	            return ResponseEntity.status(HttpStatus.FORBIDDEN).build(); // Trả về 403 nếu không có quyền truy cập
	        }

	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // Trả về 500 nếu có lỗi khác
	    }
	}



	private Integer getAccountIdFromRequest(HttpServletRequest request) {
		Cookie[] cookies = request.getCookies();
		if (cookies != null) {
			for (Cookie cookie : cookies) {
				System.out.println("Cookie: " + cookie.getName() + " = " + cookie.getValue());
			}

			for (Cookie cookie : cookies) {
				if ("user".equals(cookie.getName())) {
					String cookieValue = cookie.getValue();
					System.out.println("Giá trị cookie 'user': " + cookieValue);

					cookieValue = URLDecoder.decode(cookieValue, StandardCharsets.UTF_8);

					try {
						ObjectMapper objectMapper = new ObjectMapper();
						JsonNode userInfo = objectMapper.readTree(cookieValue);

						if (userInfo.has("accountId")) {
							Integer accountId = userInfo.get("accountId").asInt();
							System.out.println("Lấy được accountId: " + accountId);
							return accountId;
						} else {
							System.out.println("Không tìm thấy accountId trong cookie.");
						}
					} catch (Exception e) {
						System.err.println("Lỗi khi phân tích cookie: " + e.getMessage());
						e.printStackTrace();
						return null;
					}
				}
			}
		}
		System.out.println("Không tìm thấy cookie 'user' hoặc người dùng chưa đăng nhập.");
		return null;
	}

}
