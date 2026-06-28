package com.sep490_g47.smosp.course.service;

import com.sep490_g47.smosp.course.dto.CourseDetailResponse;
import com.sep490_g47.smosp.course.dto.CourseRequest;
import com.sep490_g47.smosp.course.dto.CourseResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface CourseService {
    Page<CourseResponse> getCourses(String code, String name, Boolean isActive, Pageable pageable);
    CourseDetailResponse getCourseDetail(UUID id);
    CourseResponse createCourse(CourseRequest request);
    CourseResponse updateCourse(UUID id, CourseRequest request);
    void deleteCourse(UUID id);
    CourseDetailResponse updatePrerequisites(UUID id, List<UUID> prerequisiteIds);
}
