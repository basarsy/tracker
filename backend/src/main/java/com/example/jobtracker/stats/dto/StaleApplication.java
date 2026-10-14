package com.example.jobtracker.stats.dto;

import java.time.LocalDate;
import java.util.UUID;

public record StaleApplication(
        UUID id,
        String companyName,
        String positionTitle,
        LocalDate appliedDate,
        long daysSinceApplied
) {
}
