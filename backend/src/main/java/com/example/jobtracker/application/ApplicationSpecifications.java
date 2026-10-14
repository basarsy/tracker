package com.example.jobtracker.application;

import org.springframework.data.jpa.domain.Specification;

import com.example.jobtracker.application.dto.ApplicationFilter;

public final class ApplicationSpecifications {

    private ApplicationSpecifications() {
    }

    public static Specification<JobApplication> fromFilter(ApplicationFilter filter) {
        Specification<JobApplication> spec = (root, query, cb) -> cb.conjunction();
        if (filter == null) {
            return spec;
        }
        if (filter.status() != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("currentStatus"), filter.status()));
        }
        if (filter.workModel() != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("workModel"), filter.workModel()));
        }
        if (filter.employmentType() != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("employmentType"), filter.employmentType()));
        }
        if (filter.source() != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("applicationSource"), filter.source()));
        }
        if (filter.appliedFrom() != null) {
            spec = spec.and((root, query, cb) -> cb.greaterThanOrEqualTo(root.get("appliedDate"), filter.appliedFrom()));
        }
        if (filter.appliedTo() != null) {
            spec = spec.and((root, query, cb) -> cb.lessThanOrEqualTo(root.get("appliedDate"), filter.appliedTo()));
        }
        if (filter.search() != null && !filter.search().isBlank()) {
            String like = "%" + filter.search().trim().toLowerCase() + "%";
            spec = spec.and((root, query, cb) -> cb.or(
                    cb.like(cb.lower(root.get("companyName")), like),
                    cb.like(cb.lower(root.get("positionTitle")), like)
            ));
        }
        return spec;
    }
}
