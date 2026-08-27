INSERT INTO rw.rw_users (
    id,
    first_name,
    last_name,
    email,
    password_hash,
    job_title,
    status
)
VALUES
(
    '11111111-1111-4111-8111-111111111111',
    'Juan',
    'Mosquera',
    'juan@riwi.com',
    '$2b$12$LQv3c1yqBWJZ7L5F8q4vQe9vJw7J8hX5K5w7Jw8J8J8J8J8J8J8J8',
    'Backend Developer',
    'ACTIVE'
),
(
    '22222222-2222-4222-8222-222222222222',
    'Ana',
    'Gomez',
    'ana@riwi.com',
    '$2b$12$LQv3c1yqBWJZ7L5F8q4vQe9vJw7J8hX5K5w7Jw8J8J8J8J8J8J8',
    'Frontend Developer',
    'ACTIVE'
),
(
    '33333333-3333-4333-8333-333333333333',
    'Carlos',
    'Perez',
    'carlos@riwi.com',
    '$2b$12$LQv3c1yqBWJZ7L5F8q4vQe9vJw7J8hX5K5w7Jw8J8J8J8J8J8J8',
    'QA Engineer',
    'ACTIVE'
),
(
    '44444444-4444-4444-8444-444444444444',
    'Laura',
    'Martinez',
    'laura@riwi.com',
    '$2b$12$LQv3c1yqBWJZ7L5F8q4vQe9vJw7J8hX5K5w7Jw8J8J8J8J8J8J8',
    'Product Manager',
    'INACTIVE'
);

INSERT INTO rw.rw_channels (
    id,
    name,
    description,
    created_by
)
VALUES
(
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'Backend Team',
    'Private backend development channel.',
    '11111111-1111-4111-8111-111111111111'
),
(
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    'Frontend Team',
    'Private frontend development channel.',
    '22222222-2222-4222-8222-222222222222'
),
(
    'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
    'Management',
    'Private management channel.',
    '44444444-4444-4444-8444-444444444444'
);

INSERT INTO rw.rw_channel_members (
    channel_id,
    user_id
)
VALUES
-- Backend Team
(
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    '11111111-1111-4111-8111-111111111111'
),
(
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    '33333333-3333-4333-8333-333333333333'
),

-- Frontend Team
(
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    '22222222-2222-4222-8222-222222222222'
),
(
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    '33333333-3333-4333-8333-333333333333'
),

-- Management
(
    'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
    '44444444-4444-4444-8444-444444444444'
);

INSERT INTO rw.rw_messages (
    id,
    channel_id,
    sender_id,
    content
)
VALUES
(
    'aaaaaaaa-1111-4111-8111-aaaaaaaaaaaa',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    '11111111-1111-4111-8111-111111111111',
    'The authentication module is ready for review.'
),
(
    'bbbbbbbb-2222-4222-8222-bbbbbbbbbbbb',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    '33333333-3333-4333-8333-333333333333',
    'I will review the authentication flow today.'
),
(
    'cccccccc-3333-4333-8333-cccccccccccc',
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    '22222222-2222-4222-8222-222222222222',
    'The frontend messaging interface is in progress.'
),
(
    'dddddddd-4444-4444-8444-dddddddddddd',
    'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
    '44444444-4444-4444-8444-444444444444',
    'The product roadmap will be reviewed this week.'
);

INSERT INTO rw.rw_message_reads (
    message_id,
    user_id
)
VALUES
(
    'aaaaaaaa-1111-4111-8111-aaaaaaaaaaaa',
    '33333333-3333-4333-8333-333333333333'
),
(
    'bbbbbbbb-2222-4222-8222-bbbbbbbbbbbb',
    '11111111-1111-4111-8111-111111111111'
),
(
    'cccccccc-3333-4333-8333-cccccccccccc',
    '33333333-3333-4333-8333-333333333333'
);


INSERT INTO rw.rw_refresh_tokens (
    id,
    user_id,
    token_hash,
    expires_at,
    revoked_at
)
VALUES
(
    'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',
    '11111111-1111-4111-8111-111111111111',
    'seed-revoked-token-hash',
    CURRENT_TIMESTAMP + INTERVAL '30 days',
    CURRENT_TIMESTAMP
),
(
    'ffffffff-ffff-4fff-8fff-ffffffffffff',
    '11111111-1111-4111-8111-111111111111',
    'seed-active-token-hash',
    CURRENT_TIMESTAMP + INTERVAL '30 days',
    NULL
);