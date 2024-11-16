package com.poly.controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.poly.dto.FlashsaleDTO;
import com.poly.dto.ProductDTO;
import com.poly.dto.ProductFlashsaleRequest;
import com.poly.entity.Flashsale;
import com.poly.entity.ProductFlashsale;
import com.poly.service.FlashsaleService;
import com.poly.service.ProductFlashsaleService;

@RestController
@RequestMapping("/api/staff/product-flashsale")
public class ProductFlashsaleAdminController {

	@Autowired
	private ProductFlashsaleService productFlashsaleService;
	@Autowired
	private FlashsaleService flashsaleService;

	// Lấy tất cả Flash Sale (kể cả hoạt động và không hoạt động)
	@PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF')")
	@GetMapping("/flashsales")
	public ResponseEntity<List<FlashsaleDTO>> getAllFlashsales() {
		List<FlashsaleDTO> flashsales = flashsaleService.findAllFlashsales();
		return ResponseEntity.ok(flashsales);
	}

	// Lấy tất cả sản phẩm flash sale
	@PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF')")
	@GetMapping
	public ResponseEntity<List<ProductDTO>> getAllProductFlashsales() {
		List<ProductDTO> productDTOs = productFlashsaleService.findAllIncludingInactive();
		return ResponseEntity.ok(productDTOs);
	}

	// API đổi trạng thái isactive
	@PutMapping("/{id}/toggle-active")
	@PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF')")
	public ResponseEntity<FlashsaleDTO> toggleIsActive(@PathVariable Integer id) {
		FlashsaleDTO updatedFlashsale = flashsaleService.toggleIsActive(id);
		return ResponseEntity.ok(updatedFlashsale);
	}

	@PostMapping("/add")
	@PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF')")
	public ResponseEntity<ProductDTO> addProductFlashsale(@RequestBody ProductFlashsaleRequest request) {
		System.out.println("Request Data: " + request);
		Integer productId = request.getProductId();
		Integer flashsaleId = request.getFlashsaleId();
		BigDecimal discount = request.getDiscount();
		try {
			ProductFlashsale newProductFlashsale = productFlashsaleService.addProductFlashsale(productId, flashsaleId,
					discount);
			ProductDTO productDTO = productFlashsaleService.convertToDto(newProductFlashsale);
			return ResponseEntity.ok(productDTO);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
	}

	@DeleteMapping("/delete/{productId}/{flashsaleId}")
	@PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF')")
	public ResponseEntity<String> deleteProductFlashsale(@PathVariable Integer productId,
			@PathVariable Integer flashsaleId) {
		try {
			// Gọi service để xóa
			productFlashsaleService.deleteProductFlashsale(productId, flashsaleId);
			return ResponseEntity.ok("Xóa ProductFlashsale thành công.");
		} catch (IllegalArgumentException e) {
			// Xử lý lỗi nếu không tìm thấy
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy ProductFlashsale với id đã cho.");
		} catch (Exception e) {
			// Xử lý lỗi tổng quát
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Có lỗi xảy ra khi xóa ProductFlashsale.");
		}
	}

	// API thêm Flash Sale
	@PostMapping("/addFlashsale")
	@PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF')")
	public ResponseEntity<Flashsale> addFlashsale(@RequestBody Flashsale flashsale) {
		try {
			// Đặt giá trị mặc định cho isactive
			flashsale.setIsactive(false);
			Flashsale savedFlashsale = flashsaleService.addFlashsale(flashsale);
			return ResponseEntity.ok(savedFlashsale);
		} catch (Exception e) {
			return ResponseEntity.badRequest().build();
		}
	}

	// API cập nhật thông tin Flash Sale (không thay đổi isactive)
	@PutMapping("/{id}")
	@PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF')")
	public ResponseEntity<FlashsaleDTO> updateFlashsale(@PathVariable("id") Integer id,
			@RequestBody FlashsaleDTO flashsaleDTO) {
		try {
			FlashsaleDTO updatedFlashsale = flashsaleService.updateFlashsaleInfo(id, flashsaleDTO);
			return ResponseEntity.ok(updatedFlashsale);
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(null);
		}
	}
}
