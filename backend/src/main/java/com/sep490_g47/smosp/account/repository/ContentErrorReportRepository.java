package com.sep490_g47.smosp.account.repository;

import com.sep490_g47.smosp.account.entity.ContentErrorReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ContentErrorReportRepository extends JpaRepository<ContentErrorReport, UUID> {
    List<ContentErrorReport> findByReporterIdOrderByCreatedAtDesc(UUID reporterId);
}
