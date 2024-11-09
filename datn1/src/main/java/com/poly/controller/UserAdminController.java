package com.poly.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.poly.dto.AccountDTO;
import com.poly.dto.AccountUpdateDTO;
import com.poly.entity.Account;
import com.poly.service.AccountService;

@RestController
@RequestMapping("/api/admin/useradmin")
public class UserAdminController {

	@Autowired
	private AccountService accountService;

	private static final Logger logger = LoggerFactory.getLogger(AddressController.class);

	@PreAuthorize("hasAnyAuthority('ADMIN')")
	@GetMapping
	public ResponseEntity<List<AccountDTO>> getAllAccounts() {
		List<AccountDTO> accounts = accountService.getAllAccounts();
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication == null || !authentication.isAuthenticated()) {
			logger.error("Authentication is null or not authenticated.");
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null); // Trả về 403 nếu không xác thực
		}
		logger.info("Người dùng hiện tại: {}, với quyền: {}", authentication.getName(),
				authentication.getAuthorities());
		return ResponseEntity.ok(accounts);
	}

	@PreAuthorize("hasAnyAuthority('ADMIN')")
	@PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<AccountDTO> updateAccount(
			@PathVariable Integer id,
			@RequestPart("account") AccountUpdateDTO accountUpdateDTO,
			@RequestPart(value = "image", required = false) MultipartFile image) {

		accountUpdateDTO.setImage(image); // Gán tệp hình ảnh vào đối tượng DTO
		AccountDTO updatedAccount = accountService.updateAccount(id, accountUpdateDTO);
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication == null || !authentication.isAuthenticated()) {
			logger.error("Authentication is null or not authenticated.");
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null); // Trả về 403 nếu không xác thực
		}
		logger.info("Người dùng hiện tại: {}, với quyền: {}", authentication.getName(),
				authentication.getAuthorities());

		return ResponseEntity.ok(updatedAccount);
	}

	@PreAuthorize("hasAnyAuthority('ADMIN')")
	@PostMapping(path = "/add", consumes = "multipart/form-data")
	public ResponseEntity<Map<String, Object>> CreateAccount(
			@RequestPart("account") AccountUpdateDTO account,
			@RequestPart(value = "image", required = false) MultipartFile image) {

		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication == null || !authentication.isAuthenticated()) {
			logger.error("Authentication is null or not authenticated.");
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null); // Trả về 403 nếu không xác thực
		}
		logger.info("Người dùng hiện tại: {}, với quyền: {}", authentication.getName(),
				authentication.getAuthorities());

		Map<String, Object> response = new HashMap<>();
		try {
			if (image != null) {
				account.setImage(image);
			}
			Account save = accountService.createAccount(account);
			response.put("status", HttpStatus.CREATED.value()); // 201
			response.put("data", save);
			return ResponseEntity.status(HttpStatus.CREATED).body(response);
		} catch (Exception e) {
			response.put("status", HttpStatus.BAD_REQUEST.value()); // 400
			response.put("data", e.getMessage());
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
		}
	}
}