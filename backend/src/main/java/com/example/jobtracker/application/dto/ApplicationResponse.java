package com.example.jobtracker.application.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

import com.example.jobtracker.common.enums.ApplicationSource;
import com.example.jobtracker.common.enums.ApplicationStatus;
import com.example.jobtracker.common.enums.EmploymentType;
import com.example.jobtracker.common.enums.WorkModel;

public record ApplicationResponse(
        UUID id,
        String companyName,
        String positionTitle,
        WorkModel workModel,
        EmploymentType employmentType,
        String location,
        String jobPostingUrl,
        ApplicationSource applicationSource,
        LocalDate appliedDate,
        ApplicationStatus currentStatus,
        BigDecimal salaryMin,
        BigDecimal salaryMax,
        String salaryCurrency,
        String cvVersion,
        String contactName,
        String contactEmail,
        String notes,
        Instant createdAt,
        Instant updatedAt,
        long daysSinceApplied
) {
}
