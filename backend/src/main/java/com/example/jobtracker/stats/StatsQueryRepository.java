package com.example.jobtracker.stats;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.example.jobtracker.common.enums.ApplicationStatus;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Repository
public class StatsQueryRepository {

    public enum GroupByField {
        APPLICATION_SOURCE("application_source"),
        WORK_MODEL("work_model"),
        EMPLOYMENT_TYPE("employment_type");

        private final String column;

        GroupByField(String column) {
            this.column = column;
        }

        public String getColumn() {
            return column;
        }
    }

    public static final List<ApplicationStatus> RESPONDED_OR_LATER = List.of(
            ApplicationStatus.RESPONDED,
            ApplicationStatus.INTERVIEW_SCHEDULED,
            ApplicationStatus.INTERVIEWED,
            ApplicationStatus.OFFER,
            ApplicationStatus.ACCEPTED,
            ApplicationStatus.REJECTED,
            ApplicationStatus.WITHDRAWN
    );

    public static final List<ApplicationStatus> INTERVIEW_OR_LATER = List.of(
            ApplicationStatus.INTERVIEW_SCHEDULED,
            ApplicationStatus.INTERVIEWED,
            ApplicationStatus.OFFER,
            ApplicationStatus.ACCEPTED
    );

    @PersistenceContext
    private EntityManager entityManager;

    public long countAll() {
        return ((Number) entityManager.createNativeQuery("SELECT COUNT(*) FROM job_application")
                .getSingleResult()).longValue();
    }

    public long countNotWithdrawn() {
        return ((Number) entityManager.createNativeQuery(
                        "SELECT COUNT(*) FROM job_application WHERE current_status <> 'WITHDRAWN'")
                .getSingleResult()).longValue();
    }

    public long countActive() {
        return ((Number) entityManager.createNativeQuery(
                        """
                        SELECT COUNT(*) FROM job_application
                        WHERE current_status NOT IN ('ACCEPTED','REJECTED','GHOSTED','WITHDRAWN')
                        """)
                .getSingleResult()).longValue();
    }

    public long countEverReached(Collection<ApplicationStatus> statuses) {
        if (statuses == null || statuses.isEmpty()) {
            return 0L;
        }
        List<String> statusNames = statuses.stream().map(Enum::name).toList();
        return ((Number) entityManager.createNativeQuery(
                        """
                        SELECT COUNT(DISTINCT application_id)
                        FROM status_history
                        WHERE status IN (:statuses)
                        """)
                .setParameter("statuses", statusNames)
                .getSingleResult()).longValue();
    }

    public long countRespondedEligible() {
        return ((Number) entityManager.createNativeQuery(
                        """
                        SELECT COUNT(DISTINCT a.id)
                        FROM job_application a
                        JOIN status_history h ON h.application_id = a.id
                        WHERE a.current_status <> 'WITHDRAWN'
                          AND h.status NOT IN ('APPLIED','GHOSTED')
                        """)
                .getSingleResult()).longValue();
    }

    public List<Double> responseTimesDays() {
        @SuppressWarnings("unchecked")
        List<Number> rows = entityManager.createNativeQuery(
                """
                SELECT MIN(EXTRACT(EPOCH FROM (h.changed_at - CAST(a.applied_date AS TIMESTAMP))) / 86400.0)
                FROM job_application a
                JOIN status_history h ON h.application_id = a.id
                WHERE h.status IN ('RESPONDED','INTERVIEW_SCHEDULED','INTERVIEWED','OFFER','ACCEPTED','REJECTED')
                GROUP BY a.id
                """
        ).getResultList();
        return rows.stream().map(Number::doubleValue).toList();
    }

    public List<Object[]> groupedBy(GroupByField field) {
        String column = field.getColumn();
        @SuppressWarnings("unchecked")
        List<Object[]> rows = entityManager.createNativeQuery(
                """
                SELECT a.%s AS grp,
                       COUNT(*) AS total,
                       COUNT(*) FILTER (
                           WHERE EXISTS (
                               SELECT 1 FROM status_history h
                               WHERE h.application_id = a.id
                                 AND h.status NOT IN ('APPLIED','GHOSTED')
                           )
                       ) AS responded,
                       COUNT(*) FILTER (
                           WHERE EXISTS (
                               SELECT 1 FROM status_history h
                               WHERE h.application_id = a.id
                                 AND h.status IN ('INTERVIEW_SCHEDULED','INTERVIEWED','OFFER','ACCEPTED')
                           )
                       ) AS interviewed
                FROM job_application a
                GROUP BY a.%s
                ORDER BY total DESC
                """.formatted(column, column)
        ).getResultList();
        return rows;
    }

    public List<Object[]> weeklyCounts(LocalDate from) {
        @SuppressWarnings("unchecked")
        List<Object[]> rows = entityManager.createNativeQuery(
                """
                SELECT CAST(date_trunc('week', applied_date) AS DATE) AS week_start, COUNT(*)
                FROM job_application
                WHERE applied_date >= :from
                GROUP BY week_start
                ORDER BY week_start
                """
        ).setParameter("from", from).getResultList();
        return rows;
    }
}
