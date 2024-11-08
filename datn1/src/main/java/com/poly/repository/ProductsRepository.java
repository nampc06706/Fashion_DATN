package com.poly.repository;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.poly.entity.Products;

@Repository
public interface ProductsRepository extends JpaRepository<Products, Integer> {
	// Thêm các phương thức truy vấn tùy chỉnh nếu cần
	List<Products> findAll();

	// Lấy 12 sản phẩm mới nhất theo ngày tạo
	List<Products> findTop12ByOrderByCreateDateDesc();

	// Lấy 12 sản phẩm cũ nhất theo ngày tạo
	List<Products> findTop12ByOrderByCreateDateAsc();

	// tìm sản phẩm liên quan theo danh mục
	List<Products> findByCategoryId(Integer categoryId);

	@Query("SELECT p FROM Products p JOIN p.category c WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) "
			+ "AND LOWER(c.name) = LOWER(:category)")
	List<Products> findByKeywordAndCategory(@Param("keyword") String keyword, @Param("category") String category);

	@Query("SELECT p FROM Products p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
	List<Products> findByKeyword(@Param("keyword") String keyword);

	@Query("SELECT p FROM Products p JOIN p.category c WHERE LOWER(c.name) = LOWER(:category)")
	List<Products> findByCategory(@Param("category") String category);

	List<Products> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);

}
