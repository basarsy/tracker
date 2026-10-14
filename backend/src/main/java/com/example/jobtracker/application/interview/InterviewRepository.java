package com.example.jobtracker.application.interview;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface InterviewRepository extends JpaRepository<Interview, UUID> {

    List<Interview> findByApplicationIdOrderByScheduledAtAsc(UUID applicationId);

    Optional<Interview> findByIdAndApplicationId(UUID id, UUID applicationId);

    List<Interview> findByScheduledAtGreaterThanEqualOrderByScheduledAtAsc(Instant from);
}
