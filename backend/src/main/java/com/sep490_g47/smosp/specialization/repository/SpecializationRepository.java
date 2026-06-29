package com.sep490_g47.smosp.specialization.repository;

import com.sep490_g47.smosp.specialization.entity.Specialization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface SpecializationRepository extends JpaRepository<Specialization, UUID> {
    boolean existsByCode(String code);
    boolean existsByNameAndMajorId(String name, UUID majorId);
    long countByMajorId(UUID majorId);
    Optional<Specialization> findByCode(String code);

    java.util.List<Specialization> findByMajorId(UUID majorId);
    java.util.List<Specialization> findByMajorIdAndIsActiveTrue(UUID majorId);

    @org.springframework.data.jpa.repository.Query("SELECT s FROM Specialization s WHERE LOWER(s.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(s.code) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    java.util.List<Specialization> searchByKeyword(@org.springframework.data.repository.query.Param("keyword") String keyword);

    @org.springframework.data.jpa.repository.Query("SELECT s FROM Specialization s WHERE s.isActive = true AND (LOWER(s.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(s.code) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    java.util.List<Specialization> searchByKeywordAndIsActiveTrue(@org.springframework.data.repository.query.Param("keyword") String keyword);
}
