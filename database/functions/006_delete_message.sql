CREATE OR REPLACE FUNCTION rw.delete_message(
    p_user_id UUID,
    p_message_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE rw.rw_messages m
    SET
        deleted_at = NOW(),
        updated_at = NOW()
    WHERE m.id = p_message_id
      AND m.deleted_at IS NULL
      AND EXISTS (
          SELECT 1
          FROM rw.rw_channel_members cm
          WHERE cm.channel_id = m.channel_id
            AND cm.user_id = p_user_id
      );

    RETURN FOUND;
END;
$$;