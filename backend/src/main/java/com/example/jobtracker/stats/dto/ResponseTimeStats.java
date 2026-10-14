package com.example.jobtracker.stats.dto;

public record ResponseTimeStats(double averageDays, double medianDays, long sampleSize) {
}
