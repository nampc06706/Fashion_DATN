package com.poly.repository;

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
    
    @Query("SELECT p FROM Products p LEFT JOIN FETCH p.images JOIN LEFT JOIN FETCH p.sizes WHERE p.id = :id")
    Products findByIdWithDetails(@Param("id") Integer id);

}
