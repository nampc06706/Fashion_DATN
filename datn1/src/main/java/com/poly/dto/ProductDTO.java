package com.poly.dto;

import java.math.BigDecimal;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data

@NoArgsConstructor

public class ProductDTO {
	private Integer id; 
    private String name;
    private BigDecimal price;
    private String description;
    private String firstImage;
    private List<ProductImageDTO> images;
    private List<SizeDTO> sizes;
    private CategoryDTO category; 

    public ProductDTO(Integer id,String name, BigDecimal price,String description, String firstImage, List<ProductImageDTO> images, List<SizeDTO> sizes,CategoryDTO category) {
    	this.id = id;
    	this.name = name;
        this.price = price;
        this.description = description;
        this.firstImage = firstImage;
        this.images = images;
        this.sizes = sizes;
        this.category = category;
    }
}
