package com.poly.dto;

import lombok.Data;

@Data
public class ProductImageDTO {
    private String image;

    public ProductImageDTO(String image) {
        this.image = image;
    }
}
