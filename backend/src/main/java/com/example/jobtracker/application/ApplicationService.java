package com.example.jobtracker.application;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.ZoneId;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.jobtracker.application.dto.ApplicationDetailResponse;
import com.example.jobtracker.application.dto.ApplicationFilter;
import com.example.jobtracker.application.dto.ApplicationResponse;
import com.example.jobtracker.application.dto.ChangeStatusRequest;
import com.example.jobtracker.application.dto.CreateApplicationRequest;
import com.example.jobtracker.application.dto.InterviewRequest;
import com.example.jobtracker.application.dto.InterviewResponse;
import com.example.jobtracker.application.dto.UpdateApplicationRequest;
import com.example.jobtracker.application.interview.Interview;
import com.example.jobtracker.application.interview.InterviewRepository;
import com.example.jobtracker.common.enums.ApplicationStatus;
import com.example.jobtracker.common.exception.NotFoundException;
import com.example.jobtracker.statushistory.StatusHistory;
import com.example.jobtracker.statushistory.StatusHistoryRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ApplicationService {

    private final JobApplicationRepository applicationRepository;
    private final StatusHistoryRepository statusHistoryRepository;
    private final InterviewRepository interviewRepository;
    private final ApplicationMapper mapper;

    public ApplicationDetailResponse create(CreateApplicationRequest request) {
        validateSalary(request.salaryMin(), request.salaryMax());
        JobApplication entity = mapper.toEntity(request);
        Instant appliedAt = entity.getAppliedDate().atStartOfDay(ZoneId.systemDefault()).toInstant();
        entity.addStatus(StatusHistory.of(entity, ApplicationStatus.APPLIED, appliedAt, "Application submitted"));
        JobApplication saved = applicationRepository.save(entity);
        return toDetail(saved.getId());
    }

    @Transactional(readOnly = true)
    public Page<ApplicationResponse> list(ApplicationFilter filter, Pageable pageable) {
        return applicationRepository.findAll(ApplicationSpecifications.fromFilter(filter), pageable)
                .map(mapper::toResponse);
    }

    @Transactional(readOnly = true)
    public ApplicationDetailResponse get(UUID id) {
        return toDetail(id);
    }

    public ApplicationDetailResponse update(UUID id, UpdateApplicationRequest request) {
        validateSalary(request.salaryMin(), request.salaryMax());
        JobApplication entity = getEntity(id);
        mapper.updateEntity(entity, request);
        return toDetail(id);
    }

    public void delete(UUID id) {
        if (!applicationRepository.existsById(id)) {
            throw new NotFoundException("Application not found: " + id);
        }
        applicationRepository.deleteById(id);
    }

    public ApplicationDetailResponse changeStatus(UUID id, ChangeStatusRequest request) {
        JobApplication entity = getEntity(id);
        Instant changedAt = request.changedAt() != null ? request.changedAt() : Instant.now();
        entity.addStatus(StatusHistory.of(entity, request.status(), changedAt, request.note()));
        return toDetail(id);
    }

    public InterviewResponse addInterview(UUID applicationId, InterviewRequest request) {
        JobApplication entity = getEntity(applicationId);
        Interview interview = new Interview();
        interview.setScheduledAt(request.scheduledAt());
        interview.setType(request.type());
        interview.setNotes(request.notes());
        entity.addInterview(interview);
        interviewRepository.save(interview);
        return mapper.toInterviewResponse(interview);
    }

    public InterviewResponse updateInterview(UUID applicationId, UUID interviewId, InterviewRequest request) {
        Interview interview = interviewRepository.findByIdAndApplicationId(interviewId, applicationId)
                .orElseThrow(() -> new NotFoundException("Interview not found: " + interviewId));
        interview.setScheduledAt(request.scheduledAt());
        interview.setType(request.type());
        interview.setNotes(request.notes());
        return mapper.toInterviewResponse(interview);
    }

    public void deleteInterview(UUID applicationId, UUID interviewId) {
        Interview interview = interviewRepository.findByIdAndApplicationId(interviewId, applicationId)
                .orElseThrow(() -> new NotFoundException("Interview not found: " + interviewId));
        interviewRepository.delete(interview);
    }

    @Transactional(readOnly = true)
    public List<InterviewResponse> upcomingInterviews() {
        return interviewRepository.findByScheduledAtGreaterThanEqualOrderByScheduledAtAsc(Instant.now())
                .stream()
                .map(mapper::toInterviewResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<JobApplication> findAllMatching(ApplicationFilter filter) {
        return applicationRepository.findAll(ApplicationSpecifications.fromFilter(filter));
    }

    @Transactional(readOnly = true)
    public byte[] exportCsv(ApplicationFilter filter) {
        List<JobApplication> list = findAllMatching(filter);
        StringBuilder sb = new StringBuilder();
        sb.append("ID,Company,Position,Work Model,Employment Type,Location,Source,Applied Date,Status,Min Salary,Max Salary,Currency,CV Version,Contact Name,Contact Email,Posting URL,Notes\n");
        for (JobApplication a : list) {
            sb.append(escapeCsv(a.getId())).append(',')
              .append(escapeCsv(a.getCompanyName())).append(',')
              .append(escapeCsv(a.getPositionTitle())).append(',')
              .append(escapeCsv(a.getWorkModel())).append(',')
              .append(escapeCsv(a.getEmploymentType())).append(',')
              .append(escapeCsv(a.getLocation())).append(',')
              .append(escapeCsv(a.getApplicationSource())).append(',')
              .append(escapeCsv(a.getAppliedDate())).append(',')
              .append(escapeCsv(a.getCurrentStatus())).append(',')
              .append(escapeCsv(a.getSalaryMin())).append(',')
              .append(escapeCsv(a.getSalaryMax())).append(',')
              .append(escapeCsv(a.getSalaryCurrency())).append(',')
              .append(escapeCsv(a.getCvVersion())).append(',')
              .append(escapeCsv(a.getContactName())).append(',')
              .append(escapeCsv(a.getContactEmail())).append(',')
              .append(escapeCsv(a.getJobPostingUrl())).append(',')
              .append(escapeCsv(a.getNotes())).append('\n');
        }
        return sb.toString().getBytes(java.nio.charset.StandardCharsets.UTF_8);
    }

    private String escapeCsv(Object value) {
        if (value == null) {
            return "";
        }
        String str = value.toString();
        if (str.contains(",") || str.contains("\"") || str.contains("\n") || str.contains("\r")) {
            return "\"" + str.replace("\"", "\"\"") + "\"";
        }
        return str;
    }

    private ApplicationDetailResponse toDetail(UUID id) {
        JobApplication entity = getEntity(id);
        List<StatusHistory> history = statusHistoryRepository.findByApplicationIdOrderByChangedAtAsc(id);
        List<Interview> interviews = interviewRepository.findByApplicationIdOrderByScheduledAtAsc(id);
        return mapper.toDetail(entity, history, interviews);
    }

    private JobApplication getEntity(UUID id) {
        return applicationRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Application not found: " + id));
    }

    private void validateSalary(BigDecimal min, BigDecimal max) {
        if (min != null && max != null && min.compareTo(max) > 0) {
            throw new IllegalArgumentException("salaryMin cannot be greater than salaryMax");
        }
    }
}
