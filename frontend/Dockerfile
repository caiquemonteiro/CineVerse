FROM node:20

# Cria diretório de trabalho
WORKDIR /app

# Instala dependências
COPY package*.json ./
RUN npm install

# Copia o restante do código
COPY . .

# Comando para rodar o servidor de dev
CMD ["npm", "run", "dev", "--", "--host"]
