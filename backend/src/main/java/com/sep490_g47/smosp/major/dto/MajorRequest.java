package com.sep490_g47.smosp.major.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class MajorRequest {
    @NotBlank(message = "Code is required")
    private String code;

    @NotBlank(message = "Name is required")
    private String name;

    private String description;
    private BigDecimal tuitionPerTerm;
    private BigDecimal pricePerCredit;
}
