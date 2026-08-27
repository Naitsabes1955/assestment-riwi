CREATE TABLE IF NOT EXISTS rw.rw_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    channel_id UUID NOT NULL,

    sender_id UUID NOT NULL,

    content TEXT NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    deleted_at TIMESTAMPTZ,

    search_vector TSVECTOR,

    CONSTRAINT fk_rw_messages_channel
        FOREIGN KEY (channel_id)
        REFERENCES rw.rw_channels(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_rw_messages_sender
        FOREIGN KEY (sender_id)
        REFERENCES rw.rw_users(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_rw_messages_content
        CHECK (length(trim(content)) > 0)
);