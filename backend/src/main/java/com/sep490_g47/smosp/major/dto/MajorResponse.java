package com.sep490_g47.smosp.major.dto;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class MajorResponse {
    private UUID id;
    private String code;
    private String name;
    private String description;
    private String imageUrl;
    private BigDecimal tuitionPerTerm;
    private BigDecimal pricePerCredit;
    private LocalDateTime tuitionUpdatedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean isActive;
}
