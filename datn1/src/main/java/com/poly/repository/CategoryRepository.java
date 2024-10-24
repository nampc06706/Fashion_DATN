package com.poly.repository;

import com.poly.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {
    // Thêm các phương thức truy vấn tùy chỉnh nếu cần
}
