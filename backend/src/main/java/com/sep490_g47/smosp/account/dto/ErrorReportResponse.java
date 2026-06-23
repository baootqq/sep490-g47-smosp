package com.sep490_g47.smosp.account.dto;

import com.sep490_g47.smosp.account.enums.ReportEntityType;
import com.sep490_g47.smosp.account.enums.ReportStatus;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
public class ErrorReportResponse {
    private UUID id;
    private UUID reporterId;
    private ReportEntityType entityType;
    private UUID entityId;
    private String description;
    private ReportStatus status;
    private Instant createdAt;
}
