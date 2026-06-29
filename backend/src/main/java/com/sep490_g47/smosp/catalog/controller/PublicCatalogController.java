package com.sep490_g47.smosp.catalog.controller;

import com.sep490_g47.smosp.catalog.dto.CatalogSearchRequest;
import com.sep490_g47.smosp.catalog.dto.CatalogSearchResponse;
import com.sep490_g47.smosp.catalog.dto.NarrowSpecDetailResponse;
import com.sep490_g47.smosp.catalog.service.PublicCatalogService;
import com.sep490_g47.smosp.narrowspec.dto.NarrowSpecResponse;
import com.sep490_g47.smosp.specialization.dto.SpecializationResponse;
import com.sep490_g47.smosp.major.dto.MajorResponse;
import com.sep490_g47.smosp.major.service.MajorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class PublicCatalogController {

    private final PublicCatalogService publicCatalogService;
    private final MajorService majorService;

    @GetMapping("/majors")
    public ResponseEntity<List<MajorResponse>> getAllMajors() {
        return ResponseEntity.ok(majorService.getAllMajors());
    }

    @GetMapping("/majors/{id}/specializations")
    public ResponseEntity<List<SpecializationResponse>> getSpecializationsByMajor(@PathVariable UUID id) {
        return ResponseEntity.ok(publicCatalogService.getSpecializationsByMajor(id));
    }

    @GetMapping("/specializations/{id}/narrow-specs")
    public ResponseEntity<List<NarrowSpecResponse>> getNarrowSpecsBySpecialization(@PathVariable UUID id) {
        return ResponseEntity.ok(publicCatalogService.getNarrowSpecsBySpecialization(id));
    }

    @GetMapping("/narrow-specs/{id}")
    public ResponseEntity<NarrowSpecDetailResponse> getNarrowSpecDetail(@PathVariable UUID id) {
        return ResponseEntity.ok(publicCatalogService.getNarrowSpecDetail(id));
    }

    @PostMapping("/catalog/search")
    public ResponseEntity<CatalogSearchResponse> searchCatalog(@RequestBody CatalogSearchRequest request) {
        return ResponseEntity.ok(publicCatalogService.searchCatalog(request));
    }
}
