package com.example.jobtracker.application;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.example.jobtracker.common.enums.ApplicationSource;
import com.example.jobtracker.common.enums.ApplicationStatus;
import com.example.jobtracker.common.enums.EmploymentType;
import com.example.jobtracker.common.enums.WorkModel;
import com.example.jobtracker.statushistory.StatusHistory;
import com.example.jobtracker.application.interview.Interview;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "job_application")
@Getter
@Setter
@NoArgsConstructor
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "company_name", nullable = false)
    private String companyName;

    @Column(name = "position_title", nullable = false)
    private String positionTitle;

    @Enumerated(EnumType.STRING)
    @Column(name = "work_model", nullable = false, length = 32)
    private WorkModel workModel;

    @Enumerated(EnumType.STRING)
    @Column(name = "employment_type", nullable = false, length = 32)
    private EmploymentType employmentType;

    private String location;

    @Column(name = "job_posting_url", length = 1024)
    private String jobPostingUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "application_source", nullable = false, length = 32)
    private ApplicationSource applicationSource;

    @Column(name = "applied_date", nullable = false)
    private LocalDate appliedDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "current_status", nullable = false, length = 32)
    private ApplicationStatus currentStatus;

    @Column(name = "salary_min")
    private BigDecimal salaryMin;

    @Column(name = "salary_max")
    private BigDecimal salaryMax;

    @Column(name = "salary_currency", length = 8)
    private String salaryCurrency;

    @Column(name = "cv_version", length = 128)
    private String cvVersion;

    @Column(name = "contact_name")
    private String contactName;

    @Column(name = "contact_email")
    private String contactEmail;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("changedAt ASC")
    private List<StatusHistory> statusHistory = new ArrayList<>();

    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("scheduledAt ASC")
    private List<Interview> interviews = new ArrayList<>();

    @PrePersist
    void onCreate() {
        Instant now = Instant.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = Instant.now();
    }

    public void addStatus(StatusHistory history) {
        statusHistory.add(history);
        history.setApplication(this);
        currentStatus = history.getStatus();
    }

    public void addInterview(Interview interview) {
        interviews.add(interview);
        interview.setApplication(this);
    }
}
