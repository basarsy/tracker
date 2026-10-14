package com.example.jobtracker.application.dto;

import java.time.Instant;
import java.util.UUID;

import com.example.jobtracker.common.enums.InterviewType;

public record InterviewResponse(
        UUID id,
        UUID applicationId,
        String companyName,
        String positionTitle,
        Instant scheduledAt,
        InterviewType type,
        String notes
) {
}
