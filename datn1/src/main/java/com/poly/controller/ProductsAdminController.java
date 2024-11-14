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
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.poly.dto.ProductDTO;
import com.poly.entity.Products;
import com.poly.service.ProductsService;

@RestController
@RequestMapping("/api/staff/products")
public class ProductsAdminController {
	private static final Logger logger = LoggerFactory.getLogger(AddressController.class);

	@Autowired
	private ProductsService productService;

	// API thêm sản phẩm mới
	@PreAuthorize("hasAnyAuthority('ADMIN','STAFF')")
	@PostMapping
	public ResponseEntity<Products> addProduct(@RequestBody ProductDTO productDTO) {
		try {
			// Thêm sản phẩm mới
			Products savedProduct = productService.addProduct(productDTO);

			// Lấy thông tin xác thực người dùng
			Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

			// Kiểm tra xem authentication có null hay không
			if (authentication == null || !authentication.isAuthenticated()) {
				logger.error("Authentication is null or not authenticated.");
				return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null); // Trả về 403 nếu không xác thực
			}

			logger.info("Người dùng hiện tại: {}, với quyền: {}", authentication.getName(),
					authentication.getAuthorities());

			// Trả về sản phẩm đã lưu với mã trạng thái 201 Created
			return ResponseEntity.status(HttpStatus.CREATED).body(savedProduct);

		} catch (Exception e) {
			logger.error("Lỗi khi thêm sản phẩm: ", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null); // Trả về lỗi nếu có vấn đề
		}

	}

	//
	// hiện san
	@PreAuthorize("hasAnyAuthority('ADMIN','STAFF')")
	@GetMapping
	public ResponseEntity<List<ProductDTO>> getAllProducts() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication == null || !authentication.isAuthenticated()) {
			logger.error("Authentication is null or not authenticated.");
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null); // Trả về 403 nếu không xác thực
		}
		logger.info("Người dùng hiện tại: {}, với quyền: {}", authentication.getName(),
				authentication.getAuthorities());
		List<ProductDTO> products = productService.getAllProductsd();
		return new ResponseEntity<>(products, HttpStatus.OK);
	}

	// sửa sản phẩm
	@PreAuthorize("hasAnyAuthority('ADMIN')")
	@PutMapping("/{id}")
	public ResponseEntity<?> updateProduct(@PathVariable("id") Integer productId, @RequestBody ProductDTO productDTO) {
		try {

			ProductDTO updatedProduct = productService.updateProduct(productId, productDTO);
			// Lấy thông tin xác thực người dùng
			Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

			// Kiểm tra xem authentication có null hay không
			if (authentication == null || !authentication.isAuthenticated()) {
				logger.error("Authentication is null or not authenticated.");
				return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null); // Trả về 403 nếu không xác thực
			}

			logger.info("Người dùng hiện tại: {}, với quyền: {}", authentication.getName(),
					authentication.getAuthorities());
			return ResponseEntity.ok(updatedProduct);
		} catch (Exception e) {
			return ResponseEntity.badRequest().body("Failed to update product: " + e.getMessage());
		}
	}

	// API xóa sản phẩm
	@PreAuthorize("hasAnyAuthority('ADMIN','STAFF')")
	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteProduct(@PathVariable("id") Integer productId) {
		try {
			productService.deleteProduct(productId);
			Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

			// Kiểm tra xem authentication có null hay không
			if (authentication == null || !authentication.isAuthenticated()) {
				logger.error("Authentication is null or not authenticated.");
				return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null); // Trả về 403 nếu không xác thực
			}

			logger.info("Người dùng hiện tại: {}, với quyền: {}", authentication.getName(),
					authentication.getAuthorities());
			return ResponseEntity.ok("Xóa sản phẩm thành công");
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@PreAuthorize("hasAnyAuthority('ADMIN')")
	@DeleteMapping("/delete/{imageId}")
	public ResponseEntity<?> deleteImageProduct(@PathVariable Integer imageId) {

		try {

			Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

			if (authentication == null || !authentication.isAuthenticated()) {
				logger.error("Authentication is null or not authenticated.");
				return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null); // Trả về 403 nếu không xác thực
			}

			logger.info("Người dùng hiện tại: {}, với quyền: {}", authentication.getName(),
					authentication.getAuthorities());

			productService.deleteImage(imageId);
			return ResponseEntity.ok(200);
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}

	}
}
