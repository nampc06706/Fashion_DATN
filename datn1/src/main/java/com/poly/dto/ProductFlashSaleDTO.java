package com.poly.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
@AllArgsConstructor 
public class ProductFlashSaleDTO {
	private Integer productId;
	private Integer flashsaleId;
	private BigDecimal discount;

}
