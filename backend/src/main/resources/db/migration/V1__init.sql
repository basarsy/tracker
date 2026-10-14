CREATE TABLE job_application (
    id UUID PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    position_title VARCHAR(255) NOT NULL,
    work_model VARCHAR(32) NOT NULL,
    employment_type VARCHAR(32) NOT NULL,
    location VARCHAR(255),
    job_posting_url VARCHAR(1024),
    application_source VARCHAR(32) NOT NULL,
    applied_date DATE NOT NULL,
    current_status VARCHAR(32) NOT NULL,
    salary_min NUMERIC(12, 2),
    salary_max NUMERIC(12, 2),
    salary_currency VARCHAR(8),
    cv_version VARCHAR(128),
    contact_name VARCHAR(255),
    contact_email VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_job_application_applied_date ON job_application (applied_date);
CREATE INDEX idx_job_application_current_status ON job_application (current_status);

CREATE TABLE status_history (
    id UUID PRIMARY KEY,
    application_id UUID NOT NULL REFERENCES job_application (id) ON DELETE CASCADE,
    status VARCHAR(32) NOT NULL,
    changed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    note TEXT
);

CREATE INDEX idx_status_history_application_id ON status_history (application_id);
CREATE INDEX idx_status_history_changed_at ON status_history (changed_at);

CREATE TABLE interview (
    id UUID PRIMARY KEY,
    application_id UUID NOT NULL REFERENCES job_application (id) ON DELETE CASCADE,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    type VARCHAR(32) NOT NULL,
    notes TEXT
);

CREATE INDEX idx_interview_application_id ON interview (application_id);
CREATE INDEX idx_interview_scheduled_at ON interview (scheduled_at);
