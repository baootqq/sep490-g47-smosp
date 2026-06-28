package com.sep490_g47.smosp.specialization.service;

import com.sep490_g47.smosp.major.entity.Major;
import com.sep490_g47.smosp.major.repository.MajorRepository;
import com.sep490_g47.smosp.specialization.dto.SpecCourseRequest;
import com.sep490_g47.smosp.specialization.dto.SpecCourseResponse;
import com.sep490_g47.smosp.specialization.dto.SpecializationRequest;
import com.sep490_g47.smosp.specialization.dto.SpecializationResponse;
import com.sep490_g47.smosp.specialization.dto.StatusUpdateRequest;
import com.sep490_g47.smosp.specialization.entity.SpecCourse;
import com.sep490_g47.smosp.specialization.entity.Specialization;
import com.sep490_g47.smosp.narrowspec.entity.NarrowSpecialization;
import com.sep490_g47.smosp.narrowspec.entity.NsCourse;
import com.sep490_g47.smosp.narrowspec.repository.NarrowSpecRepository;
import com.sep490_g47.smosp.narrowspec.repository.NsCourseRepository;
import com.sep490_g47.smosp.specialization.repository.SpecCourseRepository;
import com.sep490_g47.smosp.specialization.repository.SpecializationRepository;
import com.sep490_g47.smosp.course.entity.Course;
import com.sep490_g47.smosp.course.repository.CourseRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SpecializationServiceImpl implements SpecializationService {

    private final SpecializationRepository specializationRepository;
    private final NarrowSpecRepository narrowSpecRepository;
    private final MajorRepository majorRepository;
    private final SpecCourseRepository specCourseRepository;
    private final CourseRepository courseRepository;
    private final NsCourseRepository nsCourseRepository;

    @Override
    @Transactional
    public SpecializationResponse createSpecialization(SpecializationRequest request) {
        Major major = majorRepository.findById(request.getMajorId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Major not found"));

        if (specializationRepository.existsByCode(request.getCode())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Specialization code already exists");
        }

        if (specializationRepository.existsByNameAndMajorId(request.getName(), request.getMajorId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Specialization name already exists within this major");
        }

        if (specializationRepository.countByMajorId(request.getMajorId()) >= 10) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A Major can have a maximum of 10 Specializations");
        }

        Specialization specialization = Specialization.builder()
                .major(major)
                .code(request.getCode())
                .name(request.getName())
                .description(request.getDescription())
                .alphaBase(new BigDecimal("0.70"))
                .isActive(true)
                .build();

        specialization = specializationRepository.save(specialization);
        return mapToResponse(specialization);
    }

    @Override
    @Transactional
    public SpecializationResponse updateSpecialization(UUID id, SpecializationRequest request) {
        Specialization specialization = specializationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Specialization not found"));

        Major major = majorRepository.findById(request.getMajorId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Major not found"));

        if (!specialization.getCode().equals(request.getCode()) && specializationRepository.existsByCode(request.getCode())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Specialization code already exists");
        }

        if ((!specialization.getName().equals(request.getName()) || !specialization.getMajor().getId().equals(request.getMajorId()))
                && specializationRepository.existsByNameAndMajorId(request.getName(), request.getMajorId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Specialization name already exists within this major");
        }

        // Re-check count if major changed
        if (!specialization.getMajor().getId().equals(request.getMajorId())) {
            if (specializationRepository.countByMajorId(request.getMajorId()) >= 10) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The target Major already has a maximum of 10 Specializations");
            }
        }

        specialization.setMajor(major);
        specialization.setCode(request.getCode());
        specialization.setName(request.getName());
        specialization.setDescription(request.getDescription());

        specialization = specializationRepository.save(specialization);
        return mapToResponse(specialization);
    }

    @Override
    @Transactional
    public SpecializationResponse updateStatus(UUID id, StatusUpdateRequest request) {
        Specialization specialization = specializationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Specialization not found"));

        if (specialization.getIsActive().equals(request.getIsActive())) {
            return mapToResponse(specialization);
        }

        if (!request.getIsActive()) {
            boolean hasActiveChildren = narrowSpecRepository.existsBySpecializationIdAndIsPublishedTrue(id);
            if (hasActiveChildren) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot deactivate Specialization because it has active NarrowSpecializations");
            }
        }

        specialization.setIsActive(request.getIsActive());
        specialization = specializationRepository.save(specialization);
        return mapToResponse(specialization);
    }

    @Override
    public List<SpecCourseResponse> getSpecializationCourses(UUID specializationId) {
        if (!specializationRepository.existsById(specializationId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Specialization not found");
        }
        return specCourseRepository.findBySpecializationId(specializationId).stream()
                .map(this::mapToSpecCourseResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public List<SpecCourseResponse> updateSpecializationCourses(UUID specializationId, List<SpecCourseRequest> requests) {
        Specialization specialization = specializationRepository.findById(specializationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Specialization not found"));

        List<UUID> incomingCourseIds = requests.stream().map(SpecCourseRequest::getCourseId).collect(Collectors.toList());
        if (!incomingCourseIds.isEmpty()) {
            List<NarrowSpecialization> childNarrowSpecs = narrowSpecRepository.findBySpecializationId(specializationId);
            if (!childNarrowSpecs.isEmpty()) {
                List<UUID> narrowSpecIds = childNarrowSpecs.stream().map(NarrowSpecialization::getId).collect(Collectors.toList());
                List<NsCourse> overlappingCourses = nsCourseRepository.findByNarrowSpecIdInAndCourseIdIn(narrowSpecIds, incomingCourseIds);
                if (!overlappingCourses.isEmpty()) {
                    String overlappingCode = overlappingCourses.get(0).getCourse().getCode();
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, 
                        "Conflict: Course " + overlappingCode + " is already assigned to a child Narrow Specialization. Please remove it from the Narrow Specialization first before promoting it to a Core/General course.");
                }
            }
        }

        specCourseRepository.deleteBySpecializationId(specializationId);

        List<SpecCourse> specCourses = requests.stream().map(req -> {
            Course course = courseRepository.findById(req.getCourseId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found with id: " + req.getCourseId()));

            return SpecCourse.builder()
                    .specialization(specialization)
                    .course(course)
                    .termOrder(req.getTermOrder())
                    .courseType(req.getCourseType())
                    .build();
        }).collect(Collectors.toList());

        List<SpecCourse> savedCourses = specCourseRepository.saveAll(specCourses);
        return savedCourses.stream().map(this::mapToSpecCourseResponse).collect(Collectors.toList());
    }

    private SpecCourseResponse mapToSpecCourseResponse(SpecCourse specCourse) {
        return SpecCourseResponse.builder()
                .id(specCourse.getId())
                .courseId(specCourse.getCourse().getId())
                .courseCode(specCourse.getCourse().getCode())
                .courseName(specCourse.getCourse().getName())
                .termOrder(specCourse.getTermOrder())
                .courseType(specCourse.getCourseType())
                .build();
    }

    private SpecializationResponse mapToResponse(Specialization specialization) {
        return SpecializationResponse.builder()
                .id(specialization.getId())
                .majorId(specialization.getMajor().getId())
                .code(specialization.getCode())
                .name(specialization.getName())
                .description(specialization.getDescription())
                .imageUrl(specialization.getImageUrl())
                .alphaBase(specialization.getAlphaBase())
                .isActive(specialization.getIsActive())
                .build();
    }
}
