package com.poly.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@Component // Đảm bảo rằng lớp này được nhận diện như một bean của Spring
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {
	private static final Logger logger = LoggerFactory.getLogger(CustomAuthenticationEntryPoint.class);

	@Override
	public void commence(HttpServletRequest request, HttpServletResponse response,
			AuthenticationException authException) throws IOException {
		// Ghi lại thông tin về yêu cầu
		logger.error("Truy cập bị từ chối: {} - URL: {} - Phương thức: {}", authException.getMessage(),
				request.getRequestURL(), request.getMethod());
		// Log thêm thông tin yêu cầu
		logger.info("Thông tin yêu cầu: Remote Addr: {}, User Agent: {}", request.getRemoteAddr(),
				request.getHeader("User-Agent"));
		// Trả về mã lỗi 403 (Forbidden)
		response.sendError(HttpServletResponse.SC_FORBIDDEN, "Bạn không có quyền truy cập vào tài nguyên này.");
	}
}
