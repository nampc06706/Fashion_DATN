package com.poly.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.poly.entity.ProductFlashsale;
import com.poly.entity.ProductFlashsaleId;

@Repository
public interface FlashsaleRepository extends JpaRepository<ProductFlashsale, ProductFlashsaleId> {

    // Câu truy vấn tìm tất cả các sản phẩm đang có trong flash sale
    @Query("SELECT pf FROM ProductFlashsale pf WHERE pf.flashsale.isactive = true AND "
         + "CURRENT_TIMESTAMP BETWEEN pf.flashsale.startdate AND pf.flashsale.enddate")
    List<ProductFlashsale> findCurrentFlashSales();
    
    
    @Query("SELECT pf FROM ProductFlashsale pf WHERE pf.product.id = :productId AND "
    	     + "pf.flashsale.isactive = true AND "
    	     + "CURRENT_TIMESTAMP BETWEEN pf.flashsale.startdate AND pf.flashsale.enddate")
    	ProductFlashsale findFlashSaleByProductId(Integer productId);

}
