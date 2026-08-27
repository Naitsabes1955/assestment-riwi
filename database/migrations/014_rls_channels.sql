CREATE POLICY rw_channels_member_select
ON rw.rw_channels
FOR SELECT
TO rw_app
USING (
    EXISTS (
        SELECT 1
        FROM rw.rw_channel_members cm
        WHERE cm.channel_id = rw_channels.id
          AND cm.user_id = current_setting(
              'app.current_user_id',
              true
          )::UUID
    )
);