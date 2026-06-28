package com.sep490_g47.smosp.catalog.dto;

import com.sep490_g47.smosp.major.dto.MajorResponse;
import com.sep490_g47.smosp.narrowspec.dto.NarrowSpecResponse;
import com.sep490_g47.smosp.specialization.dto.SpecializationResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CatalogSearchResponse {
    private List<MajorResponse> majors;
    private List<SpecializationResponse> specializations;
    private List<NarrowSpecResponse> narrowSpecs;
}
