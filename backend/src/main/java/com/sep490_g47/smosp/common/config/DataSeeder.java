package com.sep490_g47.smosp.common.config;

import com.sep490_g47.smosp.auth.entity.Role;
import com.sep490_g47.smosp.auth.entity.UserAccount;
import com.sep490_g47.smosp.auth.repository.RoleRepository;
import com.sep490_g47.smosp.auth.repository.UserAccountRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserAccountRepository userAccountRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        List<String> roles = List.of("ROLE_STUDENT", "ROLE_CONTENT_MANAGER", "ROLE_ADMIN");
        for (String roleName : roles) {
            if (roleRepository.findByName(roleName).isEmpty()) {
                roleRepository.save(Role.builder().name(roleName).build());
                log.info("Seeded role: {}", roleName);
            }
        }

        // Seed Admin User
        if (userAccountRepository.findByUsername("admin").isEmpty()) {
            Role adminRole = roleRepository.findByName("ROLE_ADMIN").orElseThrow();
            userAccountRepository.save(UserAccount.builder()
                    .username("admin")
                    .email("admin@smosp.com")
                    .passwordHash(passwordEncoder.encode("12345678"))
                    .role(adminRole)
                    .build());
            log.info("Seeded admin user");
        }

        // Seed Content Manager User
        if (userAccountRepository.findByUsername("contentmanager").isEmpty()) {
            Role cmRole = roleRepository.findByName("ROLE_CONTENT_MANAGER").orElseThrow();
            userAccountRepository.save(UserAccount.builder()
                    .username("contentmanager")
                    .email("contentmanager@smosp.com")
                    .passwordHash(passwordEncoder.encode("12345678"))
                    .role(cmRole)
                    .build());
            log.info("Seeded content manager user");
        }
    }
}