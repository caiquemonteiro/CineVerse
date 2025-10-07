#!/bin/bash
set -e

# Configurações do banco
host="db"
port="3306"
user="cine"
password="senha"
database="login"

echo "⏳ Aguardando banco de dados MySQL em $host:$port..."

# 1️⃣ Espera a porta TCP do MySQL abrir
until nc -z "$host" "$port"; do
  echo "🔁 Porta $port ainda não aberta, aguardando..."
  sleep 1
done

echo "✅ Porta $port aberta!"

# 2️⃣ Espera o MySQL aceitar login e o banco existir
until mysql -h "$host" -P "$port" -u"$user" -p"$password" --ssl=0 -e "USE $database;" > /dev/null 2>mysql-error.log; do
  echo "🔁 Banco ainda inicializando, tentando novamente..."
  tail -n 2 mysql-error.log
  sleep 3
done

echo "✅ Banco de dados pronto! Iniciando aplicação..."

# 3️⃣ Executa o comando passado para o container (UVicorn)
exec "$@"
