package com.poly.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.poly.entity.Rating;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Integer> {
	List<Rating> findBySizeId(Integer sizeId);

}
