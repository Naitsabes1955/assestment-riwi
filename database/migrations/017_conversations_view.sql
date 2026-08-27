CREATE OR REPLACE VIEW rw.user_conversations AS
SELECT
    c.id AS channel_id,
    c.name AS channel_name,
    c.created_at AS channel_created_at,
    cm.user_id
FROM rw.rw_channels c
INNER JOIN rw.rw_channel_members cm
    ON cm.channel_id = c.id;