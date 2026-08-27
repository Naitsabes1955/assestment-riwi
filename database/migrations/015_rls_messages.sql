ALTER TABLE rw.rw_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY rw_messages_member_select
ON rw.rw_messages
FOR SELECT
TO rw_app
USING (
    EXISTS (
        SELECT 1
        FROM rw.rw_channel_members cm
        WHERE cm.channel_id = rw_messages.channel_id
          AND cm.user_id = current_setting(
              'app.current_user_id',
              true
          )::UUID
    )
);

CREATE POLICY rw_messages_member_update
ON rw.rw_messages
FOR UPDATE
TO rw_app
USING (
    EXISTS (
        SELECT 1
        FROM rw.rw_channel_members cm
        WHERE cm.channel_id = rw_messages.channel_id
          AND cm.user_id = current_setting(
              'app.current_user_id',
              true
          )::UUID
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM rw.rw_channel_members cm
        WHERE cm.channel_id = rw_messages.channel_id
          AND cm.user_id = current_setting(
              'app.current_user_id',
              true
          )::UUID
    )
);

