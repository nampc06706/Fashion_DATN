package com.poly.entity;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "product_Flashsale")
public class ProductFlashsale {

    @EmbeddedId
    private ProductFlashsaleId id;

    @ManyToOne
    @MapsId("productId")
    @JoinColumn(name = "ProductID")
    private Products product;

    @ManyToOne
    @MapsId("flashsaleId")
    @JoinColumn(name = "FlashsaleID")
    private Flashsale flashsale;
    
    @Column(name = "Discount" ,nullable = false)
    private BigDecimal discount;
}
