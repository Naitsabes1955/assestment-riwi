CREATE OR REPLACE FUNCTION rw.user_has_channel_access(
    p_user_id UUID,
    p_channel_id UUID
)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM rw.rw_channel_members cm
        WHERE cm.user_id = p_user_id
          AND cm.channel_id = p_channel_id
    );
$$;