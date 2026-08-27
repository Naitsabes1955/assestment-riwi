CREATE TABLE IF NOT EXISTS rw.rw_channels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(150) NOT NULL,

    description TEXT,

    created_by UUID NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_rw_channels_created_by
        FOREIGN KEY (created_by)
        REFERENCES rw.rw_users(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_rw_channels_name
        CHECK (length(trim(name)) > 0)
);