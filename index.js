/**
 * GitBot - Um bot do WhatsApp para buscar informações de repositórios do GitHub
 */
const venom = require("venom-bot");
const venomConfig = require("./config/venom-config");
const { DEFAULT_PHONE_NUMBER, ALLOWED_GROUPS } = require("./config/constants");
const {
  handleMessage,
  isGroupAllowed,
} = require("./controllers/messageController");
const messageService = require("./services/messageService");
const logger = require("./utils/logger");

/**
 * Inicializa o bot e configura os manipuladores de eventos
 */
function initializeBot() {
  logger.info("Iniciando GitBot...");

  venom
    .create(venomConfig)
    .then((client) => startBot(client))
    .catch((err) => {
      logger.error("Erro ao inicializar o bot", err);
      process.exit(1);
    });
}

/**
 * Envia uma mensagem de boas-vindas para grupos permitidos
 *
 * @param {object} client - Cliente Venom inicializado
 */
async function sendWelcomeToAllowedGroups(client) {
  try {
    for (const groupId of ALLOWED_GROUPS) {
      try {
        // Verifica se o bot está no grupo antes de enviar a mensagem
        const groupInfo = await client.getGroupMetadata(groupId);
        if (groupInfo) {
          await messageService.sendGroupWelcomeMessage(client, groupId);
          logger.success(
            `Mensagem de boas-vindas enviada para o grupo: ${
              groupInfo.name || groupId
            }`
          );
        }
      } catch (groupError) {
        logger.error(
          `Não foi possível enviar mensagem para o grupo ${groupId}`,
          groupError
        );
      }
    }
  } catch (error) {
    logger.error("Erro ao enviar mensagens de boas-vindas para grupos", error);
  }
}

/**
 * Configura o bot após a inicialização bem-sucedida
 *
 * @param {object} client - Cliente Venom inicializado
 */
async function startBot(client) {
  logger.info("Bot iniciado com sucesso!");

  try {
    // Enviar mensagem inicial para número configurado, se fornecido
    if (DEFAULT_PHONE_NUMBER && DEFAULT_PHONE_NUMBER !== "@c.us") {
      await messageService.sendWelcomeMessage(client, DEFAULT_PHONE_NUMBER);
    }

    // Enviar mensagem para grupos permitidos
    await sendWelcomeToAllowedGroups(client);

    // Configurar manipulador de mensagens
    client.onMessage(async (message) => {
      try {
        await handleMessage(client, message);
      } catch (error) {
        logger.error("Erro ao processar mensagem", error);
      }
    });

    // Configurar manipulador para quando o bot for adicionado a um grupo
    client.onAddedToGroup(async (chatEvent) => {
      const groupId = chatEvent.id;
      logger.info(
        `Bot adicionado ao grupo: ${chatEvent.formattedTitle} (${groupId})`
      );

      // Se for um grupo permitido, envia mensagem de boas-vindas
      if (isGroupAllowed(groupId)) {
        await messageService.sendGroupWelcomeMessage(client, groupId);
      } else {
        logger.info(
          `Grupo ${groupId} não está na lista de permitidos. Considere adicionar à configuração.`
        );
      }
    });

    // Configurar manipulador de desconexão
    client.onStateChange((state) => {
      if (state === "CONFLICT" || state === "UNLAUNCHED") {
        client.useHere();
      }
    });

    // Configurar manipulador de QR code
    client.onQR((qrCode) => {
      logger.info("Novo QR Code recebido. Escaneie para autenticar.");
    });

    // Configurar manipulador de erro
    client.onError((error) => {
      logger.error("Erro no cliente Venom", error);
    });

    // Configurar limpeza na saída
    setupCleanup(client);
  } catch (error) {
    logger.error("Erro ao configurar o bot", error);
  }
}

/**
 * Configura o encerramento adequado do bot
 *
 * @param {object} client - Cliente Venom
 */
function setupCleanup(client) {
  const cleanup = async () => {
    logger.info("Encerrando bot...");

    try {
      await client.close();
      logger.info("Bot encerrado com sucesso!");
    } catch (error) {
      logger.error("Erro ao encerrar o bot", error);
    }

    process.exit(0);
  };

  // Captura sinais de encerramento
  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);
  process.on("SIGHUP", cleanup);
}

// Iniciar o bot
initializeBot();
