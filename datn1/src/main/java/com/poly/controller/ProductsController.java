package com.poly.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.poly.dto.ProductDTO;
import com.poly.dto.SimpleProductDTO;
import com.poly.dto.SizeDTO;
import com.poly.service.ProductsService;

@RestController
@RequestMapping("/api/guest/products")
public class ProductsController {

	@Autowired
	private ProductsService productsService;

	// lấy tất cả sản phẩm ( tên , giá , hình[0)
	@GetMapping
	public ResponseEntity<List<SimpleProductDTO>> getAllProducts() {
		List<SimpleProductDTO> products = productsService.getAllProducts();
		return new ResponseEntity<>(products, HttpStatus.OK);
	}

	// API lấy 12 sản phẩm mới nhất
	@GetMapping("/latest")
	public ResponseEntity<List<ProductDTO>> getLatestProducts() {
		List<ProductDTO> products = productsService.getLatestProducts();
		return new ResponseEntity<>(products, HttpStatus.OK);
	}
	
	
    
 // Endpoint để lấy chi tiết sản phẩm
    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductDetails(@PathVariable Integer id) {
        ProductDTO productDetails = productsService.getProductDetails(id);
        if (productDetails != null) {
            return ResponseEntity.ok(productDetails);
        } else {
            return ResponseEntity.notFound().build();
        }
    }	

    // Endpoint để lấy kích thước của sản phẩm
    @GetMapping("/{id}/sizes")
    public ResponseEntity<List<SizeDTO>> getSizesByProductId(@PathVariable Integer id) {
        List<SizeDTO> sizes = productsService.getSizesByProductId(id);
        if (sizes != null && !sizes.isEmpty()) {
            return ResponseEntity.ok(sizes);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}
