\i /database/procedures/001_user_procedures.sql

GRANT EXECUTE ON PROCEDURE rw.get_users(INTEGER, REFCURSOR) TO rw_app;
GRANT EXECUTE ON PROCEDURE rw.update_user(UUID, TEXT, TEXT, TEXT) TO rw_app;
GRANT EXECUTE ON PROCEDURE rw.delete_user(UUID) TO rw_app;