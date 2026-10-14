package com.example.jobtracker.application;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.example.jobtracker.common.enums.ApplicationStatus;

public interface JobApplicationRepository extends JpaRepository<JobApplication, UUID>, JpaSpecificationExecutor<JobApplication> {

    List<JobApplication> findByCurrentStatusAndAppliedDateLessThanEqual(ApplicationStatus status, LocalDate appliedDate);
}
