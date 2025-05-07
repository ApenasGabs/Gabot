# Usa uma imagem leve do Node.js
FROM node:20-slim

# Impede prompts durante instalação de pacotes
ENV DEBIAN_FRONTEND=noninteractive

# Instala apenas as dependências essenciais
RUN apt-get update && apt-get install -y \
    # python3 \
    # python3-pip \
    # build-essential \
    chromium \
    --no-install-recommends && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Define o diretório de trabalho
WORKDIR /app

# Copia apenas os arquivos de dependência primeiro
COPY package*.json ./

# Instala as dependências da aplicação
RUN npm ci --only=production

# Copia o restante dos arquivos
COPY . .

# Variáveis de ambiente para o Puppeteer/Venom
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Expõe a porta para o servidor HTTP (ping)
EXPOSE 3000

# Comando para rodar o bot
CMD ["npm", "start"]
