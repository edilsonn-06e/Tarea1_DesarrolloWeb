# Tarea 6 — Estrategias de despliegue con Docker

Implementación reproducible de tres estrategias de despliegue para Edi's Store
(frontend React + API Express de las Tareas 4 y 5). El manual técnico completo
documenta el funcionamiento, la configuración, las evidencias y la comparación.

| Estrategia | Compose | URL | Script |
|---|---|---|---|
| Recreate | `compose.recreate.yaml` | http://localhost:8080 | `scripts/recreate.sh` |
| Blue-Green | `compose.bluegreen.yaml` | http://localhost:8081 (verificación: 8082) | `scripts/bluegreen.sh` |
| Canary | `compose.canary.yaml` | http://localhost:8083 | `scripts/canary.sh` |

## Requisitos

- Docker Engine con el plugin Docker Compose (probado con Docker 29.8.2 y Compose v5.5.1)
- Bash y curl (en Windows: Git Bash)
- Puertos 8080 a 8083 libres

## Inicio rápido

```bash
cd deploy
cp .env.example .env          # completar credenciales (no se suben a Git)
scripts/build.sh 1.0.0        # edis-store-api:1.0.0 y edis-store-web:1.0.0
scripts/build.sh 1.1.0

# Recreate
scripts/recreate.sh up 1.0.0 && scripts/recreate.sh seed
scripts/recreate.sh update 1.1.0      # mide la indisponibilidad
scripts/recreate.sh down

# Blue-Green
scripts/bluegreen.sh up 1.0.0 && scripts/bluegreen.sh seed
scripts/bluegreen.sh deploy 1.1.0     # publica en el entorno inactivo
scripts/verify.sh http://localhost:8082
scripts/bluegreen.sh switch           # o: scripts/bluegreen.sh rollback
scripts/bluegreen.sh down

# Canary
scripts/canary.sh up 1.0.0 && scripts/canary.sh seed
scripts/canary.sh start 1.1.0 10      # 10 % de los usuarios
scripts/traffic.sh http://localhost:8083/api/version 200
scripts/canary.sh weight 50
scripts/canary.sh promote             # o: scripts/canary.sh abort
scripts/canary.sh down
```

## Herramientas de verificación

- `scripts/verify.sh <url>`: 7 pruebas funcionales (React, React Router, salud, catálogo, login JWT, ruta protegida con y sin token).
- `scripts/monitor.sh <url>/api/version <segundos>`: registra código HTTP y versión de cada respuesta y calcula la ventana sin servicio.
- `scripts/traffic.sh <url>/api/version <n>`: simula n usuarios nuevos y muestra el reparto entre versiones.
- Cada respuesta incluye `X-App-Version` y `X-Deploy-Slot`; el pie de página muestra la versión.

## Evidencias

`evidencias/` contiene las salidas reales de la ejecución del 20/10/2026:

| Archivo | Contenido |
|---|---|
| `00-imagenes.txt` | Imágenes construidas con sus etiquetas |
| `01`–`03` | Recreate: verificación 1.0.0, actualización con monitor, verificación 1.1.0 |
| `04`–`06` | Blue-Green: inicio, deploy/switch/rollback, monitor (0 fallos) |
| `07`–`09` | Canary: inicio, reparto 10/50/25 %, abort, promote, monitor (0 fallos) |

## Credenciales

`deploy/.env` y `deploy/state/` están en `.gitignore`. Los Dockerfile y los archivos
de Compose no contienen contraseñas ni claves: se reciben como variables de entorno.
