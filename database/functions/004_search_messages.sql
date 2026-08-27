CREATE OR REPLACE FUNCTION rw.search_messages(
    p_user_id UUID,
    p_search_term TEXT,
    p_limit INTEGER DEFAULT 20
)
RETURNS TABLE (
    message_id UUID,
    channel_id UUID,
    sender_id UUID,
    content TEXT,
    highlighted_content TEXT,
    created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
    IF p_search_term IS NULL OR length(trim(p_search_term)) = 0 THEN
        RAISE EXCEPTION 'Search term cannot be empty';
    END IF;

    IF p_limit < 1 OR p_limit > 100 THEN
        RAISE EXCEPTION 'Limit must be between 1 and 100';
    END IF;

    RETURN QUERY
    SELECT
        m.id,
        m.channel_id,
        m.sender_id,
        m.content,
        ts_headline(
            'simple',
            m.content,
            plainto_tsquery('simple', p_search_term),
            'StartSel=<mark>, StopSel=</mark>'
        ),
        m.created_at
    FROM rw.rw_messages m
    INNER JOIN rw.rw_channel_members cm
        ON cm.channel_id = m.channel_id
       AND cm.user_id = p_user_id
    WHERE m.deleted_at IS NULL
      AND to_tsvector('simple', m.content)
          @@ plainto_tsquery('simple', p_search_term)
    ORDER BY m.created_at DESC, m.id DESC
    LIMIT p_limit;
END;
$$;