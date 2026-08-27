CREATE INDEX idx_rw_messages_search_vector
ON rw.rw_messages
USING GIN (search_vector);