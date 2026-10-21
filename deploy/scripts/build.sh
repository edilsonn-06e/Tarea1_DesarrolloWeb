#!/usr/bin/env bash
# Construye las imágenes del frontend y de la API con la etiqueta indicada.
# Uso: scripts/build.sh 1.0.0
set -euo pipefail

VERSION=${1:?Uso: build.sh <version>   (ejemplo: build.sh 1.0.0)}
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

echo "==> Construyendo edis-store-api:$VERSION"
docker build -t "edis-store-api:$VERSION" --build-arg "APP_VERSION=$VERSION" "$ROOT/server"

echo "==> Construyendo edis-store-web:$VERSION"
docker build -t "edis-store-web:$VERSION" --build-arg "APP_VERSION=$VERSION" "$ROOT"

docker image ls --filter "reference=edis-store-*:$VERSION"
