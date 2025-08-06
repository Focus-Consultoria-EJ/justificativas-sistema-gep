#!/bin/bash

# Caminho para o arquivo de backup .dump
BACKUP_FILE="./latest.dump"

# Nome do banco de dados
DB_NAME="db_focus"

# Nome do container PostgreSQL
CONTAINER_NAME="gep_backend_db"

# Restaura o backup no banco de dados
docker exec -i $CONTAINER_NAME pg_restore -U postgres -d $DB_NAME < $BACKUP_FILE

echo "Backup restaurado com sucesso!"
