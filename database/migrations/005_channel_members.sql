CREATE TABLE IF NOT EXISTS rw.rw_channel_members (
    channel_id UUID NOT NULL,

    user_id UUID NOT NULL,

    joined_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_rw_channel_members
        PRIMARY KEY (channel_id, user_id),

    CONSTRAINT fk_rw_channel_members_channel
        FOREIGN KEY (channel_id)
        REFERENCES rw.rw_channels(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_rw_channel_members_user
        FOREIGN KEY (user_id)
        REFERENCES rw.rw_users(id)
        ON DELETE RESTRICT
);