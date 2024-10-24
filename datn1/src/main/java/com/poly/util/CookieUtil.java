package com.poly.util;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.util.Arrays;
import java.util.Optional;

public class CookieUtil {

    // Phương thức để làm sạch giá trị cookie
	public static String sanitizeCookieValue(String value) {
	    if (value == null) return ""; // Trả về chuỗi rỗng nếu giá trị là null
	    return value.replace("\"", "")
	                .replace(";", "")
	                .replace(",", "")
	                .replace("\\", "")
	                .replace("\n", "")
	                .replace("\r", ""); // Xóa ký tự không hợp lệ
	}



    // Phương thức để tạo và thêm cookie vào response
	public static void addCookie(HttpServletResponse response, String name, String value, int maxAge) {
	    // Làm sạch giá trị cookie
	    value = sanitizeCookieValue(value);
	    
	    if (value.contains("\"")) {
	        System.out.println("Warning: Value contains invalid character [34] and will be sanitized.");
	    }

	    Cookie cookie = new Cookie(name, value);
	    cookie.setPath("/");
	    cookie.setHttpOnly(false);
	    cookie.setMaxAge(maxAge);
	    
	    System.out.println("Adding cookie: Name = " + name + ", Value = " + value + ", Max Age = " + maxAge);
	    response.addCookie(cookie);
	}


    // Phương thức để lấy giá trị cookie từ request
    public static Optional<Cookie> getCookie(HttpServletRequest request, String name) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            return Arrays.stream(cookies)
                    .filter(cookie -> cookie.getName().equals(name))
                    .findFirst(); // Trả về cookie đầu tiên có tên tương ứng
        }
        System.out.println("No cookies found for name: " + name);
        return Optional.empty(); // Trả về Optional rỗng nếu không tìm thấy cookie
    }

    // Phương thức để xóa cookie
    public static void deleteCookie(HttpServletResponse response, String name) {
        Cookie cookie = new Cookie(name, null);
        cookie.setPath("/");
        cookie.setMaxAge(0); // Đặt thời gian sống của cookie là 0 để xóa
        
        // Ghi log thông tin cookie trước khi xóa
        System.out.println("Deleting cookie: Name = " + name);
        
        response.addCookie(cookie);
    }
}
