package com.poly.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.poly.dto.RatingDTO;
import com.poly.entity.Account;
import com.poly.entity.Orders;
import com.poly.entity.Rating;
import com.poly.service.RatingService;

@RestController
@RequestMapping("/api/user/ratings")
public class RatingController {

    private static final Logger logger = LoggerFactory.getLogger(RatingController.class);
    
    @Autowired
    private RatingService ratingService;

    // Tạo đánh giá mới
    @PostMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF', 'USER')")
    public ResponseEntity<?> createRating(@Validated @RequestBody Rating rating) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            logger.error("Authentication is null or not authenticated.");
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                                 .body("You are not authorized to perform this action.");
        }

        logger.info("Current user: {}, with roles: {}", authentication.getName(), authentication.getAuthorities());

        // Kiểm tra thông tin đơn hàng
        if (rating.getOrders() == null || rating.getOrders().getId() == null) {
            return ResponseEntity.badRequest().body("Order information is required.");
        }

        Orders order = rating.getOrders();
        Account account = order.getAccount();

        if (account == null) {
            return ResponseEntity.badRequest().body("Account not found in the order.");
        }

        // Thay đổi thời gian đánh giá
        rating.setDate(LocalDateTime.now()); 
        Rating createdRating = ratingService.createRating(rating);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdRating);
    }

    // Lấy tất cả các đánh giá
    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF', 'USER')")
    public ResponseEntity<?> getAllRatings() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            logger.error("Authentication is null or not authenticated.");
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                                 .body("You are not authorized to perform this action.");
        }

        logger.info("Current user: {}, with roles: {}", authentication.getName(), authentication.getAuthorities());

        List<Rating> ratings = ratingService.getAllRatings();
        
        List<RatingDTO> ratingDTOs = ratings.stream()
                .map(rating -> new RatingDTO(
                    rating.getId(),
                    rating.getStars(),
                    rating.getReview(),
                    rating.getOrders().getAccount().getUsername(), // Lấy username từ account trong order
                    rating.getDate()
                ))
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(ratingDTOs);
    }


    @GetMapping("/{sizeId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF', 'USER')")
    public ResponseEntity<List<RatingDTO>> getRatingsBySizeId(@PathVariable Integer sizeId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            logger.error("Authentication is null or not authenticated.");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }

        logger.info("Current user: {}, with roles: {}", authentication.getName(), authentication.getAuthorities());

        // Truy vấn các đánh giá theo sizeId
        List<Rating> ratings = ratingService.getRatingsBySizeId(sizeId);

        if (ratings.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        // Chuyển đổi từ Rating sang RatingDTO
        List<RatingDTO> ratingDTOs = ratings.stream().map(rating -> new RatingDTO(
                rating.getId(),
                rating.getStars(),
                rating.getReview(),
                rating.getOrders().getAccount().getFullname(), // Lấy tên người dùng từ tài khoản trong đơn hàng
                rating.getDate()
        )).collect(Collectors.toList());

        return ResponseEntity.ok(ratingDTOs);
    }


}
