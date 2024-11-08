package com.poly.controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.poly.dto.CategoryDTO;
import com.poly.dto.ProductDTO;
import com.poly.dto.SimpleProductDTO;
import com.poly.dto.SizeDTO;
import com.poly.service.ProductsService;

@RestController
@RequestMapping("/api/guest/products")
public class ProductsController {

	@Autowired
	private ProductsService productsService;

	// Lấy tất cả sản phẩm (tên, giá, hình ảnh đầu tiên)
	@GetMapping
	public ResponseEntity<List<SimpleProductDTO>> getAllProducts() {
		List<SimpleProductDTO> products = productsService.getAllProducts();
		return new ResponseEntity<>(products, HttpStatus.OK);
	}

	// Lấy 12 sản phẩm mới nhất
	@GetMapping("/latest")
	public ResponseEntity<List<ProductDTO>> getLatestProducts() {
		List<ProductDTO> products = productsService.getLatestProducts();
		return new ResponseEntity<>(products, HttpStatus.OK);
	}

	// Lấy chi tiết sản phẩm theo ID
	@GetMapping("/{id}")
	public ResponseEntity<ProductDTO> getProductDetails(@PathVariable Integer id) {
		ProductDTO productDetails = productsService.getProductDetails(id);
		if (productDetails != null) {
			return ResponseEntity.ok(productDetails);
		} else {
			return ResponseEntity.notFound().build();
		}
	}

	// Lấy kích thước của sản phẩm theo ID
	@GetMapping("/{id}/sizes")
	public ResponseEntity<List<SizeDTO>> getSizesByProductId(@PathVariable Integer id) {
		List<SizeDTO> sizes = productsService.getSizesByProductId(id);
		if (sizes != null && !sizes.isEmpty()) {
			return ResponseEntity.ok(sizes);
		} else {
			return ResponseEntity.notFound().build();
		}
	}

	// Lấy tất cả danh mục
	@GetMapping("/categories")
	public List<CategoryDTO> getAllCategories() {
		return productsService.getAllCategories();
	}

	// Kiểm tra chi tiết sản phẩm qua ID (nếu cần thêm phương thức này)
	@GetMapping("/search")
	public ResponseEntity<List<ProductDTO>> searchProducts(
			@RequestParam(value = "keyword", required = false) String keyword,
			@RequestParam(value = "category", required = false) String category) {

		// Ghi log giá trị của keyword và category
		System.out.println("Keyword: " + keyword + ", Category: " + category);

		List<ProductDTO> products = productsService.searchProducts(keyword, category);
		return ResponseEntity.ok(products);
	}

	@GetMapping("/related")
	public ResponseEntity<?> getRelatedProducts(@RequestParam Integer productId) {
		List<ProductDTO> relatedProducts = productsService.getRelatedProductsByCategory(productId);

		// Nếu không tìm thấy sản phẩm liên quan, có thể trả về mã lỗi 404
		if (relatedProducts.isEmpty()) {
			return ResponseEntity.notFound().build();
		}

		return ResponseEntity.ok(relatedProducts);
	}

	// tìm sp theo danh mục
	@GetMapping("/category/{categoryId}")
	public ResponseEntity<List<SimpleProductDTO>> getProductsByCategory(@PathVariable Integer categoryId) {
		List<SimpleProductDTO> products = productsService.getProductsByCategory(categoryId);
		return ResponseEntity.ok(products);
	}

	// lấy sản phẩm theo giá từ đến từ
	@GetMapping("/price-range")
	public ResponseEntity<List<SimpleProductDTO>> getProductsByPriceRange(@RequestParam BigDecimal minPrice,
			@RequestParam BigDecimal maxPrice) {
		List<SimpleProductDTO> products = productsService.getProductsByPriceRange(minPrice, maxPrice);
		return ResponseEntity.ok(products);
	}

}
