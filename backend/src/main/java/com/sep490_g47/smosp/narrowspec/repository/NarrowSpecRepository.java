package com.sep490_g47.smosp.narrowspec.repository;

import com.sep490_g47.smosp.narrowspec.entity.NarrowSpecialization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface NarrowSpecRepository extends JpaRepository<NarrowSpecialization, UUID> {
    boolean existsBySpecializationIdAndIsPublishedTrue(UUID specializationId);
    boolean existsBySpecialization_Major_IdAndIsPublishedTrue(UUID majorId);
    long countBySpecializationId(UUID specializationId);
    boolean existsByCode(String code);
    boolean existsByCodeAndIdNot(String code, UUID id);
}
