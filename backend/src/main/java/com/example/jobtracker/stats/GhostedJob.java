package com.example.jobtracker.stats;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.example.jobtracker.application.JobApplication;
import com.example.jobtracker.application.JobApplicationRepository;
import com.example.jobtracker.common.enums.ApplicationStatus;
import com.example.jobtracker.statushistory.StatusHistory;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class GhostedJob {

    private final JobApplicationRepository applicationRepository;

    @Value("${app.ghosted-after-days:30}")
    private int ghostedAfterDays;

    @Scheduled(cron = "0 0 3 * * *")
    @Transactional
    public void markStaleApplicationsGhosted() {
        LocalDate cutoff = LocalDate.now().minusDays(ghostedAfterDays);
        List<JobApplication> stale = applicationRepository
                .findByCurrentStatusAndAppliedDateLessThanEqual(ApplicationStatus.APPLIED, cutoff);
        Instant now = Instant.now();
        for (JobApplication application : stale) {
            application.addStatus(StatusHistory.of(
                    application,
                    ApplicationStatus.GHOSTED,
                    now,
                    "Auto-marked as ghosted"
            ));
        }
        if (!stale.isEmpty()) {
            log.info("Auto-marked {} applications as GHOSTED after {} days", stale.size(), ghostedAfterDays);
        }
    }
}
