CREATE OR REPLACE FUNCTION rw.get_channel_messages(
    p_user_id UUID,
    p_channel_id UUID,
    p_cursor_created_at TIMESTAMPTZ DEFAULT NULL,
    p_cursor_id UUID DEFAULT NULL,
    p_limit INTEGER DEFAULT 20
)
RETURNS SETOF rw.rw_messages
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
    -- Validate requested page size
    IF p_limit < 1 OR p_limit > 100 THEN
        RAISE EXCEPTION 'Limit must be between 1 and 100';
    END IF;

    -- Validate channel membership
    IF NOT rw.user_has_channel_access(p_user_id, p_channel_id) THEN
        RAISE EXCEPTION 'User does not have access to this channel';
    END IF;

    RETURN QUERY
    SELECT m.*
    FROM rw.rw_messages m
    WHERE m.channel_id = p_channel_id
      AND m.deleted_at IS NULL
      AND (
          p_cursor_created_at IS NULL
          OR (m.created_at, m.id) < (p_cursor_created_at, p_cursor_id)
      )
    ORDER BY m.created_at DESC, m.id DESC
    LIMIT p_limit;
END;
$$;