# GaBot - GitHub WhatsApp Bot

Bot de WhatsApp que utiliza a biblioteca Venom-Bot para buscar e enviar informações sobre repositórios do GitHub.

## Funcionalidades

- Conexão com WhatsApp usando o Venom-Bot
- Integração com a API do GitHub para busca de repositórios
- Envio de mensagens formatadas com informações detalhadas

## Como usar

1. Instale as dependências:

```bash
npm install
```

2. Inicie o bot:

```bash
npm start
```

3. Escaneie o código QR que aparecerá no terminal com seu WhatsApp

4. Envie mensagens para o bot no formato "usuario/repositorio" para receber informações.

## Tecnologias

- Node.js
- Venom-Bot (v2.0.2)
- Axios para requisições HTTP

## Configuração

O bot está configurado para enviar uma mensagem inicial para o número configurado em `PHONE_NUMBER` no arquivo `index.js`. Você pode modificar esse número conforme necessário.

## Observações

- Para encerrar o bot corretamente, pressione CTRL+C no terminal.
- A sessão do WhatsApp Web é salva para que você não precise escanear o QR code novamente.
