package com.example.jobtracker.application.interview;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.jobtracker.application.ApplicationService;
import com.example.jobtracker.application.dto.InterviewResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/interviews")
@RequiredArgsConstructor
public class InterviewController {

    private final ApplicationService applicationService;

    @GetMapping("/upcoming")
    public List<InterviewResponse> upcoming() {
        return applicationService.upcomingInterviews();
    }
}
