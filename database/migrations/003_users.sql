CREATE TABLE IF NOT EXISTS rw.rw_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,

    email VARCHAR(255) NOT NULL,

    password_hash VARCHAR(255) NOT NULL,

    job_title VARCHAR(150) NOT NULL,

    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_rw_users_email
        UNIQUE (email),

    CONSTRAINT chk_rw_users_status
        CHECK (status IN ('ACTIVE', 'INACTIVE')),

    CONSTRAINT chk_rw_users_first_name
        CHECK (length(trim(first_name)) > 0),

    CONSTRAINT chk_rw_users_last_name
        CHECK (length(trim(last_name)) > 0),

    CONSTRAINT chk_rw_users_job_title
        CHECK (length(trim(job_title)) > 0)
);

