const venom = require('venom-bot');
const { getRepositoryInfo } = require('./github-api');

const PHONE_NUMBER = '@c.us';

// Inicialização do bot com configurações melhoradas
venom
  .create({
    session: 'gabot-session',
    headless: true, // Alterado para true para evitar problemas de interface
    logQR: true, // Mostra o QR code no terminal
    useChrome: true, // Força o uso do Chrome em vez de Chromium
    browserArgs: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process',
      '--disable-gpu'
    ],
    disableWelcome: true, // Desabilita a mensagem de boas-vindas
    autoClose: 60000, // Fecha automaticamente após 60 segundos se não for escaneado
    debug: false
  })
  .then((client) => start(client))
  .catch((err) => {
    console.error('Erro ao inicializar:', err);
  });

// Função principal do bot
async function start(client) {
  console.log('Bot iniciado! Enviando mensagem inicial...');

  try {
    // Envia uma mensagem inicial para o número especificado
    await client.sendText(
      PHONE_NUMBER,
      'Olá! Sou o GitBot 🤖\n\n' +
      'Envie o nome de um repositório no formato "usuario/repositorio" ' +
      'e eu buscarei informações sobre ele no GitHub!'
    );
  } catch (error) {
    console.error('Erro ao enviar mensagem inicial:', error);
  }

  // Escuta por mensagens recebidas
  client.onMessage(async (message) => {
    // Ignorar mensagens de grupos
    if (message.isGroupMsg) return;

    console.log('Mensagem recebida:', message.body);

    // Verificar se o formato da mensagem parece ser um repositório GitHub
    const repoPattern = /^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/;
    if (repoPattern.test(message.body)) {
      // Enviar uma mensagem de espera
      await client.sendText(
        message.from,
        '🔍 Buscando informações do repositório...'
      );

      try {
        // Buscar informações do repositório
        const repoInfo = await getRepositoryInfo(message.body);

        // Enviar mensagem formatada com as informações
        await client.sendText(message.from, repoInfo);
      } catch (error) {
        console.error('Erro ao buscar informações:', error);
        await client.sendText(
          message.from,
          '❌ Não foi possível encontrar informações sobre este repositório.\n' +
          'Verifique se o formato está correto (usuário/repositório) e tente novamente.'
        );
      }
    } else {
      await client.sendText(
        message.from,
        'Por favor, envie o nome do repositório no formato "usuario/repositorio".\n' +
        'Por exemplo: "orkestral/venom"'
      );
    }
  });

  // Função para lidar com o fechamento do programa
  process.on('SIGINT', () => {
    console.log('Encerrando bot...');
    client.close();
    process.exit();
  });
}
