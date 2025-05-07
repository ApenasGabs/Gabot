# GaBot - GitHub WhatsApp Bot

Bot de WhatsApp que utiliza a biblioteca Venom-Bot para buscar e enviar informações sobre repositórios do GitHub.

## Funcionalidades

- Conexão com WhatsApp usando o Venom-Bot
- Integração com a API do GitHub para busca de repositórios
- Envio de mensagens formatadas com informações detalhadas
- Sistema anti-spam para evitar mensagens duplicadas
- Suporte para múltiplos idiomas
- Controle de estado da conversa para melhor interação

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

## Estrutura do Projeto

O projeto está organizado seguindo uma arquitetura modular:

```
📁 projeto/
├── 📁 config/
│   ├── venom-config.js       // Configurações do Venom
│   └── constants.js          // Constantes do projeto
│
├── 📁 controllers/
│   ├── messageController.js  // Lógica de tratamento de mensagens
│   └── stateController.js    // Gerenciamento de estados da conversa
│
├── 📁 services/
│   ├── githubService.js      // Serviço de API do GitHub
│   └── messageService.js     // Serviços auxiliares de mensagens
│
├── 📁 conversation/
│   ├── flowStates.js         // Estados da conversa
│   ├── decisionTree.js       // Árvore de decisão das conversas
│   └── responses/            // Mensagens pré-definidas
│       ├── pt-BR.json        
│       └── en-US.json        
│
├── 📁 utils/
│   ├── helpers.js            // Funções utilitárias
│   ├── logger.js             // Sistema de logs
│   └── antiSpam.js           // Controle de spam
│
├── 📁 models/
│   └── UserSession.js        // Modelo para sessões de usuário
│
└── index.js                  // Ponto de entrada principal
```

### Descrição dos Componentes

#### Config

- **venom-config.js**: Configurações para inicialização do Venom Bot.
- **constants.js**: Constantes utilizadas em todo o projeto, como padrões de validação e tempos de espera.

#### Controllers

- **messageController.js**: Processa mensagens recebidas e coordena as respostas.
- **stateController.js**: Gerencia o estado da conversa para cada usuário.

#### Services

- **githubService.js**: Integração com a API do GitHub para buscar informações de repositórios.
- **messageService.js**: Serviços para envio de mensagens formatadas.

#### Conversation

- **flowStates.js**: Define os diferentes estados possíveis em uma conversa.
- **decisionTree.js**: Lógica de decisão para determinar o próximo estado com base na entrada do usuário.
- **responses/**: Mensagens pré-definidas em diferentes idiomas.

#### Utils

- **helpers.js**: Funções utilitárias como formatação de data e números.
- **logger.js**: Sistema de log para monitoramento da aplicação.
- **antiSpam.js**: Controle para evitar spam e mensagens duplicadas.

#### Models

- **UserSession.js**: Modelo de dados que representa uma sessão de usuário.

## Tecnologias

- Node.js
- Venom-Bot
- Axios para requisições HTTP

## Configuração

O bot está configurado para enviar uma mensagem inicial para o número configurado em `DEFAULT_PHONE_NUMBER` no arquivo `config/constants.js`. Você pode modificar esse número conforme necessário.

## Observações

- Para encerrar o bot corretamente, pressione CTRL+C no terminal.
- A sessão do WhatsApp Web é salva na pasta `tokens/` para que você não precise escanear o QR code novamente.
- O sistema de logging mostra informações detalhadas sobre mensagens recebidas e enviadas.
- O sistema anti-spam previne que mensagens vazias ou duplicadas sejam processadas.
