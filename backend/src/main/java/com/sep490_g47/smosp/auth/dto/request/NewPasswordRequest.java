package com.sep490_g47.smosp.auth.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class NewPasswordRequest {

    @NotBlank
    private String token;

    @NotBlank
    @Size(min = 8, max = 128, message = "Mật khẩu phải từ 8 đến 128 ký tự")
    private String newPassword;
}