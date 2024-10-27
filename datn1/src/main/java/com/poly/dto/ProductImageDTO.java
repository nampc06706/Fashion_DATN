package com.poly.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ProductImageDTO {
    private String image;

    public ProductImageDTO(String image) {
        this.image = image;
    }
}
