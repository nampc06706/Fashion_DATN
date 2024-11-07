package com.poly.util;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

import com.poly.dto.ContactDTO;

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
    
    
    public void sendContactEmail(ContactDTO contact) {
        // Tạo nội dung email gửi đến người dùng
        String userContent = "Xin chào " + contact.getFullName() + ",\r\n\r\n"
                + "Chúng tôi đã nhận được tin nhắn từ bạn với các thông tin sau:\r\n"
                + "Chủ đề: " + contact.getSubject() + "\r\n"
                + "Nội dung: " + contact.getMessage() + "\r\n\r\n"
                + "Chúng tôi sẽ phản hồi bạn trong thời gian sớm nhất.\r\n"
                + "Trân trọng,\r\n"
                + "Đội ngũ hỗ trợ Thời trang công sở";

        // Tạo và gửi email cho người dùng
        SimpleMailMessage userMessage = new SimpleMailMessage();
        userMessage.setTo(contact.getEmail()); // gửi đến email của người dùng
        userMessage.setSubject("Xác nhận nhận tin nhắn từ bạn: " + contact.getSubject());
        userMessage.setText(userContent);
        mailSender.send(userMessage);

        // Tạo nội dung email gửi đến admin
        String adminContent = "Bạn vừa nhận được tin nhắn mới từ người dùng:\r\n\r\n"
                + "Tên người dùng: " + contact.getFullName() + "\r\n"
                + "Email người dùng: " + contact.getEmail() + "\r\n"
                + "Chủ đề: " + contact.getSubject() + "\r\n"
                + "Nội dung: " + contact.getMessage() + "\r\n\r\n"
                + "Vui lòng kiểm tra và phản hồi trong thời gian sớm nhất.";

        // Tạo và gửi email cho admin
        SimpleMailMessage adminMessage = new SimpleMailMessage();
        adminMessage.setTo("le0963845867@gmail.com"); // thay "admin_email@gmail.com" bằng email của bạn
        adminMessage.setSubject("Tin nhắn mới từ người dùng: " + contact.getSubject());
        adminMessage.setText(adminContent);
        mailSender.send(adminMessage);
    }



}


    
    

