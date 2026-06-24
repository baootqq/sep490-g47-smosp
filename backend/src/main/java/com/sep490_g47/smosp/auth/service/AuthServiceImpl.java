package com.sep490_g47.smosp.auth.service;

import com.sep490_g47.smosp.auth.dto.request.*;
import com.sep490_g47.smosp.auth.dto.response.AuthResponse;
import com.sep490_g47.smosp.auth.dto.response.MessageResponse;
import com.sep490_g47.smosp.auth.entity.*;
import com.sep490_g47.smosp.auth.exception.AccountLockedException;
import com.sep490_g47.smosp.auth.exception.AuthBusinessException;
import com.sep490_g47.smosp.auth.exception.TokenExpiredException;
import com.sep490_g47.smosp.auth.repository.*;
import com.sep490_g47.smosp.auth.utils.HashUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserAccountRepository userAccountRepository;
    private final RoleRepository roleRepository;
    private final EmailVerificationTokenRepository emailVerificationTokenRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final OauthIdentityRepository oauthIdentityRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;

    private static final int MAX_FAILED_ATTEMPTS = 5;
    private static final int LOCK_TIME_DURATION_MINUTES = 30;

    @Value("${spring.security.oauth2.client.registration.google.client-id:YOUR_GOOGLE_CLIENT_ID}")
    private String googleClientId;

    @Override
    @Transactional
    public MessageResponse register(RegisterRequest request) {
        boolean emailExists = userAccountRepository.existsByEmail(request.getEmail());
        if (!emailExists) {
            Role studentRole = roleRepository.findByName("ROLE_STUDENT")
                    .orElseThrow(() -> new AuthBusinessException("Role ROLE_STUDENT not initialized"));

            UserAccount user = UserAccount.builder()
                    .email(request.getEmail())
                    .passwordHash(passwordEncoder.encode(request.getPassword()))
                    .displayName(request.getFullName())
                    .status("INACTIVE")
                    .role(studentRole)
                    .failedLoginAttempts(0)
                    .build();
            userAccountRepository.save(user);

            String token = UUID.randomUUID().toString();
            String tokenHash = HashUtil.sha256(token); // BR-01

            EmailVerificationToken verificationToken = EmailVerificationToken.builder()
                    .user(user)
                    .tokenHash(tokenHash)
                    .expiresAt(LocalDateTime.now().plusHours(24)) // BV-03
                    .used(false)
                    .build();
            emailVerificationTokenRepository.save(verificationToken);

            emailService.sendVerificationEmail(user.getEmail(), token);
        }

        // BR-02: Prevent revealing if email exists
        return new MessageResponse("If your email is valid, a verification link has been sent.", true);
    }

    @Override
    @Transactional
    public MessageResponse verifyEmail(VerifyEmailRequest request) {
        String tokenHash = HashUtil.sha256(request.getToken());
        EmailVerificationToken verificationToken = emailVerificationTokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> new AuthBusinessException("Invalid token"));

        if (verificationToken.getUsed()) {
            throw new AuthBusinessException("Token already used");
        }
        if (verificationToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new TokenExpiredException("Token expired");
        }

        UserAccount user = verificationToken.getUser();
        user.setStatus("ACTIVE");
        userAccountRepository.save(user);

        verificationToken.setUsed(true);
        emailVerificationTokenRepository.save(verificationToken);

        return new MessageResponse("Account activated successfully. You can now log in.", true);
    }

    @Override
    @Transactional
    public MessageResponse resendVerifyEmail(ResendVerifyEmailRequest request) {
        Optional<UserAccount> userOpt = userAccountRepository.findByEmail(request.getEmail());
        if (userOpt.isPresent()) {
            UserAccount user = userOpt.get();
            if ("INACTIVE".equals(user.getStatus())) {
                String token = UUID.randomUUID().toString();
                String tokenHash = HashUtil.sha256(token);

                EmailVerificationToken verificationToken = EmailVerificationToken.builder()
                        .user(user)
                        .tokenHash(tokenHash)
                        .expiresAt(LocalDateTime.now().plusHours(24))
                        .used(false)
                        .build();
                emailVerificationTokenRepository.save(verificationToken);

                emailService.sendVerificationEmail(user.getEmail(), token);
            }
        }
        return new MessageResponse("If your email is valid, a verification link has been sent.", true);
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        UserAccount user = userAccountRepository.findByEmail(request.getIdentifier())
                .or(() -> userAccountRepository.findByUsername(request.getIdentifier()))
                .orElseThrow(() -> new AuthBusinessException("Invalid credentials"));

        // BR-19: Check lock time
        if (user.getLockTime() != null) {
            if (user.getLockTime().plusMinutes(LOCK_TIME_DURATION_MINUTES).isAfter(LocalDateTime.now())) {
                throw new AccountLockedException("Account is locked. Please try again later.");
            } else {
                user.setLockTime(null);
                user.setFailedLoginAttempts(0);
                userAccountRepository.save(user);
            }
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            int attempts = user.getFailedLoginAttempts() + 1;
            user.setFailedLoginAttempts(attempts);
            if (attempts >= MAX_FAILED_ATTEMPTS) {
                user.setLockTime(LocalDateTime.now());
            }
            userAccountRepository.save(user);
            throw new AuthBusinessException("Invalid credentials");
        }

        if ("INACTIVE".equals(user.getStatus())) {
            throw new AuthBusinessException("Account not activated. Please check your email.");
        }

        // BR-45: Forced password change logic could be handled on client side by a specific response 
        // flag or checked by an interceptor, but we assume active means ok for now. 
        // Or we could check if status == 'PENDING_PASSWORD_CHANGE'.

        user.setFailedLoginAttempts(0);
        user.setLockTime(null);
        userAccountRepository.save(user);

        Set<String> roles = Set.of(user.getRole().getName());
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", roles);

        String identifier = user.getEmail() != null ? user.getEmail() : user.getUsername();
        String accessToken = jwtService.generateAccessToken(identifier, claims);
        String refreshTokenString = jwtService.generateRefreshToken(identifier);

        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .token(HashUtil.sha256(refreshTokenString))
                .expiresAt(LocalDateTime.now().plusDays(7)) // Example: 7 days expiry
                .build();
        refreshTokenRepository.save(refreshToken);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshTokenString)
                .tokenType("Bearer")
                .userId(user.getId())
                .email(user.getEmail())
                .username(user.getUsername())
                .roles(roles)
                .build();
    }

    @Override
    @Transactional
    public AuthResponse googleLogin(GoogleLoginRequest request) {
        FirebaseToken decodedToken;
        try {
            decodedToken = FirebaseAuth.getInstance().verifyIdToken(request.getIdToken());
        } catch (FirebaseAuthException e) {
            throw new AuthBusinessException("Invalid Firebase ID token: " + e.getMessage());
        }

        String userEmail = decodedToken.getEmail();
        String providerUid = decodedToken.getUid();
        
        UserAccount user = userAccountRepository.findByEmail(userEmail)
                .orElseGet(() -> {
                    Role studentRole = roleRepository.findByName("ROLE_STUDENT")
                            .orElseThrow(() -> new AuthBusinessException("ROLE_STUDENT not initialized"));
                    UserAccount newUser = UserAccount.builder()
                            .email(userEmail)
                            .status("ACTIVE")
                            .role(studentRole)
                            .failedLoginAttempts(0)
                            .build();
                    return userAccountRepository.save(newUser);
                });

        Optional<OauthIdentity> identityOpt = oauthIdentityRepository.findByProviderAndProviderUid("google", providerUid);
        if (identityOpt.isEmpty()) {
            OauthIdentity identity = OauthIdentity.builder()
                    .user(user)
                    .provider("google")
                    .providerUid(providerUid)
                    .build();
            oauthIdentityRepository.save(identity);
        }

        Set<String> roles = Set.of(user.getRole().getName());
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", roles);

        String accessToken = jwtService.generateAccessToken(user.getEmail(), claims);
        String refreshTokenString = jwtService.generateRefreshToken(user.getEmail());

        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .token(HashUtil.sha256(refreshTokenString))
                .expiresAt(LocalDateTime.now().plusDays(7))
                .build();
        refreshTokenRepository.save(refreshToken);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshTokenString)
                .tokenType("Bearer")
                .userId(user.getId())
                .email(user.getEmail())
                .username(user.getUsername())
                .roles(roles)
                .build();
    }

    @Override
    @Transactional
    public MessageResponse logout(LogoutRequest request) {
        String tokenHash = HashUtil.sha256(request.getRefreshToken());
        Optional<RefreshToken> tokenOpt = refreshTokenRepository.findByToken(tokenHash);
        tokenOpt.ifPresent(refreshTokenRepository::delete); // AC-01-04 immediate revoke
        return new MessageResponse("Logged out successfully", true);
    }

    @Override
    @Transactional
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        String tokenHash = HashUtil.sha256(request.getRefreshToken());
        RefreshToken oldToken = refreshTokenRepository.findByToken(tokenHash)
                .orElseThrow(() -> new AuthBusinessException("Invalid refresh token"));

        if (oldToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            refreshTokenRepository.delete(oldToken);
            throw new TokenExpiredException("Refresh token expired");
        }

        UserAccount user = oldToken.getUser();
        refreshTokenRepository.delete(oldToken); // Rotate token

        Set<String> roles = Set.of(user.getRole().getName());
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", roles);

        String identifier = user.getEmail() != null ? user.getEmail() : user.getUsername();
        String newAccessToken = jwtService.generateAccessToken(identifier, claims);
        String newRefreshTokenString = jwtService.generateRefreshToken(identifier);

        RefreshToken newRefreshToken = RefreshToken.builder()
                .user(user)
                .token(HashUtil.sha256(newRefreshTokenString))
                .expiresAt(LocalDateTime.now().plusDays(7))
                .build();
        refreshTokenRepository.save(newRefreshToken);

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshTokenString)
                .tokenType("Bearer")
                .userId(user.getId())
                .email(user.getEmail())
                .username(user.getUsername())
                .roles(roles)
                .build();
    }

    @Override
    @Transactional
    public MessageResponse forgotPassword(PasswordResetRequest request) {
        Optional<UserAccount> userOpt = userAccountRepository.findByEmail(request.getEmail());
        if (userOpt.isPresent()) {
            UserAccount user = userOpt.get();
            String token = UUID.randomUUID().toString();
            String tokenHash = HashUtil.sha256(token);

            PasswordResetToken resetToken = PasswordResetToken.builder()
                    .user(user)
                    .tokenHash(tokenHash)
                    .expiresAt(LocalDateTime.now().plusMinutes(60)) // BV-04
                    .used(false)
                    .build();
            passwordResetTokenRepository.save(resetToken);

            emailService.sendPasswordResetEmail(user.getEmail(), token);
        }

        return new MessageResponse("If your email is valid, a password reset link has been sent.", true);
    }

    @Override
    @Transactional
    public MessageResponse resetPassword(NewPasswordRequest request) {
        String tokenHash = HashUtil.sha256(request.getToken());
        PasswordResetToken resetToken = passwordResetTokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> new AuthBusinessException("Invalid token"));

        if (resetToken.getUsed()) {
            throw new AuthBusinessException("Token already used");
        }
        if (resetToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new TokenExpiredException("Token expired");
        }

        UserAccount user = resetToken.getUser();
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userAccountRepository.save(user);

        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);

        return new MessageResponse("Password reset successfully.", true);
    }

    @Override
    @Transactional
    public MessageResponse changePassword(ChangePasswordRequest request, UUID userId) {
        UserAccount user = userAccountRepository.findById(userId)
                .orElseThrow(() -> new AuthBusinessException("User not found"));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPasswordHash())) {
            throw new AuthBusinessException("Incorrect old password");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userAccountRepository.save(user);

        return new MessageResponse("Password changed successfully", true);
    }
}
