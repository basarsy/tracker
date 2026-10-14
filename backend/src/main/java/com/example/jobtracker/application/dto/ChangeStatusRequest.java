package com.example.jobtracker.application.dto;

import java.time.Instant;

import com.example.jobtracker.common.enums.ApplicationStatus;

import jakarta.validation.constraints.NotNull;

public record ChangeStatusRequest(
        @NotNull ApplicationStatus status,
        Instant changedAt,
        String note
) {
}
