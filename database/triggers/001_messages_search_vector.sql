CREATE OR REPLACE FUNCTION rw.update_message_search_vector()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.search_vector :=
        to_tsvector('simple', COALESCE(NEW.content, ''));

    RETURN NEW;
END;
$$;


CREATE TRIGGER trg_rw_messages_search_vector
BEFORE INSERT OR UPDATE OF content
ON rw.rw_messages
FOR EACH ROW
EXECUTE FUNCTION rw.update_message_search_vector();