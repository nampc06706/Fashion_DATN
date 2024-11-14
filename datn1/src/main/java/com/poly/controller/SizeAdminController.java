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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.poly.entity.Size;
import com.poly.repository.SizeRepository;
import com.poly.service.SizeService;

@RestController
@RequestMapping("/api/staff/size")
public class SizeAdminController {
	private static final Logger logger = LoggerFactory.getLogger(SizeAdminController.class);

	@Autowired
	private SizeRepository SizeRepository;

	@Autowired
	private SizeService sizeService;

	/**
	 * API thêm mới Size và tạo mới Color nếu cần.
	 */
	@PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF')")
	@PostMapping("/add")
	public ResponseEntity<?> addSize(@RequestBody Size size, @RequestParam String colorName,
			@RequestParam Integer productId) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		if (authentication == null || !authentication.isAuthenticated()) {
			logger.error("Authentication is null or not authenticated.");
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null); // Trả về 403 nếu không xác thực
		}
		
		try {
			
			Size newSize = sizeService.addSize(size, colorName, productId);
			return ResponseEntity.ok(newSize);
		} catch (Exception e) {
			return ResponseEntity.badRequest().body("Lỗi khi thêm Size: " + e.getMessage());
		}
	}

	@PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF')")
	@PostMapping("/update")
	public ResponseEntity<?> updateSize(@RequestBody Size size, @RequestParam String colorName,
			@RequestParam Integer productId) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		if (authentication == null || !authentication.isAuthenticated()) {
			logger.error("Authentication is null or not authenticated.");
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Bạn không có quyền truy cập.");
		}

		try {
			Size updatedSize = sizeService.updateSize(size, colorName, productId);
			return ResponseEntity.ok(updatedSize);
		} catch (Exception e) {
			logger.error("Lỗi khi cập nhật Size: {}", e.getMessage());
			return ResponseEntity.badRequest().body("Lỗi khi cập nhật Size: " + e.getMessage());
		}
	}

	@PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF')")
	@GetMapping
	public ResponseEntity<List<Size>> getAllSizes() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		List<Size> listSizes = SizeRepository.findAll();

		if (authentication == null || !authentication.isAuthenticated()) {
			logger.error("Authentication is null or not authenticated.");
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null); // Trả về 403 nếu không xác thực
		}
		logger.info("Người dùng hiện tại: {}, với quyền: {}", authentication.getName(),
				authentication.getAuthorities());
		return ResponseEntity.ok(listSizes);
	}

	@DeleteMapping("/delete/{sizeId}")
	@PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF')")
    public ResponseEntity<String> deleteSize(@PathVariable Integer sizeId) {
        try {
            sizeService.deleteSizeById(sizeId);
            return ResponseEntity.ok("Kích thước đã được xóa thành công.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
