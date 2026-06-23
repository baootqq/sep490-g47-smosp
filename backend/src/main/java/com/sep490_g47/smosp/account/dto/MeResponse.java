package com.sep490_g47.smosp.account.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MeResponse {
    private UUID id;
    private String role;
    private String identifier;
    private String displayName;
    private boolean notifEnabled;
    private String status;
    private Instant createdAt;
}
