package com.example.jobtracker.stats.dto;

import java.time.LocalDate;

public record WeeklyCount(LocalDate weekStart, long count) {
}
