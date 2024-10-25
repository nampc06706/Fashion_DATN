package com.poly.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.poly.entity.Address;
import com.poly.service.AddressService;

@RestController
@RequestMapping("/api/user/addresses")
public class AddressController {
	private static final Logger logger = LoggerFactory.getLogger(AddressController.class);

	@Autowired
	private AddressService addressService;

	@GetMapping("/account/{accountId}")
	@PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF', 'USER')")
	public ResponseEntity<List<Address>> getAddressesByAccountId(@PathVariable Integer accountId) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		// Kiểm tra xem authentication có null hay không
		if (authentication == null || !authentication.isAuthenticated()) {
			logger.error("Authentication is null or not authenticated.");
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
		}

		logger.info("Người dùng hiện tại: {}, với quyền: {}", authentication.getName(),
				authentication.getAuthorities());

		List<Address> addresses = addressService.getAddressesByAccountId(accountId);
		if (addresses.isEmpty()) {
			return ResponseEntity.noContent().build();
		}
		return ResponseEntity.ok(addresses);
	}

	// Thêm địa chỉ mới
	@PostMapping("/add")
	@PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF', 'USER')")
	public ResponseEntity<Address> addAddress(@RequestParam Integer accountId, @RequestBody Address address) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		if (authentication == null || !authentication.isAuthenticated()) {
			logger.error("Người dùng chưa xác thực.");
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
		}

		logger.info("Người dùng hiện tại: {}, với quyền: {}", authentication.getName(),
				authentication.getAuthorities());

		try {
			Address newAddress = addressService.addAddress(accountId, address);
			return ResponseEntity.status(HttpStatus.CREATED).body(newAddress);
		} catch (RuntimeException e) {
			logger.error("Lỗi khi thêm địa chỉ: {}", e.getMessage());
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
		}
	}

	@PutMapping("/{accountId}/set-default/{addressId}")
	@PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF', 'USER')")
	public ResponseEntity<Address> setDefaultAddress(@PathVariable Integer accountId, @PathVariable Integer addressId) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		if (authentication == null || !authentication.isAuthenticated()) {
			logger.error("Người dùng chưa xác thực.");
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
		}

		logger.info("Người dùng hiện tại: {}, với quyền: {}", authentication.getName(),
				authentication.getAuthorities());
		Address updatedAddress = addressService.setDefaultAddress(accountId, addressId);
		return ResponseEntity.ok(updatedAddress);
	}

	@PutMapping("/update/{accountId}/{addressId}")
	@PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF', 'USER')")
	public ResponseEntity<Address> updateAddress(@PathVariable Integer accountId, @PathVariable Integer addressId,
			@RequestBody Address updatedAddress) {

		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		if (authentication == null || !authentication.isAuthenticated()) {
			logger.error("Người dùng chưa xác thực.");
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
		}

		logger.info("Người dùng hiện tại: {}, với quyền: {}", authentication.getName(),
				authentication.getAuthorities());

		try {
			Address address = addressService.updateAddress(accountId, addressId, updatedAddress);
			return ResponseEntity.ok(address);
		} catch (RuntimeException e) {
			logger.error("Lỗi khi cập nhật địa chỉ: {}", e.getMessage());
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
		}
	}

	@DeleteMapping("/delete/{accountId}/{addressId}")
	@PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF', 'USER')")
	public ResponseEntity<Void> deleteAddress(@PathVariable Integer accountId, @PathVariable Integer addressId) {
	    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

	    if (authentication == null || !authentication.isAuthenticated()) {
	        logger.error("Người dùng chưa xác thực.");
	        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
	    }

	    logger.info("Người dùng hiện tại: {}, với quyền: {}", authentication.getName(),
	            authentication.getAuthorities());

	    try {
	        addressService.deleteAddress(accountId, addressId);
	        return ResponseEntity.noContent().build();
	    } catch (AccessDeniedException e) {
	        logger.error("Lỗi quyền truy cập: {}", e.getMessage());
	        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
	    } catch (RuntimeException e) {
	        logger.error("Lỗi khi xóa địa chỉ: {}", e.getMessage());
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
	    }
	}
	
	// Lấy địa chỉ mặc định theo accountId
    @GetMapping("/{accountId}/default")
    public ResponseEntity<Address> getDefaultAddress(@PathVariable Integer accountId) {
    	
    	Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

	    if (authentication == null || !authentication.isAuthenticated()) {
	        logger.error("Người dùng chưa xác thực.");
	        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
	    }

	    logger.info("Người dùng hiện tại: {}, với quyền: {}", authentication.getName(),
	            authentication.getAuthorities());
	    
        Address defaultAddress = addressService.getDefaultAddressByAccountId(accountId);
        return ResponseEntity.ok(defaultAddress);
    }


}
