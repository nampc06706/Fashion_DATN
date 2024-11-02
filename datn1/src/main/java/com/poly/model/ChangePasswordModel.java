package com.poly.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChangePasswordModel {
    private String email;
    private String currentPassword;
    private String newPassword;
    private String confirmPassword;
}
