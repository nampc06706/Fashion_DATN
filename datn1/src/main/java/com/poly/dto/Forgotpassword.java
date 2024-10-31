package com.poly.dto;

import java.time.LocalDateTime;

public class Forgotpassword {
    private String email; // Thuộc tính email
    private String otp;    // Thuộc tính mã OTP
    private LocalDateTime timestamp; // Thời gian gửi mã OTP

    // Constructor mặc định
    public Forgotpassword() {
    }

    // Constructor với 2 tham số
    public Forgotpassword(String email, String otp) {
        this.email = email;
        this.otp = otp;
        this.timestamp = LocalDateTime.now(); // Gán thời gian gửi mã OTP
    }

    // Constructor với 3 tham số
    public Forgotpassword(String email, String otp, LocalDateTime timestamp) {
        this.email = email;
        this.otp = otp;
        this.timestamp = timestamp;
    }

    // Getter và setter cho email
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    // Getter và setter cho otp
    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }

    // Getter và setter cho timestamp
    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    // Kiểm tra xem mã OTP đã hết hạn chưa
    public boolean isOtpExpired() {
        return LocalDateTime.now().isAfter(this.timestamp.plusMinutes(5));
    }
}
