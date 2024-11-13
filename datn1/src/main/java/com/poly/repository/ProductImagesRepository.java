package com.poly.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.poly.entity.ProductImages;
import com.poly.entity.Products;

import jakarta.transaction.Transactional;

@Repository
public interface ProductImagesRepository extends JpaRepository<ProductImages, Integer> {
	List<ProductImages> findByProductId(Integer productId);

	void deleteByProduct(Products product);
	
	@Modifying
	@Transactional
	@Query("DELETE FROM ProductImages pi WHERE pi.id = :imageId")
	void deleteImageById(@Param("imageId") Integer imageId);
}
