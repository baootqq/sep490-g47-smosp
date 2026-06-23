package com.sep490_g47.smosp.account.service;

import com.sep490_g47.smosp.account.dto.ContentErrorReportRequest;
import com.sep490_g47.smosp.account.dto.ErrorReportResponse;
import com.sep490_g47.smosp.account.dto.UpdateContentErrorReportRequest;

import java.util.List;
import java.util.UUID;

public interface ContentErrorReportService {
    ErrorReportResponse createReport(UUID reporterId, ContentErrorReportRequest request);
    List<ErrorReportResponse> getMyReports(UUID reporterId);
    ErrorReportResponse getReportById(UUID reporterId, UUID reportId);
    ErrorReportResponse updateReport(UUID reporterId, UUID reportId, UpdateContentErrorReportRequest request);
    void deleteReport(UUID reporterId, UUID reportId);

    // CM methods
    List<ErrorReportResponse> getAllReports(com.sep490_g47.smosp.account.enums.ReportStatus status);
    ErrorReportResponse getReportByIdForCm(UUID reportId);
    ErrorReportResponse processReport(UUID reportId, com.sep490_g47.smosp.account.dto.ProcessReportRequest request);
}
