package com.sep490_g47.smosp.specialization.controller;

import com.sep490_g47.smosp.specialization.dto.SpecializationRequest;
import com.sep490_g47.smosp.specialization.dto.SpecializationResponse;
import com.sep490_g47.smosp.specialization.dto.StatusUpdateRequest;
import com.sep490_g47.smosp.specialization.service.SpecializationImageService;
import com.sep490_g47.smosp.specialization.service.SpecializationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/specializations")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('CONTENT_MANAGER', 'ADMIN')")
public class CmSpecializationController {

    private final SpecializationService specializationService;
    private final SpecializationImageService specializationImageService;

    @PostMapping
    public ResponseEntity<SpecializationResponse> createSpecialization(@Valid @RequestBody SpecializationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(specializationService.createSpecialization(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SpecializationResponse> updateSpecialization(
            @PathVariable UUID id,
            @Valid @RequestBody SpecializationRequest request) {
        return ResponseEntity.ok(specializationService.updateSpecialization(id, request));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<SpecializationResponse> updateStatus(
            @PathVariable UUID id,
            @Valid @RequestBody StatusUpdateRequest request) {
        return ResponseEntity.ok(specializationService.updateStatus(id, request));
    }

    @PostMapping(value = "/{code}/image", consumes = "multipart/form-data")
    public ResponseEntity<Map<String, String>> uploadImage(
            @PathVariable String code,
            @RequestParam("file") MultipartFile file) {

        String contentType = file.getContentType();
        if (contentType == null || (!contentType.equals("image/png") && !contentType.equals("image/jpeg"))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only PNG and JPEG images are allowed");
        }

        String url = specializationImageService.uploadAndUpdateSpecializationImage(code, file);
        return ResponseEntity.ok(Map.of("url", url));
    }
}
