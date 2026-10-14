package com.example.jobtracker.application.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.example.jobtracker.common.enums.ApplicationSource;
import com.example.jobtracker.common.enums.EmploymentType;
import com.example.jobtracker.common.enums.WorkModel;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UpdateApplicationRequest(
        @NotBlank @Size(max = 255) String companyName,
        @NotBlank @Size(max = 255) String positionTitle,
        @NotNull WorkModel workModel,
        @NotNull EmploymentType employmentType,
        @Size(max = 255) String location,
        @Size(max = 1024) String jobPostingUrl,
        @NotNull ApplicationSource applicationSource,
        @NotNull LocalDate appliedDate,
        BigDecimal salaryMin,
        BigDecimal salaryMax,
        @Size(max = 8) String salaryCurrency,
        @Size(max = 128) String cvVersion,
        @Size(max = 255) String contactName,
        @Email @Size(max = 255) String contactEmail,
        String notes
) {
}
