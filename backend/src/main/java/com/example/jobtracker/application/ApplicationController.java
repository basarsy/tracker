package com.example.jobtracker.application;

import java.time.LocalDate;
import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.example.jobtracker.application.dto.ApplicationDetailResponse;
import com.example.jobtracker.application.dto.ApplicationFilter;
import com.example.jobtracker.application.dto.ApplicationResponse;
import com.example.jobtracker.application.dto.ChangeStatusRequest;
import com.example.jobtracker.application.dto.CreateApplicationRequest;
import com.example.jobtracker.application.dto.InterviewRequest;
import com.example.jobtracker.application.dto.InterviewResponse;
import com.example.jobtracker.application.dto.UpdateApplicationRequest;
import com.example.jobtracker.common.PageResponse;
import com.example.jobtracker.common.enums.ApplicationSource;
import com.example.jobtracker.common.enums.ApplicationStatus;
import com.example.jobtracker.common.enums.EmploymentType;
import com.example.jobtracker.common.enums.WorkModel;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApplicationDetailResponse create(@Valid @RequestBody CreateApplicationRequest request) {
        return applicationService.create(request);
    }

    @GetMapping
    public PageResponse<ApplicationResponse> list(
            @RequestParam(required = false) ApplicationStatus status,
            @RequestParam(required = false) WorkModel workModel,
            @RequestParam(required = false) EmploymentType employmentType,
            @RequestParam(required = false) ApplicationSource source,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) LocalDate appliedFrom,
            @RequestParam(required = false) LocalDate appliedTo,
            @PageableDefault(size = 20, sort = "appliedDate", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        ApplicationFilter filter = new ApplicationFilter(
                status, workModel, employmentType, source, search, appliedFrom, appliedTo
        );
        return PageResponse.from(applicationService.list(filter, pageable));
    }

    @GetMapping(value = "/export", produces = "text/csv")
    public ResponseEntity<byte[]> exportCsv(
            @RequestParam(required = false) ApplicationStatus status,
            @RequestParam(required = false) WorkModel workModel,
            @RequestParam(required = false) EmploymentType employmentType,
            @RequestParam(required = false) ApplicationSource source,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) LocalDate appliedFrom,
            @RequestParam(required = false) LocalDate appliedTo
    ) {
        ApplicationFilter filter = new ApplicationFilter(
                status, workModel, employmentType, source, search, appliedFrom, appliedTo
        );
        byte[] csv = applicationService.exportCsv(filter);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"applications.csv\"")
                .contentType(MediaType.parseMediaType("text/csv; charset=UTF-8"))
                .body(csv);
    }

    @GetMapping("/{id}")
    public ApplicationDetailResponse get(@PathVariable UUID id) {
        return applicationService.get(id);
    }

    @PutMapping("/{id}")
    public ApplicationDetailResponse update(@PathVariable UUID id, @Valid @RequestBody UpdateApplicationRequest request) {
        return applicationService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        applicationService.delete(id);
    }

    @PostMapping("/{id}/status")
    public ApplicationDetailResponse changeStatus(
            @PathVariable UUID id,
            @Valid @RequestBody ChangeStatusRequest request
    ) {
        return applicationService.changeStatus(id, request);
    }

    @PostMapping("/{id}/interviews")
    @ResponseStatus(HttpStatus.CREATED)
    public InterviewResponse addInterview(@PathVariable UUID id, @Valid @RequestBody InterviewRequest request) {
        return applicationService.addInterview(id, request);
    }

    @PutMapping("/{id}/interviews/{interviewId}")
    public InterviewResponse updateInterview(
            @PathVariable UUID id,
            @PathVariable UUID interviewId,
            @Valid @RequestBody InterviewRequest request
    ) {
        return applicationService.updateInterview(id, interviewId, request);
    }

    @DeleteMapping("/{id}/interviews/{interviewId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteInterview(@PathVariable UUID id, @PathVariable UUID interviewId) {
        applicationService.deleteInterview(id, interviewId);
    }
}
