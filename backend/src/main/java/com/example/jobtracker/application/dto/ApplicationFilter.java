package com.example.jobtracker.application.dto;

import java.time.LocalDate;

import com.example.jobtracker.common.enums.ApplicationSource;
import com.example.jobtracker.common.enums.ApplicationStatus;
import com.example.jobtracker.common.enums.EmploymentType;
import com.example.jobtracker.common.enums.WorkModel;

public record ApplicationFilter(
        ApplicationStatus status,
        WorkModel workModel,
        EmploymentType employmentType,
        ApplicationSource source,
        String search,
        LocalDate appliedFrom,
        LocalDate appliedTo
) {
}
