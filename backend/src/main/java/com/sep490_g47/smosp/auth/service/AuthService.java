package com.sep490_g47.smosp.auth.service;

import com.sep490_g47.smosp.auth.dto.request.*;
import com.sep490_g47.smosp.auth.dto.response.*;
import com.sep490_g47.smosp.auth.entity.*;
import com.sep490_g47.smosp.auth.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserAccountRepository userAccountRepository;
    private final RoleRepository roleRepository;
    private final EmailVerificationTokenRepository emailVerificationTokenRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;

    @Transactional
    public MessageResponse register(RegisterRequest request) {
        if (userAccountRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }

        Role studentRole = roleRepository.findByName("ROLE_STUDENT")
                .orElseThrow(() -> new RuntimeException("Role ROLE_STUDENT not initialized"));

        UserAccount user = UserAccount.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .isActive(false)
                .isLocked(false)
                .roles(Set.of(studentRole))
                .build();
        userAccountRepository.save(user);

        String token = UUID.randomUUID().toString();
        EmailVerificationToken verificationToken = EmailVerificationToken.builder()
                .user(user)
                .token(token)
                .expiresAt(LocalDateTime.now().plusHours(24))
                .build();
        emailVerificationTokenRepository.save(verificationToken);

        emailService.sendVerificationEmail(user.getEmail(), token);

        return new MessageResponse("Registration successful. Please check your email to activate your account.", true);
    }

    @Transactional
    public MessageResponse verifyEmail(String token) {
        EmailVerificationToken verificationToken = emailVerificationTokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid token"));

        if (verificationToken.getUsedAt() != null) {
            throw new IllegalArgumentException("Token already used");
        }
        if (verificationToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Token expired");
        }

        UserAccount user = verificationToken.getUser();
        user.setIsActive(true);
        userAccountRepository.save(user);

        verificationToken.setUsedAt(LocalDateTime.now());
        emailVerificationTokenRepository.save(verificationToken);

        return new MessageResponse("Account activated successfully. You can now log in.", true);
    }

    public AuthResponse login(LoginRequest request) {
        // Tìm user theo email hoặc username
        UserAccount user = userAccountRepository.findByEmail(request.getIdentifier())
                .or(() -> userAccountRepository.findByUsername(request.getIdentifier()))
                .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BadCredentialsException("Invalid credentials");
        }
        if (!user.getIsActive()) {
            throw new IllegalStateException("Account not activated. Please check your email.");
        }
        if (user.getIsLocked()) {
            throw new IllegalStateException("Account is locked. Please contact Admin.");
        }

        Set<String> roles = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toSet());

        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", roles);

        String identifier = user.getEmail() != null ? user.getEmail() : user.getUsername();
        String accessToken = jwtService.generateAccessToken(identifier, claims);
        String refreshToken = jwtService.generateRefreshToken(identifier);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .userId(user.getId())
                .email(user.getEmail())
                .username(user.getUsername())
                .roles(roles)
                .build();
    }

    @Transactional
    public MessageResponse forgotPassword(PasswordResetRequest request) {
        UserAccount user = userAccountRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Email not found"));

        passwordResetTokenRepository.deleteByUserId(user.getId());

        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = PasswordResetToken.builder()
                .user(user)
                .token(token)
                .expiresAt(LocalDateTime.now().plusHours(1))
                .build();
        passwordResetTokenRepository.save(resetToken);

        emailService.sendPasswordResetEmail(user.getEmail(), token);

        return new MessageResponse("Password reset email has been sent.", true);
    }

    @Transactional
    public MessageResponse resetPassword(NewPasswordRequest request) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new IllegalArgumentException("Invalid token"));

        if (resetToken.getUsedAt() != null) {
            throw new IllegalArgumentException("Token already used");
        }
        if (resetToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Token expired");
        }

        UserAccount user = resetToken.getUser();
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userAccountRepository.save(user);

        resetToken.setUsedAt(LocalDateTime.now());
        passwordResetTokenRepository.save(resetToken);

        return new MessageResponse("Password reset successfully.", true);
    }
}