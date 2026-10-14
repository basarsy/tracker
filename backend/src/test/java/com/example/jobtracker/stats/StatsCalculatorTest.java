package com.example.jobtracker.stats;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import org.junit.jupiter.api.Test;

class StatsCalculatorTest {

    @Test
    void rateIsZeroWhenDenominatorIsZero() {
        assertThat(StatsCalculator.rate(3, 0)).isZero();
    }

    @Test
    void responseRateMatchesDocumentedDefinition() {
        long respondedOrFurther = 8;
        long totalExcludingWithdrawn = 10;
        assertThat(StatsCalculator.rate(respondedOrFurther, totalExcludingWithdrawn)).isEqualTo(0.8);
    }

    @Test
    void interviewRateUsesFullTotal() {
        assertThat(StatsCalculator.rate(2, 8)).isEqualTo(0.25);
    }

    @Test
    void medianHandlesOddAndEvenLists() {
        assertThat(StatsCalculator.median(List.of(1.0, 3.0, 2.0))).isEqualTo(2.0);
        assertThat(StatsCalculator.median(List.of(1.0, 2.0, 3.0, 4.0))).isEqualTo(2.5);
        assertThat(StatsCalculator.median(List.of())).isZero();
    }

    @Test
    void averageRoundsNaturally() {
        assertThat(StatsCalculator.average(List.of(2.0, 4.0, 6.0))).isEqualTo(4.0);
        assertThat(StatsCalculator.average(List.of())).isZero();
    }
}
