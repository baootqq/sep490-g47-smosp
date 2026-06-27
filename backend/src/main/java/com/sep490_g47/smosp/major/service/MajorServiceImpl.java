package com.sep490_g47.smosp.major.service;

import com.sep490_g47.smosp.major.dto.MajorRequest;
import com.sep490_g47.smosp.major.dto.MajorResponse;
import com.sep490_g47.smosp.major.dto.StatusUpdateRequest;
import com.sep490_g47.smosp.major.entity.Major;
import com.sep490_g47.smosp.major.repository.MajorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.GrantedAuthority;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MajorServiceImpl implements MajorService {

    private final MajorRepository majorRepository;

    @Override
    @Transactional
    public MajorResponse createMajor(MajorRequest request) {
        if (majorRepository.existsByCode(request.getCode())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Major code already exists");
        }

        Major major = Major.builder()
                .code(request.getCode())
                .name(request.getName())
                .description(request.getDescription())
                .tuitionPerTerm(request.getTuitionPerTerm())
                .pricePerCredit(request.getPricePerCredit())
                .isActive(true)
                .build();
        
        if (request.getTuitionPerTerm() != null || request.getPricePerCredit() != null) {
            major.setTuitionUpdatedAt(LocalDateTime.now());
        }

        major = majorRepository.save(major);

        return mapToResponse(major);
    }

    @Override
    @Transactional
    public MajorResponse updateMajor(UUID id, MajorRequest request) {
        Major major = majorRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Major not found"));

        if (majorRepository.existsByCodeAndIdNot(request.getCode(), id)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Major code already exists for another record");
        }

        if (!Objects.equals(request.getTuitionPerTerm(), major.getTuitionPerTerm()) ||
            !Objects.equals(request.getPricePerCredit(), major.getPricePerCredit())) {
            major.setTuitionUpdatedAt(LocalDateTime.now());
        }

        major.setCode(request.getCode());
        major.setName(request.getName());
        major.setDescription(request.getDescription());
        major.setTuitionPerTerm(request.getTuitionPerTerm());
        major.setPricePerCredit(request.getPricePerCredit());

        major = majorRepository.save(major);

        return mapToResponse(major);
    }

    @Override
    @Transactional
    public MajorResponse updateMajorStatus(UUID id, StatusUpdateRequest request) {
        Major major = majorRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Major not found"));

        if (Objects.equals(major.getIsActive(), request.getIsActive())) {
            return mapToResponse(major);
        }

        major.setIsActive(request.getIsActive());
        major = majorRepository.save(major);

        return mapToResponse(major);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MajorResponse> getAllMajors() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean isStaff = false;

        if (authentication != null && authentication.isAuthenticated() && !authentication.getPrincipal().equals("anonymousUser")) {
            for (GrantedAuthority authority : authentication.getAuthorities()) {
                String role = authority.getAuthority();
                if ("ROLE_CONTENT_MANAGER".equals(role) || "ROLE_ADMIN".equals(role)) {
                    isStaff = true;
                    break;
                }
            }
        }

        List<Major> majors;
        if (isStaff) {
            majors = majorRepository.findAllByOrderByCodeAsc();
        } else {
            majors = majorRepository.findByIsActiveTrueOrderByCodeAsc();
        }

        return majors.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private MajorResponse mapToResponse(Major major) {
        return MajorResponse.builder()
                .id(major.getId())
                .code(major.getCode())
                .name(major.getName())
                .description(major.getDescription())
                .imageUrl(major.getImageUrl())
                .tuitionPerTerm(major.getTuitionPerTerm())
                .pricePerCredit(major.getPricePerCredit())
                .tuitionUpdatedAt(major.getTuitionUpdatedAt())
                .createdAt(major.getCreatedAt())
                .updatedAt(major.getUpdatedAt())
                .isActive(major.getIsActive())
                .build();
    }
}
