package com.poly.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
import com.poly.entity.ProductFlashsale;
import com.poly.entity.ProductFlashsaleId;
import com.poly.service.FlashsaleService;
import com.poly.service.ProductFlashsaleService;

@RestController
@RequestMapping("/api/guest/product-flashsale")
public class ProductFlashsaleController {

	@Autowired
    private ProductFlashsaleService productFlashsaleService;

    // Lấy tất cả sản phẩm flash sale
    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAllProductFlashsales() {
        List<ProductDTO> productDTOs = productFlashsaleService.findAll();
        return ResponseEntity.ok(productDTOs);
    }
    
    // Tạo sản phẩm flash sale mới
    @PostMapping
    public ResponseEntity<ProductDTO> createProductFlashsale(@RequestBody ProductFlashsale productFlashsale) {
        ProductDTO productDTO = productFlashsaleService.save(productFlashsale);
        return ResponseEntity.status(201).body(productDTO);
    }

    // Xóa sản phẩm flash sale theo ID
    @DeleteMapping("/{productId}/{flashsaleId}")
    public ResponseEntity<Void> deleteProductFlashsale(@PathVariable Integer productId, @PathVariable Integer flashsaleId) {
        ProductFlashsaleId id = new ProductFlashsaleId(productId, flashsaleId);
        productFlashsaleService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
