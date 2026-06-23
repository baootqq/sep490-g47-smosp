package com.sep490_g47.smosp.account.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateContentErrorReportRequest {

    @NotBlank(message = "Description cannot be empty")
    private String description;
}
