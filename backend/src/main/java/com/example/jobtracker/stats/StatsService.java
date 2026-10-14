package com.example.jobtracker.stats;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.jobtracker.application.JobApplication;
import com.example.jobtracker.application.JobApplicationRepository;
import com.example.jobtracker.common.enums.ApplicationStatus;
import com.example.jobtracker.stats.dto.FunnelStats;
import com.example.jobtracker.stats.dto.GroupStats;
import com.example.jobtracker.stats.dto.ResponseTimeStats;
import com.example.jobtracker.stats.dto.StaleApplication;
import com.example.jobtracker.stats.dto.SummaryStats;
import com.example.jobtracker.stats.dto.WeeklyCount;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StatsService {

    private final StatsQueryRepository queries;
    private final JobApplicationRepository applicationRepository;

    public SummaryStats summary() {
        long total = queries.countAll();
        long eligible = queries.countNotWithdrawn();
        long responded = queries.countRespondedEligible();
        long interviewed = queries.countEverReached(List.of(
                ApplicationStatus.INTERVIEW_SCHEDULED,
                ApplicationStatus.INTERVIEWED
        ));
        long offers = queries.countEverReached(List.of(
                ApplicationStatus.OFFER,
                ApplicationStatus.ACCEPTED
        ));
        long rejected = queries.countEverReached(List.of(ApplicationStatus.REJECTED));
        long ghosted = queries.countEverReached(List.of(ApplicationStatus.GHOSTED));
        return new SummaryStats(
                total,
                queries.countActive(),
                StatsCalculator.rate(responded, eligible),
                StatsCalculator.rate(interviewed, total),
                StatsCalculator.rate(offers, total),
                StatsCalculator.rate(rejected, total),
                ghosted
        );
    }

    public ResponseTimeStats responseTime() {
        List<Double> days = queries.responseTimesDays();
        return new ResponseTimeStats(
                round(StatsCalculator.average(days)),
                round(StatsCalculator.median(days)),
                days.size()
        );
    }

    public List<GroupStats> bySource() {
        return toGroupStats(queries.groupedBy(StatsQueryRepository.GroupByField.APPLICATION_SOURCE));
    }

    public List<GroupStats> byWorkModel() {
        return toGroupStats(queries.groupedBy(StatsQueryRepository.GroupByField.WORK_MODEL));
    }

    public List<GroupStats> byEmploymentType() {
        return toGroupStats(queries.groupedBy(StatsQueryRepository.GroupByField.EMPLOYMENT_TYPE));
    }

    public List<WeeklyCount> weekly() {
        LocalDate today = LocalDate.now();
        LocalDate from = today.minusWeeks(11).with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        Map<LocalDate, Long> counted = new HashMap<>();
        for (Object[] row : queries.weeklyCounts(from)) {
            LocalDate week = toLocalDate(row[0]);
            counted.put(week, ((Number) row[1]).longValue());
        }
        List<WeeklyCount> result = new ArrayList<>();
        LocalDate cursor = from;
        LocalDate last = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        while (!cursor.isAfter(last)) {
            result.add(new WeeklyCount(cursor, counted.getOrDefault(cursor, 0L)));
            cursor = cursor.plusWeeks(1);
        }
        return result;
    }

    public FunnelStats funnel() {
        return new FunnelStats(
                queries.countAll(),
                queries.countEverReached(StatsQueryRepository.RESPONDED_OR_LATER),
                queries.countEverReached(StatsQueryRepository.INTERVIEW_OR_LATER),
                queries.countEverReached(List.of(ApplicationStatus.OFFER, ApplicationStatus.ACCEPTED))
        );
    }

    public List<StaleApplication> stale(int days) {
        LocalDate cutoff = LocalDate.now().minusDays(days);
        return applicationRepository
                .findByCurrentStatusAndAppliedDateLessThanEqual(ApplicationStatus.APPLIED, cutoff)
                .stream()
                .map(this::toStale)
                .toList();
    }

    private StaleApplication toStale(JobApplication app) {
        return new StaleApplication(
                app.getId(),
                app.getCompanyName(),
                app.getPositionTitle(),
                app.getAppliedDate(),
                ChronoUnit.DAYS.between(app.getAppliedDate(), LocalDate.now())
        );
    }

    private List<GroupStats> toGroupStats(List<Object[]> rows) {
        return rows.stream()
                .map(row -> {
                    long total = ((Number) row[1]).longValue();
                    long responded = ((Number) row[2]).longValue();
                    long interviewed = ((Number) row[3]).longValue();
                    return new GroupStats(
                            String.valueOf(row[0]),
                            total,
                            StatsCalculator.rate(responded, total),
                            StatsCalculator.rate(interviewed, total)
                    );
                })
                .toList();
    }

    private LocalDate toLocalDate(Object value) {
        if (value instanceof LocalDate date) {
            return date;
        }
        if (value instanceof java.sql.Date date) {
            return date.toLocalDate();
        }
        return LocalDate.parse(value.toString().substring(0, 10));
    }

    private double round(double value) {
        return Math.round(value * 10.0) / 10.0;
    }
}
