package com.example.jobtracker.application.dto;

import java.time.Instant;
import java.util.UUID;

import com.example.jobtracker.common.enums.ApplicationStatus;

public record StatusHistoryResponse(
        UUID id,
        ApplicationStatus status,
        Instant changedAt,
        String note
) {
}
