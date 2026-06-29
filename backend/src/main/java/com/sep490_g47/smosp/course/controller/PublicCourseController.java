package com.sep490_g47.smosp.course.controller;

import com.sep490_g47.smosp.course.dto.CourseDetailResponse;
import com.sep490_g47.smosp.course.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class PublicCourseController {

    private final CourseService courseService;

    @GetMapping("/{id}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<CourseDetailResponse> getCourseDetail(@PathVariable UUID id) {
        return ResponseEntity.ok(courseService.getCourseDetail(id));
    }
}
