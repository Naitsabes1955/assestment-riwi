CREATE OR REPLACE PROCEDURE rw.get_users(
    IN p_limit INTEGER,
    INOUT p_result REFCURSOR
)
LANGUAGE plpgsql
AS $$
BEGIN
    OPEN p_result FOR
        SELECT
            id,
            name,
            email,
            job_title,
            status,
            created_at
        FROM rw.rw_users
        WHERE status = 'active'
        ORDER BY created_at DESC, id DESC
        LIMIT p_limit;
END;
$$;

CREATE OR REPLACE PROCEDURE rw.update_user(
    p_user_id UUID,
    p_name TEXT,
    p_job_title TEXT,
    p_status TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE rw.rw_users
    SET
        name = p_name,
        job_title = p_job_title,
        status = p_status,
        updated_at = NOW()
    WHERE id = p_user_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found';
    END IF;
END;
$$;


CREATE OR REPLACE PROCEDURE rw.delete_user(
    p_user_id UUID
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE rw.rw_users
    SET
        status = 'inactive',
        updated_at = NOW()
    WHERE id = p_user_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found';
    END IF;
END;
$$;
