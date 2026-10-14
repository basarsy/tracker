package com.example.jobtracker.stats.dto;

public record SummaryStats(
        long totalApplications,
        long activeApplications,
        double responseRate,
        double interviewRate,
        double offerRate,
        double rejectionRate,
        long ghostedCount
) {
}
