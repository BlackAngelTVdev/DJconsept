#!/bin/sh

LOCK_FILE="init.lock"

if [ ! -f "$LOCK_FILE" ]; then
  node ace generate:key
  node ace migration:fresh --seed
  touch "$LOCK_FILE"
fi

npm run dev
