package com.sep490_g47.smosp.narrowspec.controller;

import com.sep490_g47.smosp.narrowspec.dto.NarrowSpecRequest;
import com.sep490_g47.smosp.narrowspec.dto.NarrowSpecResponse;
import com.sep490_g47.smosp.narrowspec.dto.PublishRequest;
import com.sep490_g47.smosp.narrowspec.service.NarrowSpecService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/narrow-specs")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('CONTENT_MANAGER', 'ADMIN')")
public class CmNarrowSpecController {

    private final NarrowSpecService narrowSpecService;

    @PostMapping
    public NarrowSpecResponse createNarrowSpec(@Valid @RequestBody NarrowSpecRequest request) {
        return narrowSpecService.createNarrowSpec(request);
    }

    @PutMapping("/{id}")
    public NarrowSpecResponse updateNarrowSpec(@PathVariable UUID id, @Valid @RequestBody NarrowSpecRequest request) {
        return narrowSpecService.updateNarrowSpec(id, request);
    }

    @PatchMapping("/{id}/publish")
    public NarrowSpecResponse publishNarrowSpec(@PathVariable UUID id, @Valid @RequestBody PublishRequest request) {
        return narrowSpecService.publishNarrowSpec(id, request);
    }
}
