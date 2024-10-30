package com.poly.controller;

import java.io.IOException;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.poly.dto.FavouriteDTO;
import com.poly.entity.Favourite;
import com.poly.service.FavouriteService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

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

	@PutMapping("/{favouriteId}/quantity")
	@PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF', 'USER')")
	public ResponseEntity<?> updateFavouriteQuantity(@PathVariable Integer favouriteId,
	        @RequestParam int quantityChange) {
	    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

	    // Kiểm tra xem authentication có null hay không
	    if (authentication == null || !authentication.isAuthenticated()) {
	        logger.error("Authentication is null or not authenticated.");
	        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
	    }

	    Favourite updatedFavourite = favouriteService.updateFavouriteQuantity(favouriteId, quantityChange);
	    if (updatedFavourite == null) {
	        // Trả về một thông điệp rõ ràng hơn
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Item removed from favourites due to zero quantity.");
	    }
	    return ResponseEntity.ok(updatedFavourite);  // Trả về đối tượng cập nhật
	}


	// API xóa yêu thích
	@DeleteMapping("/{favouriteId}")
	@PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF', 'USER')")
	public ResponseEntity<?> removeFavourite(@PathVariable Integer favouriteId) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		// Kiểm tra xem authentication có null hay không
		if (authentication == null || !authentication.isAuthenticated()) {
			logger.error("Authentication is null or not authenticated.");
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
		}
		favouriteService.removeFavourite(favouriteId);
		return ResponseEntity.ok("Favourite item removed successfully.");
	}
	
	 // API xóa tất cả sản phẩm yêu thích
    @DeleteMapping("/removeAll/{accountId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF', 'USER')")
    public ResponseEntity<String> removeAllFavourites(@PathVariable Integer accountId) {
    	Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		// Kiểm tra xem authentication có null hay không
		if (authentication == null || !authentication.isAuthenticated()) {
			logger.error("Authentication is null or not authenticated.");
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
		}
		
        try {
            favouriteService.removeAllFavourites(accountId);
            return ResponseEntity.status(HttpStatus.OK).body("All favourites removed successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // API thêm tất cả sản phẩm yêu thích vào giỏ hàng
    @PostMapping("/addToCart/{accountId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF', 'USER')")
    public ResponseEntity<String> addAllFavouritesToCart(
            @PathVariable Integer accountId,
            HttpServletRequest request,
            HttpServletResponse response) {
    	Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		// Kiểm tra xem authentication có null hay không
		if (authentication == null || !authentication.isAuthenticated()) {
			logger.error("Authentication is null or not authenticated.");
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
		}
		
        try {
            favouriteService.addAllFavouritesToCart(accountId, request, response);
            return ResponseEntity.status(HttpStatus.OK).body("All favourites added to cart successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error occurred while adding to cart.");
        }
    }

}
