package com.sep490_g47.smosp.narrowspec.service.impl;

import com.sep490_g47.smosp.narrowspec.dto.NarrowSpecRequest;
import com.sep490_g47.smosp.narrowspec.dto.NarrowSpecResponse;
import com.sep490_g47.smosp.narrowspec.dto.PublishRequest;
import com.sep490_g47.smosp.narrowspec.entity.NarrowSpecialization;
import com.sep490_g47.smosp.narrowspec.repository.NarrowSpecRepository;
import com.sep490_g47.smosp.narrowspec.service.NarrowSpecService;
import com.sep490_g47.smosp.narrowspec.util.NarrowSpecConstants;
import com.sep490_g47.smosp.specialization.entity.Specialization;
import com.sep490_g47.smosp.specialization.repository.SpecializationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NarrowSpecServiceImpl implements NarrowSpecService {

    private final NarrowSpecRepository narrowSpecRepository;
    private final SpecializationRepository specializationRepository;

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
