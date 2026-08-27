-- Users
CREATE INDEX IF NOT EXISTS idx_rw_users_status
ON rw.rw_users (status);

-- Channels
CREATE INDEX IF NOT EXISTS idx_rw_channels_created_by
ON rw.rw_channels (created_by);

-- Channel membership
CREATE INDEX IF NOT EXISTS idx_rw_channel_members_user
ON rw.rw_channel_members (user_id);

-- Messages by channel with keyset pagination support
CREATE INDEX IF NOT EXISTS idx_rw_messages_channel_created
ON rw.rw_messages (channel_id, created_at DESC, id DESC);

-- Messages by sender
CREATE INDEX IF NOT EXISTS idx_rw_messages_sender
ON rw.rw_messages (sender_id);

-- Message reads by user
CREATE INDEX IF NOT EXISTS idx_rw_message_reads_user
ON rw.rw_message_reads (user_id);

-- Refresh tokens by user
CREATE INDEX IF NOT EXISTS idx_rw_refresh_tokens_user
ON rw.rw_refresh_tokens (user_id);

-- Unique partial index:
-- Only active refresh tokens must have a unique token hash.
CREATE UNIQUE INDEX IF NOT EXISTS uq_rw_refresh_tokens_active_token
ON rw.rw_refresh_tokens (token_hash)
WHERE revoked_at IS NULL;