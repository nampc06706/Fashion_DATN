package com.poly.dto;

import java.math.BigDecimal;
import lombok.Data;

@Data
public class SimpleProductDTO {
	
	private int id;
    private String name;
    private BigDecimal price;
    private String firstImage;

    public SimpleProductDTO( Integer id,String name, BigDecimal price, String firstImage) {
    	this.id = id;
    	this.name = name;
        this.price = price;
        this.firstImage = firstImage;
    }
}
