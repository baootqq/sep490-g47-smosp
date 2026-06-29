package com.sep490_g47.smosp.course.repository;

import com.sep490_g47.smosp.course.entity.Course;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CourseRepository extends JpaRepository<Course, UUID> {
    boolean existsByCode(String code);
    boolean existsByCodeAndIdNot(String code, UUID id);

    @EntityGraph(attributePaths = {"learningResources", "prerequisites"})
    Optional<Course> findDetailById(UUID id);

    @Query("SELECT c FROM Course c WHERE " +
           "(:code IS NULL OR LOWER(c.code) LIKE LOWER(CONCAT('%', CAST(:code AS string), '%'))) AND " +
           "(:name IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', CAST(:name AS string), '%'))) AND " +
           "(:isActive IS NULL OR c.isActive = :isActive)")
    Page<Course> findCoursesWithFilters(
            @Param("code") String code, 
            @Param("name") String name, 
            @Param("isActive") Boolean isActive, 
            Pageable pageable);

    @Query(value = "SELECT COUNT(*) FROM ns_course WHERE course_id = :courseId", nativeQuery = true)
    long countUsagesInNarrowSpec(@Param("courseId") UUID courseId);

    @Query(value = "SELECT COUNT(*) FROM course_prerequisite WHERE prerequisite_id = :courseId", nativeQuery = true)
    long countUsagesAsPrerequisite(@Param("courseId") UUID courseId);

    @Query(value = "SELECT COUNT(*) FROM spec_course WHERE course_id = :courseId", nativeQuery = true)
    long countUsagesInSpecCourse(@Param("courseId") UUID courseId);
}
