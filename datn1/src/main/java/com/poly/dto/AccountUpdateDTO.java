package com.poly.dto;

import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccountUpdateDTO {
	private String username;
	private String fullname;
	private String email;
	private String phone;
	private String password;
	private MultipartFile image;
	private boolean activated;
	private Integer roleId; // ID của role mới

	public void setImage(MultipartFile image) {
        this.image = image;
    }
}
