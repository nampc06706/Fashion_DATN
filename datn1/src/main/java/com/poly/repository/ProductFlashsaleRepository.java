package com.poly.repository;

import com.poly.entity.ProductFlashsale;
import com.poly.entity.ProductFlashsaleId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductFlashsaleRepository extends JpaRepository<ProductFlashsale, ProductFlashsaleId> {
}
