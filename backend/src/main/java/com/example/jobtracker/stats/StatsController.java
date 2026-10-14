package com.example.jobtracker.stats;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.jobtracker.stats.dto.FunnelStats;
import com.example.jobtracker.stats.dto.GroupStats;
import com.example.jobtracker.stats.dto.ResponseTimeStats;
import com.example.jobtracker.stats.dto.StaleApplication;
import com.example.jobtracker.stats.dto.SummaryStats;
import com.example.jobtracker.stats.dto.WeeklyCount;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
public class StatsController {

    private final StatsService statsService;

    @GetMapping("/summary")
    public SummaryStats summary() {
        return statsService.summary();
    }

    @GetMapping("/response-time")
    public ResponseTimeStats responseTime() {
        return statsService.responseTime();
    }

    @GetMapping("/by-source")
    public List<GroupStats> bySource() {
        return statsService.bySource();
    }

    @GetMapping("/by-work-model")
    public List<GroupStats> byWorkModel() {
        return statsService.byWorkModel();
    }

    @GetMapping("/by-employment-type")
    public List<GroupStats> byEmploymentType() {
        return statsService.byEmploymentType();
    }

    @GetMapping("/weekly")
    public List<WeeklyCount> weekly() {
        return statsService.weekly();
    }

    @GetMapping("/funnel")
    public FunnelStats funnel() {
        return statsService.funnel();
    }

    @GetMapping("/stale")
    public List<StaleApplication> stale(@RequestParam(defaultValue = "14") int days) {
        return statsService.stale(days);
    }
}
