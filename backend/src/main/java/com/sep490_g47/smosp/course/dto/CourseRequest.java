package com.sep490_g47.smosp.course.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import jakarta.validation.constraints.NotBlank;

@Data
public class CourseRequest {
    @NotBlank(message = "Code is required")
    private String code;

    @NotBlank(message = "Name is required")
    private String name;

    @NotNull(message = "Credits are required")
    private Integer credits;

    private String description;
    private Boolean countsTowardGpa;
    private Boolean isActive;
}
