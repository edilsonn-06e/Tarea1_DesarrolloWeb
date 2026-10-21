#!/usr/bin/env bash
# Consulta una URL de forma continua y registra el código HTTP y la versión que responde.
# Al terminar resume cuántas peticiones fallaron y la duración de la indisponibilidad.
# Uso: scripts/monitor.sh http://localhost:8080/api/version 40 0.2
set -uo pipefail

URL=${1:?Uso: monitor.sh <url> [segundos] [intervalo]}
DURATION=${2:-30}
INTERVAL=${3:-0.2}

total=0; ok=0; fail=0
first_fail=""; last_fail=""
declare -A versions=()
end=$(( $(date +%s) + DURATION ))

printf '%-12s %-6s %s\n' "HORA" "HTTP" "VERSION"
while (( $(date +%s) < end )); do
  now_ms=$(date +%s%3N)
  body=$(curl -s --max-time 1 -w '\n%{http_code}' "$URL")
  code=${body##*$'\n'}
  version=$(printf '%s' "${body%$'\n'*}" | sed -n 's/.*"version":"\([^"]*\)".*/\1/p')
  total=$((total + 1))
  if [[ "$code" == "200" && -n "$version" ]]; then
    ok=$((ok + 1)); versions[$version]=$(( ${versions[$version]:-0} + 1 ))
  else
    fail=$((fail + 1)); version="-"
    [[ -z "$first_fail" ]] && first_fail=$now_ms
    last_fail=$now_ms
  fi
  printf '%-12s %-6s %s\n' "$(date +%H:%M:%S.%3N)" "$code" "$version"
  sleep "$INTERVAL"
done

echo "------------------------------------------------------------"
echo "Peticiones: $total | correctas: $ok | fallidas: $fail"
for v in "${!versions[@]}"; do echo "  versión $v: ${versions[$v]} respuestas"; done
if (( fail > 0 )); then
  echo "Ventana de indisponibilidad: $(( last_fail - first_fail )) ms (primer fallo a último fallo)"
else
  echo "Sin indisponibilidad detectada"
fi
