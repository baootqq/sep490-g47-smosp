package com.sep490_g47.smosp.account.entity;

import com.sep490_g47.smosp.account.enums.ReportEntityType;
import com.sep490_g47.smosp.account.enums.ReportStatus;
import com.sep490_g47.smosp.auth.entity.UserAccount;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "content_error_report")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class ContentErrorReport {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reporter_id", nullable = false)
    private UserAccount reporter;

    @Enumerated(EnumType.STRING)
    @Column(name = "entity_type", nullable = false, length = 50)
    private ReportEntityType entityType;

    @Column(name = "entity_id", nullable = false)
    private UUID entityId;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private ReportStatus status = ReportStatus.PENDING;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "processing_note", columnDefinition = "TEXT")
    private String processingNote;
}
