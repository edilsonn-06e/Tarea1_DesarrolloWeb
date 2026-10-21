#!/usr/bin/env bash
# Estrategia Canary: la versión nueva recibe un porcentaje de los usuarios antes de extenderse.
#   scripts/canary.sh up 1.0.0          iniciar la versión estable (100 % del tráfico)
#   scripts/canary.sh seed              cargar productos y usuario administrador
#   scripts/canary.sh start 1.1.0 10    iniciar la versión canary con el 10 % de los usuarios
#   scripts/canary.sh weight 50         cambiar el porcentaje de usuarios en canary
#   scripts/canary.sh promote           convertir canary en la nueva versión estable
#   scripts/canary.sh abort             devolver el 100 % a estable y eliminar canary
#   scripts/canary.sh status            ver versiones y porcentaje actual
#   scripts/canary.sh down              detener y eliminar contenedores
source "$(dirname "${BASH_SOURCE[0]}")/common.sh"

S=canary
URL=http://localhost:8083
dc() { docker compose -f compose.canary.yaml --env-file .env --env-file "state/$S.env" "$@"; }
mkdir -p state/canary
touch "state/$S.env"

# Escribe la regla de reparto de usuarios y recarga Nginx sin cortar conexiones
set_weight() {
  local pct=$1
  if (( pct <= 0 )); then
    printf 'split_clients "${client_key}" $split_pool {\n    * stable;\n}\n' > state/canary/split.conf
  elif (( pct >= 100 )); then
    printf 'split_clients "${client_key}" $split_pool {\n    * canary;\n}\n' > state/canary/split.conf
  else
    printf 'split_clients "${client_key}" $split_pool {\n    %s%% canary;\n    * stable;\n}\n' "$pct" > state/canary/split.conf
  fi
  state_set $S CANARY_WEIGHT "$pct"
  if [[ -n "$(dc ps -q gateway 2>/dev/null)" ]]; then
    dc exec gateway nginx -t -q
    dc exec gateway nginx -s reload
  fi
  log "Usuarios en canary: $pct %"
}

status() {
  echo "Estable: $(state_get $S STABLE_VERSION) | Canary: $(state_get $S CANARY_VERSION) | Porcentaje canary: $(state_get $S CANARY_WEIGHT) %"
}

case "${1:-}" in
  up)
    v=${2:?Indique la versión}
    state_set $S STABLE_VERSION "$v"
    state_set $S CANARY_VERSION "$v"
    set_weight 0
    dc up -d --wait
    wait_version "$URL/api/version" "$v"
    status
    ;;
  seed)
    dc exec api-stable node seed.js
    ;;
  start)
    v=${2:?Indique la versión canary}
    state_set $S CANARY_VERSION "$v"
    log "Iniciando canary $v (todavía sin tráfico)"
    dc --profile canary up -d --wait --no-deps api-canary web-canary
    curl -s -H "X-Canary: always" "$URL/api/version"; echo
    set_weight "${3:-10}"
    status
    ;;
  weight)
    set_weight "${2:?Indique el porcentaje (0-100)}"
    ;;
  promote)
    v=$(state_get $S CANARY_VERSION)
    log "Promoviendo $v: 100 % a canary mientras se actualiza la versión estable"
    set_weight 100
    state_set $S STABLE_VERSION "$v"
    dc up -d --wait --no-deps api-stable web-stable
    wait_version "$URL/api/version" "$v"
    set_weight 0
    dc --profile canary stop api-canary web-canary
    dc --profile canary rm -f api-canary web-canary
    log "Versión estable: $v. Contenedores canary eliminados"
    status
    ;;
  abort)
    log "Cancelando canary: todo el tráfico vuelve a la versión estable"
    set_weight 0
    state_set $S CANARY_VERSION "$(state_get $S STABLE_VERSION)"
    dc --profile canary stop api-canary web-canary
    dc --profile canary rm -f api-canary web-canary
    status
    ;;
  status)
    dc --profile canary ps
    status
    ;;
  down)
    dc --profile canary down
    ;;
  *)
    sed -n '2,10p' "$0"; exit 1
    ;;
esac
