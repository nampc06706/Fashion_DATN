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
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.poly.dto.AccountDTO;
import com.poly.dto.AccountUpdateDTO;
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
	    	     logger.info("Người dùng hiện tại: {}, với quyền: {}", authentication.getName(), authentication.getAuthorities());
	        return ResponseEntity.ok(accounts);
	    }
	 
	 
	
	 @PreAuthorize("hasAnyAuthority('ADMIN')")
	    @PutMapping("/{id}")
	    public ResponseEntity<AccountDTO> updateAccount(
	            @PathVariable Integer id, 
	            @RequestBody AccountUpdateDTO accountUpdateDTO) {
	        AccountDTO updatedAccount = accountService.updateAccount(id, accountUpdateDTO);
	        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
	    	  if (authentication == null || !authentication.isAuthenticated()) {
		             logger.error("Authentication is null or not authenticated.");
		             return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null); // Trả về 403 nếu không xác thực
		         }
	    	     logger.info("Người dùng hiện tại: {}, với quyền: {}", authentication.getName(), authentication.getAuthorities());
	    	     
	        return ResponseEntity.ok(updatedAccount);
	    }
}
