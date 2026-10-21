#!/usr/bin/env bash
# Pruebas funcionales de un despliegue: versión, salud, catálogo, login JWT y ruta protegida.
# Uso: scripts/verify.sh http://localhost:8080
source "$(dirname "${BASH_SOURCE[0]}")/common.sh"
set -a; source .env; set +a

URL=${1:?Uso: verify.sh <url-base>}
pass=0; failn=0
check() { if [[ "$2" == "$3" ]]; then echo "  [OK]    $1 ($2)"; pass=$((pass+1)); else echo "  [FALLA] $1 (esperado $3, obtenido $2)"; failn=$((failn+1)); fi; }
code() { curl -s -o /dev/null -w '%{http_code}' "$@"; }

echo "Verificando $URL"
echo "  Frontend: $(curl -s "$URL/version")"
echo "  API:      $(curl -s "$URL/api/version")"
check "GET /                      página React" "$(code "$URL/")" 200
check "GET /productos             ruta de React Router" "$(code "$URL/productos")" 200
check "GET /api/health            salud de la API" "$(code "$URL/api/health")" 200
check "GET /api/recursos          catálogo (productos)" "$(curl -s "$URL/api/recursos" | grep -o '"codigo"' | wc -l | tr -d ' ')" 5
login=$(curl -s -X POST "$URL/api/auth/login" -H 'Content-Type: application/json' \
  -d "{\"correo\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\"}")
token=$(sed -n 's/.*"token":"\([^"]*\)".*/\1/p' <<< "$login")
id=$(sed -n 's/.*"id":"\([^"]*\)".*/\1/p' <<< "$login")
check "POST /api/auth/login       emite JWT" "$([[ -n "$token" ]] && echo si || echo no)" si
check "GET /api/users/:id         con token" "$(code -H "Authorization: Bearer $token" "$URL/api/users/$id")" 200
check "GET /api/users/:id         sin token" "$(code "$URL/api/users/$id")" 401
echo "Resultado: $pass correctas, $failn fallidas"
(( failn == 0 ))
