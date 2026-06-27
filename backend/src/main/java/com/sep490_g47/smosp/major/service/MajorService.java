package com.sep490_g47.smosp.major.service;

import com.sep490_g47.smosp.major.dto.MajorRequest;
import com.sep490_g47.smosp.major.dto.MajorResponse;
import com.sep490_g47.smosp.major.dto.StatusUpdateRequest;

import java.util.UUID;

public interface MajorService {
    MajorResponse createMajor(MajorRequest request);
    MajorResponse updateMajor(UUID id, MajorRequest request);
    MajorResponse updateMajorStatus(UUID id, StatusUpdateRequest request);
    java.util.List<MajorResponse> getAllMajors();
}
