# Usa uma imagem leve do Node.js
FROM node:20-slim

# Impede prompts durante instalação de pacotes
ENV DEBIAN_FRONTEND=noninteractive

# Instala dependências necessárias para rodar o Chromium
RUN apt-get update && apt-get install -y \
  ca-certificates \
  fonts-liberation \
  libappindicator3-1 \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libcups2 \
  libdbus-1-3 \
  libgdk-pixbuf2.0-0 \
  libnspr4 \
  libnss3 \
  libx11-xcb1 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  xdg-utils \
  chromium \
  --no-install-recommends && \
  apt-get clean && rm -rf /var/lib/apt/lists/*

# Define o diretório de trabalho
WORKDIR /app

# Copia apenas os arquivos de dependência primeiro
COPY package*.json ./

# Instala as dependências da aplicação
RUN npm ci

# Copia o restante dos arquivos
COPY . .

# Variáveis de ambiente para o Puppeteer/Venom
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Expõe a porta para o servidor HTTP (ping)
EXPOSE 3000

# Comando para rodar o bot
CMD ["npm", "start"]
