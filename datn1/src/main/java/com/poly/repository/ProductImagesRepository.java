package com.poly.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.poly.entity.ProductImages;
import com.poly.entity.Products;

@Repository
public interface ProductImagesRepository extends JpaRepository<ProductImages, Integer> {
	List<ProductImages> findByProductId(Integer productId);
	 void deleteByProduct(Products product);
}
