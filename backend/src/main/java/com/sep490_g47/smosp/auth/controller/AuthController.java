package com.sep490_g47.smosp.auth.controller;

import com.sep490_g47.smosp.auth.dto.request.*;
import com.sep490_g47.smosp.auth.dto.response.*;
import com.sep490_g47.smosp.auth.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Auth endpoints — register, login, verify, reset password")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Student self-registration")
    public ResponseEntity<MessageResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @GetMapping("/verify-email")
    @Operation(summary = "Verify email after registration")
    public ResponseEntity<MessageResponse> verifyEmail(@RequestParam String token) {
        return ResponseEntity.ok(authService.verifyEmail(token));
    }

    @PostMapping("/login")
    @Operation(summary = "Login — email (Student) or username (CM/Admin)")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/forgot-password")
    @Operation(summary = "Request password reset email")
    public ResponseEntity<MessageResponse> forgotPassword(@Valid @RequestBody PasswordResetRequest request) {
        return ResponseEntity.ok(authService.forgotPassword(request));
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Reset password using token from email")
    public ResponseEntity<MessageResponse> resetPassword(@Valid @RequestBody NewPasswordRequest request) {
        return ResponseEntity.ok(authService.resetPassword(request));
    }
}