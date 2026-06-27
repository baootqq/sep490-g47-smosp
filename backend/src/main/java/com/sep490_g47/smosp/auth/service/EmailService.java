package com.sep490_g47.smosp.auth.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    public void sendVerificationEmail(String toEmail, String token) {
        String link = frontendUrl + "/verify-email?token=" + token;
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("[SMOSP] Xác minh email đăng ký");
        message.setText("Chào bạn,\n\nVui lòng click vào link sau để kích hoạt tài khoản:\n" + link
                + "\n\nLink có hiệu lực trong 24 giờ.\n\nSMOSP Team");
        mailSender.send(message);
    }

    public void sendPasswordResetEmail(String toEmail, String token) {
        String link = frontendUrl + "/reset-password?token=" + token;
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("[SMOSP] Đặt lại mật khẩu");
        message.setText("Chào bạn,\n\nVui lòng click vào link sau để đặt lại mật khẩu:\n" + link
                + "\n\nLink có hiệu lực trong 1 giờ.\n\nNếu bạn không yêu cầu, hãy bỏ qua email này.\n\nSMOSP Team");
        mailSender.send(message);
    }
}