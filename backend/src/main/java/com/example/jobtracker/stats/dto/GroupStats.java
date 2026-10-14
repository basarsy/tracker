package com.example.jobtracker.stats.dto;

public record GroupStats(
        String key,
        long applications,
        double responseRate,
        double interviewRate
) {
}
