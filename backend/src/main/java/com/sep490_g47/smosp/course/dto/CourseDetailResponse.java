package com.sep490_g47.smosp.course.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
@Builder
public class CourseDetailResponse {
    private UUID id;
    private String code;
    private String name;
    private Integer credits;
    private String description;
    private Boolean countsTowardGpa;
    private Boolean isActive;
    private List<CourseResponse> prerequisites;
    private List<LearningResourceResponse> learningResources;
}
