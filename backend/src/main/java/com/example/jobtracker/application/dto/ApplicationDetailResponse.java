package com.example.jobtracker.application.dto;

import java.util.List;

public record ApplicationDetailResponse(
        ApplicationResponse application,
        List<StatusHistoryResponse> statusHistory,
        List<InterviewResponse> interviews
) {
}
