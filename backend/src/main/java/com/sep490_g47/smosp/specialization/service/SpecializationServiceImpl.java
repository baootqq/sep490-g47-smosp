package com.sep490_g47.smosp.specialization.service;

import com.sep490_g47.smosp.major.entity.Major;
import com.sep490_g47.smosp.major.repository.MajorRepository;
import com.sep490_g47.smosp.specialization.dto.SpecializationRequest;
import com.sep490_g47.smosp.specialization.dto.SpecializationResponse;
import com.sep490_g47.smosp.specialization.dto.StatusUpdateRequest;
import com.sep490_g47.smosp.specialization.entity.Specialization;
import com.sep490_g47.smosp.narrowspec.repository.NarrowSpecRepository;
import com.sep490_g47.smosp.specialization.repository.SpecializationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SpecializationServiceImpl implements SpecializationService {

    private final SpecializationRepository specializationRepository;
    private final NarrowSpecRepository narrowSpecRepository;
    private final MajorRepository majorRepository;

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
