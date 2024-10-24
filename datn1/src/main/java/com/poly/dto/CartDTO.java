package com.poly.dto;

import lombok.Data;

@Data
public class CartDTO {
	private Integer id;
    private Integer accountId;
    private Integer quantity;
    private SizeDTO size;
}
