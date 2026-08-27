CREATE OR REPLACE FUNCTION rw.send_message(
    p_user_id UUID,
    p_channel_id UUID,
    p_content TEXT
)
RETURNS rw.rw_messages
LANGUAGE plpgsql
AS $$
DECLARE
    v_message rw.rw_messages;
BEGIN
    -- Validate message content
    IF p_content IS NULL OR length(trim(p_content)) = 0 THEN
        RAISE EXCEPTION 'Message content cannot be empty';
    END IF;

    -- Validate channel membership
    IF NOT rw.user_has_channel_access(p_user_id, p_channel_id) THEN
        RAISE EXCEPTION 'User does not have access to this channel';
    END IF;

    -- Create message
    INSERT INTO rw.rw_messages (
        channel_id,
        sender_id,
        content
    )
    VALUES (
        p_channel_id,
        p_user_id,
        p_content
    )
    RETURNING *
    INTO v_message;

    RETURN v_message;
END;
$$;