package com.sep490_g47.smosp.auth.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {

    @NotBlank(message = "Tên đăng nhập không được để trống")
    private String identifier; // email (Student) hoặc username (CM/Admin)

    @NotBlank(message = "Mật khẩu không được để trống")
    private String password;
}