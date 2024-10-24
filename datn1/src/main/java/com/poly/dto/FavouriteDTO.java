package com.poly.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FavouriteDTO {
    private Integer id;
    private Integer sizeId;   // ID của Size
    private Integer accountId; // ID của Account
    private Integer quantity; 
}
