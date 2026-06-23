package com.sep490_g47.smosp.auth.security;

import com.sep490_g47.smosp.auth.entity.UserAccount;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.UUID;

public class CustomUserDetails implements UserDetails {

    @Getter
    private final UUID userId;
    private final String identifier; // email or username
    private final String password;
    private final Collection<? extends GrantedAuthority> authorities;
    private final boolean isActive;

    public CustomUserDetails(UserAccount userAccount) {
        this.userId = userAccount.getId();
        this.identifier = userAccount.getEmail() != null ? userAccount.getEmail() : userAccount.getUsername();
        this.password = userAccount.getPasswordHash();
        this.authorities = Collections.singletonList(new SimpleGrantedAuthority(userAccount.getRole().getName()));
        this.isActive = "ACTIVE".equals(userAccount.getStatus()) && userAccount.getLockTime() == null;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return identifier;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return isActive;
    }
}
