#!/usr/bin/env bash
# Funciones compartidas por los scripts de despliegue.
set -euo pipefail

# Git Bash en Windows convierte rutas como /etc/nginx; se desactiva esa conversión
export MSYS_NO_PATHCONV=1

DEPLOY_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$DEPLOY_DIR"

if [[ ! -f .env ]]; then
  echo "Falta deploy/.env. Créelo a partir de deploy/.env.example" >&2
  exit 1
fi

mkdir -p state

log() { printf '[%s] %s\n' "$(date +%H:%M:%S)" "$*"; }

# Lee una variable del archivo de estado de la estrategia (state/<estrategia>.env)
state_get() { grep -E "^$2=" "state/$1.env" 2>/dev/null | tail -1 | cut -d= -f2; }

# Escribe o reemplaza una variable en el archivo de estado
state_set() {
  local file="state/$1.env"
  touch "$file"
  grep -vE "^$2=" "$file" > "$file.tmp" || true
  echo "$2=$3" >> "$file.tmp"
  mv "$file.tmp" "$file"
}

# Extrae el campo "version" de una respuesta JSON
json_version() { sed -n 's/.*"version":"\([^"]*\)".*/\1/p'; }

# Espera hasta que una URL devuelva la versión indicada
wait_version() {
  local url=$1 expected=$2 tries=${3:-60}
  for ((i = 0; i < tries; i++)); do
    if [[ "$(curl -s --max-time 2 "$url" | json_version)" == "$expected" ]]; then
      return 0
    fi
    sleep 1
  done
  echo "La URL $url no respondió con la versión $expected" >&2
  return 1
}
