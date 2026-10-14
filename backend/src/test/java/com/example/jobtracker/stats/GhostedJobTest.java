package com.example.jobtracker.stats;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import com.example.jobtracker.application.JobApplication;
import com.example.jobtracker.application.JobApplicationRepository;
import com.example.jobtracker.common.enums.ApplicationStatus;

@ExtendWith(MockitoExtension.class)
class GhostedJobTest {

    @Mock
    private JobApplicationRepository applicationRepository;

    @InjectMocks
    private GhostedJob ghostedJob;

    @Test
    void marksAppliedApplicationsAsGhostedAndKeepsHistory() {
        ReflectionTestUtils.setField(ghostedJob, "ghostedAfterDays", 30);
        JobApplication application = new JobApplication();
        application.setCurrentStatus(ApplicationStatus.APPLIED);
        application.setAppliedDate(LocalDate.now().minusDays(40));
        when(applicationRepository.findByCurrentStatusAndAppliedDateLessThanEqual(
                eq(ApplicationStatus.APPLIED), any(LocalDate.class)
        )).thenReturn(List.of(application));

        ghostedJob.markStaleApplicationsGhosted();

        assertThat(application.getCurrentStatus()).isEqualTo(ApplicationStatus.GHOSTED);
        assertThat(application.getStatusHistory()).hasSize(1);
        assertThat(application.getStatusHistory().getFirst().getNote()).isEqualTo("Auto-marked as ghosted");
    }
}
