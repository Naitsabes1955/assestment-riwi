CREATE TABLE IF NOT EXISTS rw.rw_message_reads (
    message_id UUID NOT NULL,

    user_id UUID NOT NULL,

    read_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_rw_message_reads
        PRIMARY KEY (message_id, user_id),

    CONSTRAINT fk_rw_message_reads_message
        FOREIGN KEY (message_id)
        REFERENCES rw.rw_messages(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_rw_message_reads_user
        FOREIGN KEY (user_id)
        REFERENCES rw.rw_users(id)
        ON DELETE RESTRICT
);