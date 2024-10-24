package com.poly.dto;

import java.util.List;
import lombok.Data;

@Data
public class OrderRequestDTO {
    private Integer accountId;
    private Integer addressId;
    private Integer paymentId;
    private Integer shippingMethodId;
    private String note;
    private List<CartDTO> cartItems;  // Sử dụng danh sách CartDTO từ client
}

