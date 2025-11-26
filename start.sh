#!/bin/sh

LOCK_FILE="init.lock"

until nc -z -v -w30 "$DB_HOST" "$DB_PORT"; do
  sleep 2
done

if [ ! -f "$LOCK_FILE" ]; then
  node ace generate:key
  node ace migration:fresh --seed
  touch "$LOCK_FILE"
fi

npm run dev
