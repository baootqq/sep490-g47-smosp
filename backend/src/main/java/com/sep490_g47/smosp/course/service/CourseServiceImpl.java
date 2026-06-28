package com.sep490_g47.smosp.course.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.sep490_g47.smosp.course.dto.CourseDetailResponse;
import com.sep490_g47.smosp.course.dto.CourseRequest;
import com.sep490_g47.smosp.course.dto.CourseResponse;
import com.sep490_g47.smosp.course.dto.LearningResourceResponse;
import com.sep490_g47.smosp.course.entity.Course;
import com.sep490_g47.smosp.course.entity.LearningResource;
import com.sep490_g47.smosp.course.enums.ResourceType;
import com.sep490_g47.smosp.course.repository.CourseRepository;
import com.sep490_g47.smosp.course.repository.LearningResourceRepository;
import com.sep490_g47.smosp.course.util.CourseConstants;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseServiceImpl implements CourseService, LearningResourceService {

    private final CourseRepository courseRepository;
    private final LearningResourceRepository learningResourceRepository;
    private final Cloudinary cloudinary;

    @Override
    @Transactional(readOnly = true)
    public Page<CourseResponse> getCourses(String code, String name, Boolean isActive, Pageable pageable) {
        if (pageable.getSort().isSorted()) {
            List<Sort.Order> validOrders = pageable.getSort().stream()
                    .filter(order -> order.getProperty() != null && !order.getProperty().trim().isEmpty())
                    .collect(Collectors.toList());
            if (validOrders.isEmpty()) {
                pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.unsorted());
            } else {
                pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by(validOrders));
            }
        }

        return courseRepository.findCoursesWithFilters(code, name, isActive, pageable)
                .map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public CourseDetailResponse getCourseDetail(UUID id) {
        Course course = courseRepository.findDetailById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, CourseConstants.ERR_COURSE_NOT_FOUND));

        return mapToDetailResponse(course);
    }

    @Override
    @Transactional
    public CourseResponse createCourse(CourseRequest request) {
        if (courseRepository.existsByCode(request.getCode())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, CourseConstants.ERR_CODE_UNIQUE);
        }

        Course course = Course.builder()
                .code(request.getCode())
                .name(request.getName())
                .credits(request.getCredits())
                .description(request.getDescription())
                .countsTowardGpa(request.getCountsTowardGpa() != null ? request.getCountsTowardGpa() : true)
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .build();

        course = courseRepository.save(course);
        return mapToResponse(course);
    }

    @Override
    @Transactional
    public CourseResponse updateCourse(UUID id, CourseRequest request) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, CourseConstants.ERR_COURSE_NOT_FOUND));

        if (courseRepository.existsByCodeAndIdNot(request.getCode(), id)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, CourseConstants.ERR_CODE_UNIQUE);
        }

        course.setCode(request.getCode());
        course.setName(request.getName());
        course.setCredits(request.getCredits());
        course.setDescription(request.getDescription());
        
        if (request.getCountsTowardGpa() != null) {
            course.setCountsTowardGpa(request.getCountsTowardGpa());
        }
        if (request.getIsActive() != null) {
            course.setIsActive(request.getIsActive());
        }

        course = courseRepository.save(course);
        return mapToResponse(course);
    }

    @Override
    @Transactional
    public void deleteCourse(UUID id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, CourseConstants.ERR_COURSE_NOT_FOUND));

        long usageInNs = courseRepository.countUsagesInNarrowSpec(id);
        long usageAsPre = courseRepository.countUsagesAsPrerequisite(id);
        long usageInSpec = courseRepository.countUsagesInSpecCourse(id);

        if (usageInNs > 0 || usageAsPre > 0 || usageInSpec > 0) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, CourseConstants.ERR_COURSE_IN_USE);
        }

        courseRepository.delete(course);
    }

    @Override
    @Transactional
    public CourseDetailResponse updatePrerequisites(UUID id, List<UUID> prerequisiteIds) {
        Course course = courseRepository.findDetailById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, CourseConstants.ERR_COURSE_NOT_FOUND));

        Set<Course> targetPrerequisites = new HashSet<>();
        for (UUID prereqId : prerequisiteIds) {
            Course prereq = courseRepository.findDetailById(prereqId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Prerequisite " + CourseConstants.ERR_COURSE_NOT_FOUND));
            
            // Cycle detection: Can prereq reach course?
            if (hasPath(prereq, course, new HashSet<>())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, CourseConstants.ERR_CIRCULAR_DEPENDENCY);
            }
            targetPrerequisites.add(prereq);
        }

        course.setPrerequisites(targetPrerequisites);
        course = courseRepository.save(course);
        return mapToDetailResponse(course);
    }

    private boolean hasPath(Course start, Course target, Set<UUID> visited) {
        if (start.getId().equals(target.getId())) {
            return true;
        }
        if (visited.contains(start.getId())) {
            return false;
        }
        visited.add(start.getId());

        if (start.getPrerequisites() != null) {
            for (Course pre : start.getPrerequisites()) {
                if (hasPath(pre, target, visited)) {
                    return true;
                }
            }
        }
        return false;
    }

    @Override
    @Transactional
    public LearningResourceResponse uploadResource(UUID courseId, String title, ResourceType type, MultipartFile file, String linkUrl) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, CourseConstants.ERR_COURSE_NOT_FOUND));

        String finalUrl = linkUrl;

        if (type == ResourceType.DOCS || type == ResourceType.EXERCISE) {
            if (file == null || file.isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File is required for DOCS and EXERCISE");
            }
            
            String fileName = file.getOriginalFilename();
            if (fileName == null || !fileName.matches("(?i).*\\.(zip|rar|pdf|doc|docx|xls|xlsx)$")) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, CourseConstants.ERR_INVALID_FILE_FORMAT);
            }

            try {
                Map params = ObjectUtils.asMap(
                        "resource_type", "raw",
                        "folder", "learning_resources",
                        "use_filename", true,
                        "unique_filename", true
                );
                Map uploadResult = cloudinary.uploader().upload(file.getBytes(), params);
                finalUrl = uploadResult.get("secure_url").toString();
            } catch (IOException e) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, CourseConstants.ERR_CLOUDINARY_UPLOAD, e);
            }
        } else if (type == ResourceType.LINK || type == ResourceType.ARTICLE) {
            if (linkUrl == null || linkUrl.trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "URL is required for LINK and ARTICLE");
            }
            if (!linkUrl.matches("^(https?|ftp)://[^\\s/$.?#].[^\\s]*$")) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid URL format");
            }
        }

        LearningResource resource = LearningResource.builder()
                .course(course)
                .title(title)
                .url(finalUrl)
                .resourceType(type)
                .displayOrder(0)
                .createdAt(java.time.LocalDateTime.now())
                .build();

        resource = learningResourceRepository.save(resource);
        return mapToLearningResourceResponse(resource);
    }

    private CourseResponse mapToResponse(Course course) {
        return CourseResponse.builder()
                .id(course.getId())
                .code(course.getCode())
                .name(course.getName())
                .credits(course.getCredits())
                .description(course.getDescription())
                .countsTowardGpa(course.getCountsTowardGpa())
                .isActive(course.getIsActive())
                .build();
    }

    private CourseDetailResponse mapToDetailResponse(Course course) {
        List<CourseResponse> prereqs = new ArrayList<>();
        if (course.getPrerequisites() != null) {
            prereqs = course.getPrerequisites().stream()
                    .map(this::mapToResponse)
                    .collect(Collectors.toList());
        }

        List<LearningResourceResponse> resources = new ArrayList<>();
        if (course.getLearningResources() != null) {
            resources = course.getLearningResources().stream()
                    .map(this::mapToLearningResourceResponse)
                    .sorted(Comparator.comparing(LearningResourceResponse::getDisplayOrder).thenComparing(LearningResourceResponse::getCreatedAt))
                    .collect(Collectors.toList());
        }

        return CourseDetailResponse.builder()
                .id(course.getId())
                .code(course.getCode())
                .name(course.getName())
                .credits(course.getCredits())
                .description(course.getDescription())
                .countsTowardGpa(course.getCountsTowardGpa())
                .isActive(course.getIsActive())
                .prerequisites(prereqs)
                .learningResources(resources)
                .build();
    }

    private LearningResourceResponse mapToLearningResourceResponse(LearningResource lr) {
        return LearningResourceResponse.builder()
                .id(lr.getId())
                .title(lr.getTitle())
                .url(lr.getUrl())
                .resourceType(lr.getResourceType())
                .displayOrder(lr.getDisplayOrder())
                .createdAt(lr.getCreatedAt())
                .build();
    }
}
