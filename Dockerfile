# Etapa 1: Construção
FROM node:18-alpine AS builder

# Definir o diretório de trabalho
WORKDIR /app

# Copiar apenas os arquivos necessários para instalar as dependências
COPY package*.json ./

# Instalar dependências (incluindo devDependencies para compilar o TypeScript)
RUN npm install

# Copiar o restante do código para dentro do container
COPY . .

# Compilar o TypeScript
RUN npm run build

# Etapa 2: Produção
FROM node:18-alpine AS production

# Definir o diretório de trabalho
WORKDIR /app

# Copiar apenas as dependências de produção da etapa de construção
COPY --from=builder /app/node_modules ./node_modules

# Copiar os arquivos compilados da etapa de construção
COPY --from=builder /app/dist ./dist

# Copiar o arquivo .env, se necessário
COPY .env ./

# Expor a porta usada pela aplicação
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "run", "start"]
