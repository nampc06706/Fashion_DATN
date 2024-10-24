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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.poly.dto.FavouriteDTO;
import com.poly.entity.Favourite;
import com.poly.service.FavouriteService;

@RestController
@RequestMapping("/api/user/favourites")
public class FavouriteController {
	private static final Logger logger = LoggerFactory.getLogger(AddressController.class);
	@Autowired
	private FavouriteService favouriteService;

	@GetMapping("/account/{accountId}")
	@PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF', 'USER')")
	public ResponseEntity<List<Favourite>> getFavouritesByAccount(@PathVariable Integer accountId) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		// Kiểm tra xem authentication có null hay không
		if (authentication == null || !authentication.isAuthenticated()) {
			logger.error("Authentication is null or not authenticated.");
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
		}
		List<Favourite> favourites = favouriteService.getFavouritesByAccountId(accountId);
		return new ResponseEntity<>(favourites, HttpStatus.OK);
	}

	@PostMapping
	@PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF', 'USER')")
	public ResponseEntity<Favourite> addFavourite(@RequestBody FavouriteDTO favouriteDTO) {
	    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

	    // Kiểm tra xem authentication có null hay không
	    if (authentication == null || !authentication.isAuthenticated()) {
	        logger.error("Authentication is null or not authenticated.");
	        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
	    }
	    
	    // Cập nhật số lượng sản phẩm yêu thích
	    Favourite favourite = favouriteService.addFavourite(favouriteDTO);
	    return new ResponseEntity<>(favourite, HttpStatus.CREATED);
	}


}
