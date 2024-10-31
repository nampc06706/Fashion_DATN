package com.poly.util;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;
import java.util.Random;

@Component
public class EmailUtil {

    private final JavaMailSender mailSender;

    public EmailUtil(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    // Phương thức tạo mã OTP 6 chữ số
    public String generateOtp() {
        return String.format("%06d", new Random().nextInt(999999));
    }

    // Phương thức để gửi mã OTP và trả về mã OTP đã tạo
    public String sendOtpEmail(String toEmail, String subject) {
        // Tạo mã OTP
        String otp = generateOtp();

        // Tạo nội dung email
        String content = "Xin chào bạn,"
                + "\r\n"
                + "Mã OTP của bạn để tạo mật khẩu mới là: " + otp + "\r\n"
                + "Vui lòng không chia sẻ mã này với ai và sử dụng nó trong vòng 5 phút.\r\n"
                + "\r\n"
                + "Trân trọng,\r\n"
                + " Thời trang công sở ";

        // Tạo và gửi email
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject(subject);
        message.setText(content);

        mailSender.send(message);

        // Trả về mã OTP để lưu hoặc sử dụng sau
        return otp;
    }
}
