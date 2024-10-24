package com.poly.dto;

import lombok.Data;

@Data
public class ColorDTO {
    private Integer id; // Thêm ID để sử dụng trong DTO
    private String name;

 // Constructor mặc định
    public ColorDTO() {}
    
    public ColorDTO(Integer id, String name) {
        this.id = id;
        this.name = name;
    }
}
