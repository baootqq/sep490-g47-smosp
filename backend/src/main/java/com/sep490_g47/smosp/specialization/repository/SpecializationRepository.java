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
}
