package com.sep490_g47.smosp.specialization.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SpecializationResponse {

    private UUID id;
    private UUID majorId;
    private String code;
    private String name;
    private String description;
    private String imageUrl;
    private BigDecimal alphaBase;
    private Boolean isActive;

}
