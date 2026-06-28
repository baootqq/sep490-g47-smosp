package com.sep490_g47.smosp.narrowspec.dto;

import com.sep490_g47.smosp.narrowspec.util.NarrowSpecConstants;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PublishRequest {
    @NotNull(message = NarrowSpecConstants.VALIDATION_IS_PUBLISHED_REQUIRED)
    private Boolean isPublished;
}
