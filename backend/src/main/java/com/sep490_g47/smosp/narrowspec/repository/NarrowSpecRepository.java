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
    java.util.List<NarrowSpecialization> findBySpecializationId(UUID specializationId);
    java.util.List<NarrowSpecialization> findBySpecializationIdAndIsPublishedTrue(UUID specializationId);

    @org.springframework.data.jpa.repository.Query("SELECT n FROM NarrowSpecialization n WHERE LOWER(n.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(n.code) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    java.util.List<NarrowSpecialization> searchByKeyword(@org.springframework.data.repository.query.Param("keyword") String keyword);

    @org.springframework.data.jpa.repository.Query("SELECT n FROM NarrowSpecialization n WHERE n.isPublished = true AND (LOWER(n.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(n.code) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    java.util.List<NarrowSpecialization> searchByKeywordAndIsPublishedTrue(@org.springframework.data.repository.query.Param("keyword") String keyword);
}
