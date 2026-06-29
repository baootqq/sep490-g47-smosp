package com.sep490_g47.smosp.course.dto;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class CourseResponse {
    private UUID id;
    private String code;
    private String name;
    private Integer credits;
    private String description;
    private Boolean countsTowardGpa;
    private Boolean isActive;
}
