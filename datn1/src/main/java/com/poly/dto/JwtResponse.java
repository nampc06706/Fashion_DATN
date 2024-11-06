package com.poly.dto;

public static class JwtResponse {

	// Cập nhật JwtResponse để chứa thêm 
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
