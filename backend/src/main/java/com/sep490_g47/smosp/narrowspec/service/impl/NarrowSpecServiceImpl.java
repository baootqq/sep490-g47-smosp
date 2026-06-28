package com.sep490_g47.smosp.narrowspec.service.impl;

import com.sep490_g47.smosp.narrowspec.dto.NarrowSpecRequest;
import com.sep490_g47.smosp.narrowspec.dto.NarrowSpecResponse;
import com.sep490_g47.smosp.narrowspec.dto.NsCourseRequest;
import com.sep490_g47.smosp.narrowspec.dto.NsCourseResponse;
import com.sep490_g47.smosp.narrowspec.dto.PublishRequest;
import com.sep490_g47.smosp.narrowspec.entity.NarrowSpecialization;
import com.sep490_g47.smosp.narrowspec.entity.NsCourse;
import com.sep490_g47.smosp.narrowspec.repository.NarrowSpecRepository;
import com.sep490_g47.smosp.narrowspec.repository.NsCourseRepository;
import com.sep490_g47.smosp.narrowspec.service.NarrowSpecService;
import com.sep490_g47.smosp.narrowspec.util.NarrowSpecConstants;
import com.sep490_g47.smosp.specialization.entity.Specialization;
import com.sep490_g47.smosp.specialization.repository.SpecializationRepository;
import com.sep490_g47.smosp.specialization.entity.SpecCourse;
import com.sep490_g47.smosp.specialization.repository.SpecCourseRepository;
import com.sep490_g47.smosp.course.entity.Course;
import com.sep490_g47.smosp.course.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NarrowSpecServiceImpl implements NarrowSpecService {

    private final NarrowSpecRepository narrowSpecRepository;
    private final SpecializationRepository specializationRepository;
    private final NsCourseRepository nsCourseRepository;
    private final CourseRepository courseRepository;
    private final SpecCourseRepository specCourseRepository;

    @Override
    @Transactional
    public NarrowSpecResponse createNarrowSpec(NarrowSpecRequest request) {
        if (narrowSpecRepository.existsByCode(request.getCode())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, NarrowSpecConstants.ERROR_CODE_UNIQUE);
        }

        Specialization specialization = specializationRepository.findById(request.getSpecializationId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, NarrowSpecConstants.ERROR_SPEC_NOT_FOUND));

        long currentCount = narrowSpecRepository.countBySpecializationId(specialization.getId());
        if (currentCount >= NarrowSpecConstants.MAX_NARROW_SPECS_PER_SPEC) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, NarrowSpecConstants.ERROR_MAX_LIMIT_REACHED);
        }

        NarrowSpecialization narrowSpec = NarrowSpecialization.builder()
                .specialization(specialization)
                .code(request.getCode())
                .name(request.getName())
                .description(request.getDescription())
                .isPublished(false)
                .publishedAt(null)
                .build();

        NarrowSpecialization saved = narrowSpecRepository.save(narrowSpec);

        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public NarrowSpecResponse updateNarrowSpec(UUID id, NarrowSpecRequest request) {
        NarrowSpecialization narrowSpec = narrowSpecRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, NarrowSpecConstants.ERROR_NARROW_SPEC_NOT_FOUND));

        if (narrowSpecRepository.existsByCodeAndIdNot(request.getCode(), id)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, NarrowSpecConstants.ERROR_CODE_UNIQUE);
        }

        if (!narrowSpec.getSpecialization().getId().equals(request.getSpecializationId())) {
            Specialization specialization = specializationRepository.findById(request.getSpecializationId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, NarrowSpecConstants.ERROR_SPEC_NOT_FOUND));
            
            // Check limit if changing specialization
            long currentCount = narrowSpecRepository.countBySpecializationId(specialization.getId());
            if (currentCount >= NarrowSpecConstants.MAX_NARROW_SPECS_PER_SPEC) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, NarrowSpecConstants.ERROR_MAX_LIMIT_REACHED);
            }
            narrowSpec.setSpecialization(specialization);
        }

        narrowSpec.setCode(request.getCode());
        narrowSpec.setName(request.getName());
        narrowSpec.setDescription(request.getDescription());

        NarrowSpecialization updated = narrowSpecRepository.save(narrowSpec);

        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public NarrowSpecResponse publishNarrowSpec(UUID id, PublishRequest request) {
        NarrowSpecialization narrowSpec = narrowSpecRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, NarrowSpecConstants.ERROR_NARROW_SPEC_NOT_FOUND));

        if (request.getIsPublished()) {
            if (!narrowSpec.getIsPublished()) {
                narrowSpec.setIsPublished(true);
                narrowSpec.setPublishedAt(LocalDateTime.now());
                // TODO: Implement BV-17, BV-18, BV-19 checks (validate course count and terms) before full publish.
            }
        } else {
            if (narrowSpec.getIsPublished()) {
                narrowSpec.setIsPublished(false);
                // TODO: Implement BR-25: Notify students with roadmaps cloned from this NS.
            }
        }

        NarrowSpecialization updated = narrowSpecRepository.save(narrowSpec);
        return mapToResponse(updated);
    }

    @Override
    public List<NsCourseResponse> getNarrowSpecCourses(UUID narrowSpecId) {
        if (!narrowSpecRepository.existsById(narrowSpecId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, NarrowSpecConstants.ERROR_NARROW_SPEC_NOT_FOUND);
        }
        return nsCourseRepository.findByNarrowSpecId(narrowSpecId).stream()
                .map(this::mapToNsCourseResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public List<NsCourseResponse> updateNarrowSpecCourses(UUID narrowSpecId, List<NsCourseRequest> requests) {
        NarrowSpecialization narrowSpec = narrowSpecRepository.findById(narrowSpecId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, NarrowSpecConstants.ERROR_NARROW_SPEC_NOT_FOUND));

        List<UUID> incomingCourseIds = requests.stream().map(NsCourseRequest::getCourseId).collect(Collectors.toList());
        if (!incomingCourseIds.isEmpty()) {
            List<SpecCourse> overlappingCourses = specCourseRepository.findBySpecializationIdAndCourseIdIn(narrowSpec.getSpecialization().getId(), incomingCourseIds);
            if (!overlappingCourses.isEmpty()) {
                String overlappingCode = overlappingCourses.get(0).getCourse().getCode();
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, 
                    "Conflict: Course " + overlappingCode + " is already defined as a Core/General course in the parent Specialization and cannot be added as a Narrow Specialization course.");
            }
        }

        nsCourseRepository.deleteByNarrowSpecId(narrowSpecId);

        List<NsCourse> nsCourses = requests.stream().map(req -> {
            Course course = courseRepository.findById(req.getCourseId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found with id: " + req.getCourseId()));

            return NsCourse.builder()
                    .narrowSpec(narrowSpec)
                    .course(course)
                    .termOrder(req.getTermOrder())
                    .build();
        }).collect(Collectors.toList());

        List<NsCourse> savedCourses = nsCourseRepository.saveAll(nsCourses);
        return savedCourses.stream().map(this::mapToNsCourseResponse).collect(Collectors.toList());
    }

    private NsCourseResponse mapToNsCourseResponse(NsCourse nsCourse) {
        return NsCourseResponse.builder()
                .id(nsCourse.getId())
                .courseId(nsCourse.getCourse().getId())
                .courseCode(nsCourse.getCourse().getCode())
                .courseName(nsCourse.getCourse().getName())
                .termOrder(nsCourse.getTermOrder())
                .build();
    }

    private NarrowSpecResponse mapToResponse(NarrowSpecialization entity) {
        return NarrowSpecResponse.builder()
                .id(entity.getId())
                .specializationId(entity.getSpecialization().getId())
                .code(entity.getCode())
                .name(entity.getName())
                .description(entity.getDescription())
                .isPublished(entity.getIsPublished())
                .publishedAt(entity.getPublishedAt())
                .build();
    }
}
