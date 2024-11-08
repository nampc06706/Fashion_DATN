package com.poly.repository;

import com.poly.entity.Color;
import com.poly.entity.Products;
import com.poly.entity.Size;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface SizeRepository extends JpaRepository<Size, Integer> {

	List<Size> findByProductId(Integer productId);

	@Modifying
	@Query("DELETE FROM Size s WHERE s.product = :product")
	int deleteByProduct(@Param("product") Products product);

	List<Size> findByProduct(Products product);

	// Phương thức kiểm tra sự tồn tại của kích thước theo màu sắc
	@Query("SELECT COUNT(s) > 0 FROM Size s WHERE s.color = :color")
	boolean existsByColor(@Param("color") Color color);

	// Phương thức xóa kích thước theo sizeId
	@Modifying
	@Query("DELETE FROM Size s WHERE s.id = :sizeId")
	void deleteById(@Param("sizeId") Integer sizeId);
}
