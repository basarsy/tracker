package com.example.jobtracker.stats;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Rate and response-time helpers. Kept pure so the definitions can be unit-tested
 * without a database.
 *
 * <p>Response rate = applications that ever reached any status other than APPLIED
 * and GHOSTED / total applications, excluding WITHDRAWN from the denominator.
 *
 * <p>Interview rate = applications that ever reached INTERVIEW_SCHEDULED or
 * INTERVIEWED / total applications.
 *
 * <p>Stats are derived from status_history (ever reached), not only current_status.
 */
public final class StatsCalculator {

    private StatsCalculator() {
    }

    public static double rate(long numerator, long denominator) {
        if (denominator <= 0) {
            return 0.0;
        }
        return (double) numerator / denominator;
    }

    public static double average(List<Double> values) {
        if (values == null || values.isEmpty()) {
            return 0.0;
        }
        return values.stream().mapToDouble(Double::doubleValue).average().orElse(0.0);
    }

    public static double median(List<Double> values) {
        if (values == null || values.isEmpty()) {
            return 0.0;
        }
        List<Double> sorted = new ArrayList<>(values);
        Collections.sort(sorted);
        int size = sorted.size();
        int mid = size / 2;
        if (size % 2 == 0) {
            return (sorted.get(mid - 1) + sorted.get(mid)) / 2.0;
        }
        return sorted.get(mid);
    }
}
