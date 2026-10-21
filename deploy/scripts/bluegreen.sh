#!/usr/bin/env bash
# Estrategia Blue-Green: dos entornos completos y un gateway que decide cuál recibe el tráfico.
#   scripts/bluegreen.sh up 1.0.0       iniciar blue y green con la versión indicada (activo: blue)
#   scripts/bluegreen.sh seed           cargar productos y usuario administrador
#   scripts/bluegreen.sh deploy 1.1.0   publicar la versión en el entorno INACTIVO (sin tráfico)
#   scripts/bluegreen.sh switch         enviar el tráfico al otro entorno (recarga de Nginx)
#   scripts/bluegreen.sh rollback       regresar al entorno anterior (equivale a switch)
#   scripts/bluegreen.sh status         ver entorno activo y versiones
#   scripts/bluegreen.sh down           detener y eliminar contenedores
source "$(dirname "${BASH_SOURCE[0]}")/common.sh"

S=bluegreen
URL=http://localhost:8081
PREVIEW=http://localhost:8082
dc() { docker compose -f compose.bluegreen.yaml --env-file .env --env-file "state/$S.env" "$@"; }
mkdir -p state/bluegreen
touch "state/$S.env"

active() { sed -n 's/^set \$active_slot \([a-z]*\);/\1/p' state/bluegreen/active.conf 2>/dev/null || true; }
other() { [[ "$1" == "blue" ]] && echo green || echo blue; }
slot_var() { echo "$(tr '[:lower:]' '[:upper:]' <<< "$1")_VERSION"; }

set_active() {
  echo "set \$active_slot $1;" > state/bluegreen/active.conf
  dc exec gateway nginx -t -q
  dc exec gateway nginx -s reload
}

status() {
  local a; a=$(active); a=${a:-blue}
  echo "Entorno activo: $a ($(state_get $S "$(slot_var "$a")"))   inactivo: $(other "$a") ($(state_get $S "$(slot_var "$(other "$a")")"))"
  echo -n "  $URL/api/version     -> "; curl -s "$URL/api/version"; echo
  echo -n "  $PREVIEW/api/version -> "; curl -s "$PREVIEW/api/version"; echo
}

case "${1:-}" in
  up)
    v=${2:?Indique la versión}
    state_set $S BLUE_VERSION "$v"
    state_set $S GREEN_VERSION "$v"
    echo 'set $active_slot blue;' > state/bluegreen/active.conf
    dc up -d --wait
    wait_version "$URL/api/version" "$v"
    status
    ;;
  seed)
    dc exec api-blue node seed.js
    ;;
  deploy)
    v=${2:?Indique la versión nueva}
    a=$(active); a=${a:-blue}; target=$(other "$a")
    log "Entorno activo: $a. Publicando $v en $target (sin tráfico de usuarios)"
    state_set $S "$(slot_var "$target")" "$v"
    dc up -d --wait --no-deps "api-$target" "web-$target"
    wait_version "$PREVIEW/api/version" "$v"
    log "Versión $v lista en $target. Verifique en $PREVIEW y ejecute: scripts/bluegreen.sh switch"
    status
    ;;
  switch|rollback)
    a=$(active); a=${a:-blue}; target=$(other "$a")
    log "Cambiando el tráfico: $a -> $target"
    set_active "$target"
    wait_version "$URL/api/version" "$(state_get $S "$(slot_var "$target")")"
    log "Tráfico en $target. El entorno $a sigue encendido para un rollback inmediato"
    status
    ;;
  status)
    dc ps
    status
    ;;
  down)
    dc down
    ;;
  *)
    sed -n '2,9p' "$0"; exit 1
    ;;
esac
