#!/usr/bin/env bash
# Estrategia Recreate: detener la versión actual y reemplazarla por la nueva.
#   scripts/recreate.sh up 1.0.0       iniciar el entorno con la versión indicada
#   scripts/recreate.sh seed           cargar productos y usuario administrador
#   scripts/recreate.sh update 1.1.0   detener v actual, iniciar la nueva y medir la caída
#   scripts/recreate.sh status         ver contenedores y versión publicada
#   scripts/recreate.sh down           detener y eliminar contenedores
source "$(dirname "${BASH_SOURCE[0]}")/common.sh"

S=recreate
URL=http://localhost:8080
dc() { docker compose -f compose.recreate.yaml --env-file .env --env-file "state/$S.env" "$@"; }
touch "state/$S.env"

case "${1:-}" in
  up)
    state_set $S APP_VERSION "${2:?Indique la versión}"
    dc up -d --wait
    wait_version "$URL/api/version" "$2"
    log "Recreate en $URL con la versión $2"
    ;;
  seed)
    dc exec api node seed.js
    ;;
  update)
    new=${2:?Indique la versión nueva}
    old=$(state_get $S APP_VERSION)
    log "Actualizando $old -> $new (estrategia Recreate)"
    scripts/monitor.sh "$URL/api/version" "${3:-45}" 0.2 > "state/$S-monitor.log" &
    monitor=$!
    sleep 3
    log "1) Deteniendo y eliminando los contenedores de la versión $old"
    dc stop web api
    dc rm -f web api
    log "2) Iniciando los contenedores de la versión $new"
    state_set $S APP_VERSION "$new"
    dc up -d --wait
    log "3) Versión $new en servicio; esperando al monitor"
    wait "$monitor"
    grep -E "^[0-9]" "state/$S-monitor.log" | awk '{print $2, $3}' | uniq -c | awk '{printf "  %5d peticiones  HTTP %s  versión %s\n", $1, $2, $3}'
    tail -n 4 "state/$S-monitor.log"
    ;;
  status)
    dc ps
    curl -s "$URL/version"; curl -s "$URL/api/version"; echo
    ;;
  down)
    dc down
    ;;
  *)
    sed -n '2,8p' "$0"; exit 1
    ;;
esac
