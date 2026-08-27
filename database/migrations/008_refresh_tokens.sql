CREATE TABLE IF NOT EXISTS rw.rw_refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL,

    token_hash VARCHAR(255) NOT NULL,

    expires_at TIMESTAMPTZ NOT NULL,

    revoked_at TIMESTAMPTZ,

    replaced_by_id UUID,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_rw_refresh_tokens_user
        FOREIGN KEY (user_id)
        REFERENCES rw.rw_users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_rw_refresh_tokens_replaced_by
        FOREIGN KEY (replaced_by_id)
        REFERENCES rw.rw_refresh_tokens(id)
        ON DELETE SET NULL,

    CONSTRAINT chk_rw_refresh_tokens_expiration
        CHECK (expires_at > created_at)
);