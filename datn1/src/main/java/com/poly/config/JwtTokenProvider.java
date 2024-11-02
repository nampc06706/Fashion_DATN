package com.poly.config;

import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.servlet.http.HttpServletRequest;

@Component
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration}")
    private long expirationTime;

 // Thêm UserDetailsService vào JwtTokenProvider
    private final UserDetailsService userDetailsService; // Khai báo UserDetailsService

    public JwtTokenProvider(UserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

 // Phương thức mới để lấy username từ token
    public String getUsernameFromToken(String token) {
        return getClaims(token).getSubject();
    }
 // Lấy email từ token
    public String getEmailFromToken(String token) {
        return getClaims(token).get("email", String.class);
    }

    
    public Authentication getAuthentication(String token) {
        Claims claims = getClaims(token);
        String username = claims.getSubject();
        String email = claims.get("email", String.class); // Lấy email từ claims
        // Lấy thông tin người dùng từ UserDetailsService
        System.out.println("Username from token: " + username);
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        // Trả về đối tượng Authentication
        return new UsernamePasswordAuthenticationToken(userDetails, token, userDetails.getAuthorities());
    }


    
    // Lấy token từ header
    public String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7); // Lấy token từ header, bỏ "Bearer "
        }
        return null;
    }

    // Tạo JWT token cho người dùng với vai trò
    public String generateToken(String username, String roles, Integer accountId , String gmail) {
        return Jwts.builder()
                .setSubject(username)  // Đặt tên người dùng trong token
                .claim("roles", roles) // Thêm vai trò vào token
                .claim("accountId", accountId)
                .claim("email", gmail)
                .setIssuedAt(new Date())  // Thời điểm token được tạo
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))  // Thời gian hết hạn của token
                .signWith(SignatureAlgorithm.HS512, secretKey)  // Ký token với thuật toán HS512 và khóa bí mật
                .compact();  // Chuyển token thành chuỗi
    }

    // Lấy Claims từ token
    public Claims getClaims(String token) {
        return Jwts.parser()
                .setSigningKey(secretKey)  // Đặt khóa bí mật để phân tích token
                .parseClaimsJws(token)  // Phân tích token và lấy Claims
                .getBody();
    }

    // Lấy tên người dùng từ token
    public String getUsername(String token) {
        return getClaims(token).getSubject();  // Lấy tên người dùng từ Claims
    }

    // Kiểm tra thời gian hết hạn
    public boolean isTokenExpired(String token) {
        Date expirationDate = getClaims(token).getExpiration();
        return expirationDate.before(new Date()); // Trả về true nếu token đã hết hạn
    }

    // Xác thực token
    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token);  // Kiểm tra tính hợp lệ của token
            return !isTokenExpired(token); // Kiểm tra xem token có hết hạn hay không
        } catch (Exception e) {
            // Có thể log thông báo lỗi nếu cần
            return false;  // Token không hợp lệ
        }
    }
}
