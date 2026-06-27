package com.sep490_g47.smosp.specialization.service;

import com.sep490_g47.smosp.specialization.dto.SpecializationRequest;
import com.sep490_g47.smosp.specialization.dto.SpecializationResponse;
import com.sep490_g47.smosp.specialization.dto.StatusUpdateRequest;

import java.util.UUID;

public interface SpecializationService {
    SpecializationResponse createSpecialization(SpecializationRequest request);
    SpecializationResponse updateSpecialization(UUID id, SpecializationRequest request);
    SpecializationResponse updateStatus(UUID id, StatusUpdateRequest request);
}
