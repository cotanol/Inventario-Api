#!/bin/bash
# Detener el script si hay algún error (Muy importante)
set -e

BRANCH="master"
SERVICE="inventario-api"

echo "Desplegando Inventario API..."

echo "Actualizando código..."
git pull origin "$BRANCH"

echo "Reconstruyendo contenedor..."
docker compose up -d --build "$SERVICE"

echo "Limpiando imágenes antiguas..."
docker image prune -f

echo "Despliegue completado!"
echo "Ver logs: docker compose logs -f $SERVICE"
