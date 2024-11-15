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

import com.poly.dto.CategoryDTO;
import com.poly.service.CategoryService;

import jakarta.persistence.EntityNotFoundException;

@RestController
@RequestMapping("/api/staff/categoryadmin")
public class CategoryAdminController {
	 private static final Logger logger = LoggerFactory.getLogger(AddressController.class);
	 
	  @Autowired
	    private CategoryService categoryService;
// hien thi loai hang 
	    @GetMapping
	    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF')")
	    public ResponseEntity<List<CategoryDTO>> getAllCategories() {
	    	 Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
	    	  if (authentication == null || !authentication.isAuthenticated()) {
		             logger.error("Authentication is null or not authenticated.");
		             return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null); // Trả về 403 nếu không xác thực
		         }
	    	     logger.info("Người dùng hiện tại: {}, với quyền: {}", authentication.getName(), authentication.getAuthorities());
	        return ResponseEntity.ok(categoryService.getAllCategories());
	    }
//theem loai hang
	    @PostMapping
	    @PreAuthorize("hasAnyAuthority('ADMIN')")
	    public ResponseEntity<CategoryDTO> addCategory(@RequestBody CategoryDTO categoryDTO) {
	        CategoryDTO newCategory = categoryService.addCategory(categoryDTO);
	    	 Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
	    	  if (authentication == null || !authentication.isAuthenticated()) {
		             logger.error("Authentication is null or not authenticated.");
		             return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null); // Trả về 403 nếu không xác thực
		         }
	    	     logger.info("Người dùng hiện tại: {}, với quyền: {}", authentication.getName(), authentication.getAuthorities());
	        return ResponseEntity.status(HttpStatus.CREATED).body(newCategory);
	    }
//sua loai hang
	    @PutMapping("/{id}")
	    @PreAuthorize("hasAnyAuthority('ADMIN')")
	    public ResponseEntity<CategoryDTO> updateCategory(@PathVariable Integer id, @RequestBody CategoryDTO categoryDTO) {
	    	
	        CategoryDTO updatedCategory = categoryService.updateCategory(id, categoryDTO);
	    	 Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
	    	  if (authentication == null || !authentication.isAuthenticated()) {
		             logger.error("Authentication is null or not authenticated.");
		             return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null); // Trả về 403 nếu không xác thực
		         }
	    	     logger.info("Người dùng hiện tại: {}, với quyền: {}", authentication.getName(), authentication.getAuthorities());
	        return ResponseEntity.ok(updatedCategory);
	    }
	    
	    @DeleteMapping("/{id}")
	    @PreAuthorize("hasAuthority('ADMIN')")
	    public ResponseEntity<?> deleteCategory(@PathVariable Integer id) {
	        // Kiểm tra xác thực của người dùng
	        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
	        if (authentication == null || !authentication.isAuthenticated()) {
	            logger.error("Authentication is null or not authenticated.");
	            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Người dùng chưa được xác thực.");
	        }

	        logger.info("Người dùng hiện tại: {}, với quyền: {}", authentication.getName(), authentication.getAuthorities());

	        try {
	            // Thực hiện xóa category
	            categoryService.deleteCategory(id);
	            logger.info("Xóa loại sản phẩm thành công với ID: {}", id);
	            return ResponseEntity.ok("Loại sản phẩm đã được xóa thành công.");
	        } catch (EntityNotFoundException e) {
	            logger.error("Không tìm thấy loại sản phẩm với ID: {}", id);
	            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy loại sản phẩm.");
	        } catch (Exception e) {
	            logger.error("Lỗi khi xóa loại sản phẩm với ID: {}", id, e);
	            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Có lỗi xảy ra khi xóa loại sản phẩm.");
	        }
	    }

}
