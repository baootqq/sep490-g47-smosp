package com.sep490_g47.smosp.catalog.service;

import com.sep490_g47.smosp.catalog.dto.CatalogSearchRequest;
import com.sep490_g47.smosp.catalog.dto.CatalogSearchResponse;
import com.sep490_g47.smosp.catalog.dto.NarrowSpecDetailResponse;
import com.sep490_g47.smosp.narrowspec.dto.NarrowSpecResponse;
import com.sep490_g47.smosp.specialization.dto.SpecializationResponse;

import java.util.List;
import java.util.UUID;

public interface PublicCatalogService {
    List<SpecializationResponse> getSpecializationsByMajor(UUID majorId);
    List<NarrowSpecResponse> getNarrowSpecsBySpecialization(UUID specializationId);
    NarrowSpecDetailResponse getNarrowSpecDetail(UUID id);
    CatalogSearchResponse searchCatalog(CatalogSearchRequest request);
}
