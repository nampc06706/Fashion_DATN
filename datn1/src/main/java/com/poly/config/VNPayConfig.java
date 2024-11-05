package com.poly.config;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Random;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import jakarta.servlet.http.HttpServletRequest;

@Component
public class VNPayConfig {
    public static String vnp_PayUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    public static String vnp_Returnurl = "http://localhost:8080/api/user/payments/vnpay/callback";
    public static String vnp_TmnCode = "B30CT81X";
    public static String vnp_HashSecret = "XYLS2MV7R2I2205XX6SJ16L64J68SGLM";
    public static String vnp_apiUrl = "https://sandbox.vnpayment.vn/paymentv2/VnPayQR/Transaction";

    // Mã hóa MD5
    public static String md5(String message) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] hash = md.digest(message.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder(2 * hash.length);
            for (byte b : hash) {
                sb.append(String.format("%02x", b & 0xff));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            return "";
        }
    }

    // Mã hóa SHA-256
    public static String sha256(String message) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(message.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder(2 * hash.length);
            for (byte b : hash) {
                sb.append(String.format("%02x", b & 0xff));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            return "";
        }
    }

    // Tạo chuỗi hash từ tất cả các trường
    public static String hashAllFields(Map<String, String> fields) {
        List<String> fieldNames = new ArrayList<>(fields.keySet());
        Collections.sort(fieldNames);
        StringBuilder sb = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = fields.get(fieldName);
            if (fieldValue != null && !fieldValue.isEmpty()) {
                sb.append(fieldName).append("=").append(fieldValue);
                if (itr.hasNext()) {
                    sb.append("&");
                }
            }
        }
        return hmacSHA512(vnp_HashSecret, sb.toString());
    }

    // Mã hóa HMAC SHA-512
    public static String hmacSHA512(final String key, final String data) {
        try {
            if (key == null || data == null) {
                throw new NullPointerException();
            }
            Mac hmac512 = Mac.getInstance("HmacSHA512");
            SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            hmac512.init(secretKey);
            byte[] result = hmac512.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder(2 * result.length);
            for (byte b : result) {
                sb.append(String.format("%02x", b & 0xff));
            }
            return sb.toString();
        } catch (Exception ex) {
            return "";
        }
    }

    // Lấy địa chỉ IP từ yêu cầu
    public static String getIpAddress(HttpServletRequest request) {
        String ipAddress;
        try {
            ipAddress = request.getHeader("X-FORWARDED-FOR");
            if (ipAddress == null) {
                ipAddress = request.getLocalAddr();
            }
        } catch (Exception e) {
            ipAddress = "Invalid IP: " + e.getMessage();
        }
        return ipAddress;
    }

    // Tạo số ngẫu nhiên
    public static String getRandomNumber(int len) {
        Random rnd = new Random();
        StringBuilder sb = new StringBuilder(len);
        for (int i = 0; i < len; i++) {
            sb.append(rnd.nextInt(10)); // Lấy số ngẫu nhiên từ 0 đến 9
        }
        return sb.toString();
    }

    // Lấy trạng thái thanh toán từ VNPay
    public String getPaymentStatus(Integer paymentId) {
        RestTemplate restTemplate = new RestTemplate();
        String url = String.format("%s/check-payment/%d", vnp_apiUrl, paymentId); // Tùy chỉnh URL cho phù hợp với API VNPay

        // Gọi API và nhận trạng thái
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        if (response.getStatusCode() == HttpStatus.OK) {
            return response.getBody(); // Giả sử trả về trạng thái thanh toán
        }
        return null; // Hoặc xử lý lỗi nếu cần
    }
}
