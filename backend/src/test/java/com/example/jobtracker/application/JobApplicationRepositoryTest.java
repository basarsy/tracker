package com.example.jobtracker.application;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDate;
import java.time.ZoneId;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import com.example.jobtracker.common.enums.ApplicationSource;
import com.example.jobtracker.common.enums.ApplicationStatus;
import com.example.jobtracker.common.enums.EmploymentType;
import com.example.jobtracker.common.enums.WorkModel;
import com.example.jobtracker.statushistory.StatusHistory;

@DataJpaTest
class JobApplicationRepositoryTest {

    @Autowired
    private JobApplicationRepository repository;

    @Test
    void savesApplicationAndFindsStaleAppliedOnes() {
        JobApplication fresh = application("Fresh Co", LocalDate.now().minusDays(2));
        JobApplication stale = application("Stale Co", LocalDate.now().minusDays(21));
        repository.save(fresh);
        repository.save(stale);

        var found = repository.findByCurrentStatusAndAppliedDateLessThanEqual(
                ApplicationStatus.APPLIED, LocalDate.now().minusDays(14)
        );

        assertThat(found).extracting(JobApplication::getCompanyName).containsExactly("Stale Co");
        assertThat(repository.findAll()).hasSize(2);
    }

    private JobApplication application(String company, LocalDate appliedDate) {
        JobApplication entity = new JobApplication();
        entity.setCompanyName(company);
        entity.setPositionTitle("Backend Engineer");
        entity.setWorkModel(WorkModel.REMOTE);
        entity.setEmploymentType(EmploymentType.FULL_TIME);
        entity.setApplicationSource(ApplicationSource.LINKEDIN);
        entity.setAppliedDate(appliedDate);
        entity.addStatus(StatusHistory.of(
                entity,
                ApplicationStatus.APPLIED,
                appliedDate.atStartOfDay(ZoneId.systemDefault()).toInstant(),
                "Application submitted"
        ));
        return entity;
    }
}
