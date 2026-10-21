#!/usr/bin/env bash
# Envía N peticiones como N usuarios nuevos (sin cookies) y cuenta qué versión respondió.
# Uso: scripts/traffic.sh http://localhost:8083/api/version 200
set -uo pipefail

URL=${1:?Uso: traffic.sh <url> [peticiones]}
N=${2:-100}

for ((i = 0; i < N; i++)); do
  { curl -s --max-time 2 "$URL"; echo; } | sed -n 's/.*"version":"\([^"]*\)".*"slot":"\([^"]*\)".*/\1 (\2)/p'
done | sort | uniq -c | awk -v n="$N" '{ printf "%5d respuestas  %5.1f%%  versión %s %s\n", $1, 100 * $1 / n, $2, $3 }'
