DO $$
BEGIN
    PERFORM set_config(
        'app.current_user_id',
        '',
        false
    );
END
$$;