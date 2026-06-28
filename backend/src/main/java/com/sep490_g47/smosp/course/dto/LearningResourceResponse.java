package com.sep490_g47.smosp.course.dto;

import com.sep490_g47.smosp.course.enums.ResourceType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class LearningResourceResponse {
    private UUID id;
    private String title;
    private String url;
    private ResourceType resourceType;
    private Integer displayOrder;
    private LocalDateTime createdAt;
}
