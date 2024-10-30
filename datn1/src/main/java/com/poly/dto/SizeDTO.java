package com.poly.dto;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Getter
@Setter
@NoArgsConstructor
public class SizeDTO {
    private Integer id;
    private Integer productId; // Đảm bảo rằng trường này là ID của sản phẩm
    private String name;
    private Integer quantityInStock;
    private ColorDTO color; // Giữ lại chỉ một màu cho kích thước

    public SizeDTO(Integer id, Integer productId, String name, Integer quantityInStock, ColorDTO color) {
        this.id = id;
        this.productId = productId;
        this.name = name;
        this.quantityInStock = quantityInStock;
        this.color = color;
    }
}
