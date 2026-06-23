package com.sep490_g47.smosp.account.dto;

import com.sep490_g47.smosp.account.enums.ReportStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ProcessReportRequest {

    @NotNull(message = "Status cannot be null")
    private ReportStatus status;

    private String note;
}
