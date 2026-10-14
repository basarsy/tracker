package com.example.jobtracker.stats;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.jobtracker.application.JobApplicationRepository;
import com.example.jobtracker.common.enums.ApplicationStatus;
import com.example.jobtracker.stats.dto.SummaryStats;

@ExtendWith(MockitoExtension.class)
class StatsServiceTest {

    @Mock
    private StatsQueryRepository queries;

    @Mock
    private JobApplicationRepository applicationRepository;

    @InjectMocks
    private StatsService statsService;

    @Test
    void summaryUsesHistoryBasedRates() {
        when(queries.countAll()).thenReturn(10L);
        when(queries.countNotWithdrawn()).thenReturn(9L);
        when(queries.countRespondedEligible()).thenReturn(6L);
        when(queries.countEverReached(List.of(
                ApplicationStatus.INTERVIEW_SCHEDULED,
                ApplicationStatus.INTERVIEWED
        ))).thenReturn(3L);
        when(queries.countEverReached(List.of(
                ApplicationStatus.OFFER,
                ApplicationStatus.ACCEPTED
        ))).thenReturn(1L);
        when(queries.countEverReached(List.of(ApplicationStatus.REJECTED))).thenReturn(2L);
        when(queries.countEverReached(List.of(ApplicationStatus.GHOSTED))).thenReturn(2L);
        when(queries.countActive()).thenReturn(5L);

        SummaryStats summary = statsService.summary();

        assertThat(summary.totalApplications()).isEqualTo(10);
        assertThat(summary.activeApplications()).isEqualTo(5);
        assertThat(summary.responseRate()).isEqualTo(6.0 / 9.0);
        assertThat(summary.interviewRate()).isEqualTo(0.3);
        assertThat(summary.offerRate()).isEqualTo(0.1);
        assertThat(summary.rejectionRate()).isEqualTo(0.2);
        assertThat(summary.ghostedCount()).isEqualTo(2);
    }

    @Test
    void responseTimeUsesAverageAndMedian() {
        when(queries.responseTimesDays()).thenReturn(List.of(2.0, 4.0, 10.0));

        var stats = statsService.responseTime();

        assertThat(stats.sampleSize()).isEqualTo(3);
        assertThat(stats.averageDays()).isEqualTo(5.3);
        assertThat(stats.medianDays()).isEqualTo(4.0);
    }
}
