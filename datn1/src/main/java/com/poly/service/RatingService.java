	package com.poly.service;
	
	import java.util.List;
	import java.util.Optional;
	
	import org.springframework.beans.factory.annotation.Autowired;
	import org.springframework.stereotype.Service;
	import org.springframework.transaction.annotation.Transactional;
	
	import com.poly.entity.Rating;
	import com.poly.repository.RatingRepository;
	
	import jakarta.persistence.EntityNotFoundException;
	
	@Service
	public class RatingService {
	
	    @Autowired
	    private RatingRepository ratingRepository;
	
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
	}
