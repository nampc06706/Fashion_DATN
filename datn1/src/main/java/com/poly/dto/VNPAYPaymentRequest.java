package com.poly.dto;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class VNPAYPaymentRequest {
    private String orderId;
    private BigDecimal amount;
    private String bankCode; // Nếu có
    private String returnUrl; // URL để VNPay trả về kết quả

    // Getter và Setter
}
