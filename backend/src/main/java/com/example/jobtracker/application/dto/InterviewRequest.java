package com.example.jobtracker.application.dto;

import java.time.Instant;

import com.example.jobtracker.common.enums.InterviewType;

import jakarta.validation.constraints.NotNull;

public record InterviewRequest(
        @NotNull Instant scheduledAt,
        @NotNull InterviewType type,
        String notes
) {
}
