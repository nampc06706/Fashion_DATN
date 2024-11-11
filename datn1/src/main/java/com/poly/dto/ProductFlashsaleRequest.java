package com.poly.dto;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class ProductFlashsaleRequest {
    private Integer productId;
    private Integer flashsaleId;
    private BigDecimal discount;

}

