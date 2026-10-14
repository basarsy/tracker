package com.example.jobtracker.application;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.stereotype.Component;

import com.example.jobtracker.application.dto.ApplicationDetailResponse;
import com.example.jobtracker.application.dto.ApplicationResponse;
import com.example.jobtracker.application.dto.CreateApplicationRequest;
import com.example.jobtracker.application.dto.InterviewResponse;
import com.example.jobtracker.application.dto.StatusHistoryResponse;
import com.example.jobtracker.application.dto.UpdateApplicationRequest;
import com.example.jobtracker.application.interview.Interview;
import com.example.jobtracker.statushistory.StatusHistory;

@Component
public class ApplicationMapper {

    public JobApplication toEntity(CreateApplicationRequest request) {
        JobApplication entity = new JobApplication();
        applySharedFields(
                entity,
                request.companyName(),
                request.positionTitle(),
                request.workModel(),
                request.employmentType(),
                request.location(),
                request.jobPostingUrl(),
                request.applicationSource(),
                request.appliedDate() != null ? request.appliedDate() : LocalDate.now(),
                request.salaryMin(),
                request.salaryMax(),
                request.salaryCurrency(),
                request.cvVersion(),
                request.contactName(),
                request.contactEmail(),
                request.notes()
        );
        return entity;
    }

    public void updateEntity(JobApplication entity, UpdateApplicationRequest request) {
        applySharedFields(
                entity,
                request.companyName(),
                request.positionTitle(),
                request.workModel(),
                request.employmentType(),
                request.location(),
                request.jobPostingUrl(),
                request.applicationSource(),
                request.appliedDate(),
                request.salaryMin(),
                request.salaryMax(),
                request.salaryCurrency(),
                request.cvVersion(),
                request.contactName(),
                request.contactEmail(),
                request.notes()
        );
    }

    public ApplicationResponse toResponse(JobApplication entity) {
        long days = ChronoUnit.DAYS.between(entity.getAppliedDate(), LocalDate.now());
        return new ApplicationResponse(
                entity.getId(),
                entity.getCompanyName(),
                entity.getPositionTitle(),
                entity.getWorkModel(),
                entity.getEmploymentType(),
                entity.getLocation(),
                entity.getJobPostingUrl(),
                entity.getApplicationSource(),
                entity.getAppliedDate(),
                entity.getCurrentStatus(),
                entity.getSalaryMin(),
                entity.getSalaryMax(),
                entity.getSalaryCurrency(),
                entity.getCvVersion(),
                entity.getContactName(),
                entity.getContactEmail(),
                entity.getNotes(),
                entity.getCreatedAt(),
                entity.getUpdatedAt(),
                days
        );
    }

    public StatusHistoryResponse toHistoryResponse(StatusHistory history) {
        return new StatusHistoryResponse(
                history.getId(),
                history.getStatus(),
                history.getChangedAt(),
                history.getNote()
        );
    }

    public InterviewResponse toInterviewResponse(Interview interview) {
        return new InterviewResponse(
                interview.getId(),
                interview.getApplication().getId(),
                interview.getApplication().getCompanyName(),
                interview.getApplication().getPositionTitle(),
                interview.getScheduledAt(),
                interview.getType(),
                interview.getNotes()
        );
    }

    public ApplicationDetailResponse toDetail(
            JobApplication entity,
            List<StatusHistory> history,
            List<Interview> interviews
    ) {
        return new ApplicationDetailResponse(
                toResponse(entity),
                history.stream().map(this::toHistoryResponse).toList(),
                interviews.stream().map(this::toInterviewResponse).toList()
        );
    }

    private void applySharedFields(
            JobApplication entity,
            String companyName,
            String positionTitle,
            com.example.jobtracker.common.enums.WorkModel workModel,
            com.example.jobtracker.common.enums.EmploymentType employmentType,
            String location,
            String jobPostingUrl,
            com.example.jobtracker.common.enums.ApplicationSource applicationSource,
            LocalDate appliedDate,
            java.math.BigDecimal salaryMin,
            java.math.BigDecimal salaryMax,
            String salaryCurrency,
            String cvVersion,
            String contactName,
            String contactEmail,
            String notes
    ) {
        entity.setCompanyName(companyName.trim());
        entity.setPositionTitle(positionTitle.trim());
        entity.setWorkModel(workModel);
        entity.setEmploymentType(employmentType);
        entity.setLocation(blankToNull(location));
        entity.setJobPostingUrl(blankToNull(jobPostingUrl));
        entity.setApplicationSource(applicationSource);
        entity.setAppliedDate(appliedDate);
        entity.setSalaryMin(salaryMin);
        entity.setSalaryMax(salaryMax);
        entity.setSalaryCurrency(blankToNull(salaryCurrency));
        entity.setCvVersion(blankToNull(cvVersion));
        entity.setContactName(blankToNull(contactName));
        entity.setContactEmail(blankToNull(contactEmail));
        entity.setNotes(blankToNull(notes));
    }

    private String blankToNull(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }
}
