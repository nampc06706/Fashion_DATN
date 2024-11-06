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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.poly.entity.Size;
import com.poly.repository.SizeRepository;

@RestController
@RequestMapping("/api/admin/size")
public class SizeAdminController {
	private static final Logger logger = LoggerFactory.getLogger(AddressController.class);

	@Autowired
	private SizeRepository SizeRepository;
	
	@PreAuthorize("hasAnyAuthority('ADMIN')")
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
}
