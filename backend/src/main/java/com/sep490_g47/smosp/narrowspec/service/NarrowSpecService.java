package com.sep490_g47.smosp.narrowspec.service;

import com.sep490_g47.smosp.narrowspec.dto.NarrowSpecRequest;
import com.sep490_g47.smosp.narrowspec.dto.NarrowSpecResponse;
import com.sep490_g47.smosp.narrowspec.dto.PublishRequest;

import java.util.UUID;

public interface NarrowSpecService {
    NarrowSpecResponse createNarrowSpec(NarrowSpecRequest request);
    NarrowSpecResponse updateNarrowSpec(UUID id, NarrowSpecRequest request);
    NarrowSpecResponse publishNarrowSpec(UUID id, PublishRequest request);
}
