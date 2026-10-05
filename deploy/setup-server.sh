#!/usr/bin/env bash
# Install Mukhtasar on the VPS. Run as a user who can sudo, from a checkout at /opt/mukhtasar.
# Does not touch the Nabd site under /var/www/nabdmessagin_usr.
set -euo pipefail

APP_ROOT=/opt/mukhtasar
PUBLIC_ORIGIN="${PUBLIC_ORIGIN:-http://95.133.236.228}"
DB_NAME=mukhtasar
DB_USER=mukhtasar
REDIS_DB=1

if [[ ! -f "$APP_ROOT/package.json" ]]; then
  echo "Expected the repo at $APP_ROOT" >&2
  exit 1
fi

if ! sudo -n true 2>/dev/null; then
  echo "This user cannot sudo without a password." >&2
  exit 1
fi

export DEBIAN_FRONTEND=noninteractive

if ! command -v psql >/dev/null 2>&1; then
  sudo apt-get update
  sudo apt-get install -y postgresql postgresql-contrib
fi

if ! command -v redis-cli >/dev/null 2>&1; then
  sudo apt-get update
  sudo apt-get install -y redis-server
  sudo systemctl enable --now redis-server
fi

NODE_BIN="$(command -v node || true)"
NEED_NODE=1
if [[ -n "$NODE_BIN" ]]; then
  NODE_MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
  if [[ "$NODE_MAJOR" -ge 20 ]]; then
    NEED_NODE=0
  fi
fi

if [[ "$NEED_NODE" -eq 1 ]]; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
  NODE_BIN=/usr/bin/node
fi

if ! command -v pnpm >/dev/null 2>&1; then
  sudo corepack enable
  sudo corepack prepare pnpm@12.3.4 --activate
fi
PNPM_BIN="$(command -v pnpm)"

if ! sudo -u postgres psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='$DB_USER'" | grep -q 1; then
  DB_PASSWORD="$(openssl rand -hex 24)"
  sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD'"
  sudo -u postgres psql -c "CREATE DATABASE $DB_NAME OWNER $DB_USER"
else
  DB_PASSWORD=""
fi

ENV_FILE="$APP_ROOT/apps/backend/.env"
if [[ ! -f "$ENV_FILE" ]]; then
  if [[ -z "${DB_PASSWORD:-}" ]]; then
    echo "Database user $DB_USER already exists. Put its password in $ENV_FILE and rerun." >&2
    exit 1
  fi
  umask 077
  cat >"$ENV_FILE" <<EOF
PORT=3003
NODE_ENV=production
ORIGINAL_DOMAIN=mukhtasar.site
PUBLIC_BASE_URL=$PUBLIC_ORIGIN
MACHINE_ID=0
AUTH_SESSION_NAME=mukhtasar-session
WEB_URL=$PUBLIC_ORIGIN
ORIGINAL_URL=$PUBLIC_ORIGIN
SESSION_DURATION=172800000
COOKIE_SECURE=false
COOKIE_DOMAIN=
ALLOWED_ORIGINS=$PUBLIC_ORIGIN
AUTO_VERIFY_USERS=true
DB_SSL=false
DB_CONNECTION_STRING=postgres://$DB_USER:$DB_PASSWORD@127.0.0.1:5432/$DB_NAME
DATABASE_URL=postgres://$DB_USER:$DB_PASSWORD@127.0.0.1:5432/$DB_NAME
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_DB=$REDIS_DB
EMAIL_VERIFICATION_SECRET_KEY=$(openssl rand -hex 24)
PASSWORD_RESET_SECRET_KEY=$(openssl rand -hex 24)
WORKER_SECRET=$(openssl rand -hex 24)
SMTP_HOST=127.0.0.1
SMTP_PORT=1025
SMTP_SECURE=false
SMTP_FROM=dev@localhost
CONTACT_EMAIL=dev@localhost
EOF
  chmod 600 "$ENV_FILE"
fi

cat >"$APP_ROOT/apps/frontend/.env.production" <<EOF
NEXT_PUBLIC_API_URL=$PUBLIC_ORIGIN
API_URL=http://127.0.0.1:3003
SHORT_DOMAIN=mukhtasar.site
NEXT_PUBLIC_FALLBACK_ORIGIN=domains.mukhtasar.site
EOF

cd "$APP_ROOT"
"$PNPM_BIN" install --frozen-lockfile
"$PNPM_BIN" --filter @mukhtasar/shared build
"$PNPM_BIN" --filter @mukhtasar/backend build
mkdir -p "$APP_ROOT/apps/backend/logs"
set -a
# shellcheck disable=SC1091
source "$ENV_FILE"
set +a
PGSSLMODE=disable "$PNPM_BIN" --filter @mukhtasar/backend exec node-pg-migrate up
"$PNPM_BIN" --filter @mukhtasar/frontend build

sudo tee /etc/systemd/system/mukhtasar-backend.service >/dev/null <<EOF
[Unit]
Description=Mukhtasar API
After=network.target postgresql.service redis-server.service

[Service]
Type=simple
WorkingDirectory=$APP_ROOT/apps/backend
EnvironmentFile=$ENV_FILE
ExecStart=$NODE_BIN dist/main.js
Restart=on-failure
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF

sudo tee /etc/systemd/system/mukhtasar-frontend.service >/dev/null <<EOF
[Unit]
Description=Mukhtasar web
After=network.target mukhtasar-backend.service

[Service]
Type=simple
WorkingDirectory=$APP_ROOT/apps/frontend
Environment=NODE_ENV=production
ExecStart=$NODE_BIN node_modules/next/dist/bin/next start -p 3002
Restart=on-failure
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF

sudo cp "$APP_ROOT/deploy/nginx.conf" /etc/nginx/conf.d/mukhtasar.conf
sudo nginx -t
sudo systemctl daemon-reload
sudo systemctl enable --now mukhtasar-backend mukhtasar-frontend
sudo systemctl reload nginx

echo "Mukhtasar is up at $PUBLIC_ORIGIN"
