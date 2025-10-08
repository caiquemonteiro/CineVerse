FROM python:3.12-slim

RUN apt-get update && apt-get install -y netcat-openbsd mariadb-client && rm -rf /var/lib/apt/lists/*


# Cria diretório de trabalho
WORKDIR /app

# Instala dependências
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia o código
COPY ./app ./app

# Comando de inicialização
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
