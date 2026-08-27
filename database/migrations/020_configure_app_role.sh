set -Eeuo pipefail

: "${RW_APP_PASSWORD:?RW_APP_PASSWORD must be configured in the local environment}"

psql \
    --username "$POSTGRES_USER" \
    --dbname "$POSTGRES_DB" \
    --set ON_ERROR_STOP=1 \
    --set app_password="$RW_APP_PASSWORD" <<'SQL'
ALTER ROLE rw_app PASSWORD :'app_password';
SQL