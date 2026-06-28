package com.sep490_g47.smosp.narrowspec.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class NarrowSpecResponse {
    private UUID id;
    private UUID specializationId;
    private String code;
    private String name;
    private String description;
    private Boolean isPublished;
    private LocalDateTime publishedAt;
}
