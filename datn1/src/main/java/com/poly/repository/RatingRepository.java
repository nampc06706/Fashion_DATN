package com.poly.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.poly.entity.Orders;
import com.poly.entity.Rating;
import com.poly.entity.Size;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Integer> {
	List<Rating> findBySizeId(Integer sizeId);

	// Custom query để lấy tất cả đánh giá có số sao là 5
	@Query("SELECT r FROM Rating r WHERE r.stars = 5")
	List<Rating> findAllFiveStarRatings();

	@Query("SELECT r FROM Rating r WHERE r.size.product.id = :productId")
	List<Rating> findByProductId(@Param("productId") Integer productId);

	// Tìm đánh giá của người dùng cho một sản phẩm trong đơn hàng
    Optional<Rating> findByOrdersAndSize(Orders order, Size size);
}
