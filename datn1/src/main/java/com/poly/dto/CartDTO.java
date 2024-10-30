package com.poly.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
public class CartDTO {
	private Integer id;
    private Integer accountId;
    private Integer quantity;
    private SizeDTO size;
}
