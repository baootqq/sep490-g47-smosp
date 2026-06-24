package com.sep490_g47.smosp.account.service;

import com.sep490_g47.smosp.account.dto.ContentErrorReportRequest;
import com.sep490_g47.smosp.account.dto.ErrorReportResponse;
import com.sep490_g47.smosp.account.dto.UpdateContentErrorReportRequest;
import com.sep490_g47.smosp.account.entity.ContentErrorReport;
import com.sep490_g47.smosp.account.enums.ReportStatus;
import com.sep490_g47.smosp.account.entity.Notification;
import com.sep490_g47.smosp.account.repository.ContentErrorReportRepository;
import com.sep490_g47.smosp.account.repository.NotificationRepository;
import com.sep490_g47.smosp.auth.entity.UserAccount;
import com.sep490_g47.smosp.auth.repository.UserAccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.ZoneId;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ContentErrorReportServiceImpl implements ContentErrorReportService {

    private final ContentErrorReportRepository repository;
    private final UserAccountRepository userRepository;
    private final NotificationRepository notificationRepository;

    @Override
    @Transactional
    public ErrorReportResponse createReport(UUID reporterId, ContentErrorReportRequest request) {
        UserAccount reporter = userRepository.findById(reporterId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        ContentErrorReport report = ContentErrorReport.builder()
                .reporter(reporter)
                .entityType(request.getEntityType())
                .entityId(request.getEntityId())
                .description(request.getDescription())
                .status(ReportStatus.PENDING)
                .build();

        report = repository.save(report);

        // TODO: Trigger a notification to Content Managers (AC-09-01)
        
        return mapToResponse(report);
    }

    @Override
    public List<ErrorReportResponse> getMyReports(UUID reporterId) {
        List<ContentErrorReport> reports = repository.findByReporterIdOrderByCreatedAtDesc(reporterId);
        return reports.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public ErrorReportResponse getReportById(UUID reporterId, UUID reportId) {
        ContentErrorReport report = getReportAndVerifyOwnership(reporterId, reportId);
        return mapToResponse(report);
    }

    @Override
    @Transactional
    public ErrorReportResponse updateReport(UUID reporterId, UUID reportId, UpdateContentErrorReportRequest request) {
        ContentErrorReport report = getReportAndVerifyOwnership(reporterId, reportId);

        if (report.getStatus() != ReportStatus.PENDING) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot update report that is not PENDING");
        }

        report.setDescription(request.getDescription());
        report = repository.save(report);

        return mapToResponse(report);
    }

    @Override
    @Transactional
    public void deleteReport(UUID reporterId, UUID reportId) {
        ContentErrorReport report = getReportAndVerifyOwnership(reporterId, reportId);

        if (report.getStatus() != ReportStatus.PENDING) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot delete report that is not PENDING");
        }

        repository.deleteById(reportId);
    }

    @Override
    public List<ErrorReportResponse> getAllReports(ReportStatus status) {
        List<ContentErrorReport> reports;
        if (status != null) {
            reports = repository.findByStatusOrderByCreatedAtDesc(status);
        } else {
            reports = repository.findAllByOrderByCreatedAtDesc();
        }
        return reports.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public ErrorReportResponse getReportByIdForCm(UUID reportId) {
        ContentErrorReport report = repository.findById(reportId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Report not found"));
        return mapToResponse(report);
    }

    @Override
    @Transactional
    public ErrorReportResponse processReport(UUID reportId, com.sep490_g47.smosp.account.dto.ProcessReportRequest request) {
        ContentErrorReport report = repository.findById(reportId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Report not found"));

        if (request.getStatus() == ReportStatus.PENDING) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Status must be RESOLVED or DISMISSED");
        }

        if (request.getStatus() == ReportStatus.DISMISSED && (request.getNote() == null || request.getNote().trim().isEmpty())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Processing note cannot be blank when dismissing a report");
        }

        report.setStatus(request.getStatus());
        report.setProcessingNote(request.getNote());
        report = repository.save(report);

        Notification notification = Notification.builder()
                .user(report.getReporter())
                .type("REPORT_STATUS_CHANGED")
                .title("Cập nhật trạng thái báo cáo")
                .body("Báo cáo của bạn về " + report.getEntityType() + " đã được chuyển sang trạng thái " + report.getStatus())
                .metadata(Map.of("reportId", report.getId().toString()))
                .isRead(false)
                .build();
        notificationRepository.save(notification);

        return mapToResponse(report);
    }

    private ContentErrorReport getReportAndVerifyOwnership(UUID reporterId, UUID reportId) {
        ContentErrorReport report = repository.findById(reportId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Report not found"));

        if (!report.getReporter().getId().equals(reporterId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not have permission to access this report");
        }

        return report;
    }

    private ErrorReportResponse mapToResponse(ContentErrorReport report) {
        return ErrorReportResponse.builder()
                .id(report.getId())
                .reporterId(report.getReporter().getId())
                .entityType(report.getEntityType())
                .entityId(report.getEntityId())
                .description(report.getDescription())
                .status(report.getStatus())
                .processingNote(report.getProcessingNote())
                .createdAt(report.getCreatedAt() != null ? report.getCreatedAt().atZone(ZoneId.systemDefault()).toInstant() : null)
                .build();
    }
}
