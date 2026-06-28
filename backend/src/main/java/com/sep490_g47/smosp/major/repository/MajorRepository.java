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
}
