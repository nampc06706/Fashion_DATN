package com.poly.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

import com.poly.dto.RatingDTO;
import com.poly.entity.Orders;
import com.poly.entity.Rating;
import com.poly.entity.Size;
import com.poly.service.RatingService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/user/ratings")
public class RatingController {

	private static final Logger logger = LoggerFactory.getLogger(RatingController.class);

	@Autowired
	private RatingService ratingService;

	@PostMapping("/create")
    public ResponseEntity<Rating> createRating(@Valid @RequestBody RatingDTO ratingDTO) {
        try {
            Rating rating = ratingService.createRating(ratingDTO);
            return new ResponseEntity<>(rating, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);  // Nếu có lỗi liên quan đến dữ liệu
        }
    }

	// API để lấy tất cả đánh giá 5 sao
	@PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF', 'USER')")
	@GetMapping("/five-star")
	public ResponseEntity<List<Rating>> getAllFiveStarRatings() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		if (authentication == null || !authentication.isAuthenticated()) {
			logger.error("Authentication is null or not authenticated.");
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
		}
		List<Rating> ratings = ratingService.getAllFiveStarRatings();
		return ResponseEntity.ok(ratings);
	}
	
	// API lấy tất cả đánh giá theo sizeId
	@PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF', 'USER')")
	@GetMapping("/product/{productId}")
	public ResponseEntity<List<Rating>> getRatingsByProductId(@PathVariable Integer productId) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		if (authentication == null || !authentication.isAuthenticated()) {
			logger.error("Authentication is null or not authenticated.");
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
		}
	    List<Rating> ratings = ratingService.getRatingsByProductId(productId);
	    if (ratings.isEmpty()) {
	        return ResponseEntity.noContent().build();
	    }
	    return ResponseEntity.ok(ratings);
	}

	@PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF', 'USER')")
	@GetMapping("/check/{orderId}/{sizeId}")
	public ResponseEntity<Map<String, Boolean>> checkRating(@PathVariable("orderId") Integer orderId, @PathVariable("sizeId") Integer sizeId) {
	    Orders order = new Orders();
	    order.setId(orderId);  // Giả sử Orders có setter cho id

	    Size size = new Size();
	    size.setId(sizeId);  // Giả sử Size có setter cho id

	    boolean hasRated = ratingService.hasRatedProduct(order, size);

	    Map<String, Boolean> response = new HashMap<>();
	    response.put("hasRated", hasRated); // Trả về giá trị boolean

	    return ResponseEntity.ok(response);
	}


}
