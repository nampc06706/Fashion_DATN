package com.poly.dto;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@NoArgsConstructor
@Getter
@Setter
public class ProductImageDTO {
	private Integer id;
    private String image;
    private String fileName;
    
    public ProductImageDTO(Integer id, String image) {
        this.id = id;
        this.image = image;
    }
    
    public ProductImageDTO(String image) {
        this.image = image;
    }
}
