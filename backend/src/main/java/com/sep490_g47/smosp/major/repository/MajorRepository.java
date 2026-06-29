package com.sep490_g47.smosp.major.repository;

import com.sep490_g47.smosp.major.entity.Major;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface MajorRepository extends JpaRepository<Major, UUID> {
    boolean existsByCode(String code);
    boolean existsByCodeAndIdNot(String code, UUID id);
    boolean existsByName(String name);
    boolean existsByNameAndIdNot(String name, UUID id);
    java.util.Optional<Major> findByCodeIgnoreCase(String code);
    java.util.List<Major> findByIsActiveTrueOrderByCodeAsc();
    java.util.List<Major> findAllByOrderByCodeAsc();

    @org.springframework.data.jpa.repository.Query("SELECT m FROM Major m WHERE LOWER(m.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(m.code) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    java.util.List<Major> searchByKeyword(@org.springframework.data.repository.query.Param("keyword") String keyword);

    @org.springframework.data.jpa.repository.Query("SELECT m FROM Major m WHERE m.isActive = true AND (LOWER(m.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(m.code) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    java.util.List<Major> searchByKeywordAndIsActiveTrue(@org.springframework.data.repository.query.Param("keyword") String keyword);
}
