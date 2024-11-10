package com.poly.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.poly.dto.RatingDTO;
import com.poly.entity.OrderDetails;
import com.poly.entity.Orders;
import com.poly.entity.Rating;
import com.poly.entity.Size;
import com.poly.repository.OrderDetailsRepository;
import com.poly.repository.OrdersRepository;
import com.poly.repository.RatingRepository;
import com.poly.repository.SizeRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class RatingService {

	@Autowired
	private RatingRepository ratingRepository;

	@Autowired
	private OrdersRepository ordersRepository;

	@Autowired
	private SizeRepository sizeRepository;

	@Autowired
	private OrderDetailsRepository orderDetailsRepository;

	public Rating createRating(RatingDTO ratingDTO) {
        // Tìm đơn hàng theo orderId
        Orders order = ordersRepository.findById(ratingDTO.getOrderId()).orElse(null);
        if (order == null) {
            throw new IllegalArgumentException("Đơn hàng không tồn tại");
        }

        // Tìm size theo sizeId
        Size size = sizeRepository.findById(ratingDTO.getSizeId()).orElse(null);
        if (size == null) {
            throw new IllegalArgumentException("Size không tồn tại");
        }

        // Kiểm tra xem orderId và sizeId có liên kết với nhau không
        Optional<OrderDetails> orderDetail = orderDetailsRepository.findByOrderAndSize(order, size);
        if (!orderDetail.isPresent()) {
            throw new IllegalArgumentException("Size không thuộc về đơn hàng này");
        }

        // Tạo đánh giá
        Rating rating = new Rating();
        rating.setOrders(order);
        rating.setSize(size);
        rating.setStars(ratingDTO.getStars());
        rating.setReview(ratingDTO.getReview());
        rating.setDate(LocalDateTime.now());

        return ratingRepository.save(rating);
    }

	@Transactional
	public Rating createRating(Rating rating) {
		if (rating == null) {
			throw new IllegalArgumentException("Rating cannot be null");
		}
		return ratingRepository.save(rating); // Lưu thông tin đánh giá vào cơ sở dữ liệu
	}

	public List<Rating> getRatingsBySizeId(Integer sizeId) {
		return ratingRepository.findBySizeId(sizeId);
	}

	public List<Rating> getAllRatings() {
		return ratingRepository.findAll(); // Lấy tất cả đánh giá
	}

	public Optional<Rating> getRatingById(Integer id) {
		return ratingRepository.findById(id); // Lấy đánh giá theo ID, trả về Optional
	}

	@Transactional
	public void deleteRating(Integer id) {
		if (!ratingRepository.existsById(id)) {
			throw new EntityNotFoundException("Đánh giá không tồn tại");
		}
		ratingRepository.deleteById(id);
	}

	public List<Rating> getAllFiveStarRatings() {
		return ratingRepository.findAllFiveStarRatings();
	}
	
	//lấy tất cả đánh giá của id sản phẩm
	public List<Rating> getRatingsByProductId(Integer productId) {
	    return ratingRepository.findByProductId(productId);
	}

	// Kiểm tra xem người dùng đã đánh giá sản phẩm trong đơn hàng chưa
    public boolean hasRatedProduct(Orders order, Size size) {
        Optional<Rating> rating = ratingRepository.findByOrdersAndSize(order, size);
        return rating.isPresent();
    }

}


