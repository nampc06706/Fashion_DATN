package com.poly.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.poly.config.JwtTokenProvider;
import com.poly.entity.Account;
import com.poly.entity.Authorities;
import com.poly.service.AccountService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private AccountService accountService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    
    @PostMapping("/guest/takeData")
    public ResponseEntity<?> layDuLieuGoogle(@RequestBody Account account) {
        // Kiểm tra thông tin tài khoản trước khi lưu
        if (account == null || account.getFullname() == null || account.getUsername() == null || account.getEmail() == null) {
            return ResponseEntity.badRequest().body("Fullname, username, and email are required.");
        }

        try {
            // Kiểm tra xem tài khoản đã tồn tại hay chưa
            Account existingAccount = accountService.findByEmail(account.getEmail());
            if (existingAccount != null) {
                // Tài khoản đã tồn tại, trả về JWT token
                String roles = existingAccount.getAuthority().getRole().getName();
                String token = jwtTokenProvider.generateToken(existingAccount.getUsername(), roles, existingAccount.getId());
                return ResponseEntity.ok(new JwtResponse(token, roles));
            }

            // Tạo tài khoản mới nếu chưa tồn tại
            Account savedAccount = accountService.save(account.getFullname(), account.getUsername(), account.getEmail());

            // Tạo và trả về JWT token cho tài khoản mới
            String roles = savedAccount.getAuthority().getRole().getName(); // Lấy vai trò từ tài khoản đã lưu
            String token = jwtTokenProvider.generateToken(savedAccount.getUsername(), roles, savedAccount.getId());

            return ResponseEntity.ok(new JwtResponse(token, roles)); // Trả về thông tin tài khoản mới và token
        } catch (Exception e) {
            // Ghi lại lỗi để dễ dàng chẩn đoán
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving account: " + e.getMessage());
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        try {
            // Đăng ký tài khoản mới
            Account newAccount = accountService.register(
                registerRequest.getFullname(),
                registerRequest.getUsername(),
                registerRequest.getPassword(),
                registerRequest.getEmail(),
                registerRequest.getPhone()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(newAccount);
        } catch (RuntimeException e) {
            // Ghi log chi tiết để debug
            System.err.println("Error during registration: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestParam String username, @RequestParam String password) {
        try {
            // Kiểm tra thông tin đăng nhập
        	
            Account account = accountService.login(username, password);
            
            // Kiểm tra quyền hạn của tài khoản
            Authorities authority = account.getAuthority();
            if (authority != null && authority.getRole() != null) {
                String role = authority.getRole().getName();
                
                // Tạo và trả về JWT token
                String token = jwtTokenProvider.generateToken(account.getUsername(), role,account.getId());
                return ResponseEntity.ok(new JwtResponse(token,role ));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No roles assigned to this account");
            }
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Username not found");
        } catch (RuntimeException e) {
            // Ghi log chi tiết để debug
            //System.err.println("Error during login: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Incorrect password");
        }
    }
    

    // Cập nhật JwtResponse để chứa thêm thông tin
    public static class JwtResponse {
        private String token;
        private String role; // Thêm vai trò

        public JwtResponse(String token, String role) {
            this.token = token;
            this.role = role;
        }

        public String getToken() {
            return token;
        }

        public String getRole() {
            return role; // Thêm getter cho vai trò
        }
    }


    public static class RegisterRequest {
        private String fullname;
        private String username;
        private String password;
        private String email;
        private String phone;

        // Getters and Setters
        public String getFullname() {
            return fullname;
        }

        public void setFullname(String fullname) {
            this.fullname = fullname;
        }

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPhone() {
            return phone;
        }

        public void setPhone(String phone) {
            this.phone = phone;
        }
    }
}
