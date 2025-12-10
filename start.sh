#!/bin/sh

LOCK_FILE="init.lock"

echo "Waiting for database..."
echo DB_NAME: ${DB_NAME}
echo DB_HOST: ${DB_HOST}
echo DB_PORT: ${DB_PORT}
while ! nc -z ${DB_HOST} ${DB_PORT}; do sleep 1; done
echo "Connected to database."

if [ ! -f "$LOCK_FILE" ]; then
  node ace generate:key
  node ace migration:fresh --seed
  touch "$LOCK_FILE"
fi

npm run dev
