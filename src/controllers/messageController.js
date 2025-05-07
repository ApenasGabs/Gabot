/**
 * Controlador para processamento de mensagens
 */
const { ALLOWED_GROUPS, DEFAULT_MESSAGES } = require("../config/constants");
const { getRepositoryInfo } = require("../services/githubService");
const messageService = require("../services/messageService");
const intentService = require("../services/intentService");
const {
  shouldIgnoreMessage,
  updateMessageControl,
} = require("../utils/antiSpam");
const logger = require("../utils/logger");
const stateController = require("./stateController");

// Armazena o estado de busca por usuário
const userSearchState = new Map();

/**
 * Verifica se o grupo é permitido
 * @param {string} groupId - ID do grupo
 * @returns {boolean} - Verdadeiro se o grupo estiver na lista de permitidos
 */
function isGroupAllowed(groupId) {
  return ALLOWED_GROUPS.includes(groupId);
}

/**
 * Mostra o menu do bot
 * @param {object} client - Cliente Venom
 * @param {object} message - Objeto de mensagem do Venom
 */
async function showMenu(client, message) {
  await messageService.sendMessage(client, message.from, DEFAULT_MESSAGES.menu);
}

/**
 * Mostra a ajuda do bot
 * @param {object} client - Cliente Venom
 * @param {object} message - Objeto de mensagem do Venom
 */
async function showHelp(client, message) {
  await messageService.sendMessage(client, message.from, DEFAULT_MESSAGES.help);
}

/**
 * Mostra informações sobre o bot
 * @param {object} client - Cliente Venom
 * @param {object} message - Objeto de mensagem do Venom
 */
async function showAbout(client, message) {
  await messageService.sendMessage(client, message.from, DEFAULT_MESSAGES.about);
}

/**
 * Processa uma mensagem recebida e retorna uma resposta adequada
 *
 * @param {object} client - Cliente Venom
 * @param {object} message - Objeto de mensagem do Venom
 */
async function handleMessage(client, message) {
  try {
    // Registra a mensagem recebida
    logger.logReceivedMessage(message);

    // Verificar se é mensagem de grupo
    if (message.isGroupMsg) {
      // Se for um grupo permitido, processa a mensagem
      if (isGroupAllowed(message.from)) {
        logger.info(`Processando mensagem do grupo permitido: ${message.from}`);
      } else {
        // Se não for um grupo permitido, ignora
        logger.logIgnoredMessage("veio de um grupo não permitido");
        return;
      }
    }

    // Verifica se a mensagem tem corpo
    if (!message.body && message.type !== 'sticker') {
      logger.logIgnoredMessage("mensagem sem corpo");
      return;
    }

    // Verificar controle anti-spam apenas se não estiver em estado de busca
    if (!userSearchState.get(message.from) && shouldIgnoreMessage(message.from, message.body || '')) {
      logger.logIgnoredMessage(
        !message.body ? "conteúdo vazio" : "cooldown ou duplicada",
        message.from
      );
      return;
    }

    // Atualiza controle de mensagens
    updateMessageControl(message.from, message.body || '');

    // Detecta a intenção da mensagem
    const intent = message.body ? intentService.detectIntent(message.body) : 'unknown';

    // Processa a intenção detectada
    switch (intent) {
      case "menu":
        await showMenu(client, message);
        break;
      case "help":
        await showHelp(client, message);
        break;
      case "about":
        await showAbout(client, message);
        break;
      case "emoji":
        try {
          const response = intentService.getResponse(message.body);
          await messageService.sendMessage(client, message.from, response);
        } catch (error) {
          logger.error("Erro ao processar emoji", error);
          await messageService.sendMessage(client, message.from, "Desculpe, tive um problema ao processar o emoji 😅");
        }
        break;
      case "greeting":
      case "farewell":
        await messageService.sendMessage(client, message.from, intentService.getRandomResponse(intent));
        break;
      case "searching":
        await handleRepositoryRequest(client, message);
        break;
      default:
        await messageService.sendMessage(client, message.from, intentService.getRandomResponse("invalid_format"));
    }
  } catch (error) {
    logger.error("Erro ao processar mensagem:", error);
    await messageService.sendMessage(client, message.from, "Desculpe, ocorreu um erro ao processar sua mensagem 😅");
  }
}

/**
 * Processa uma solicitação de informações de repositório
 *
 * @param {object} client - Cliente Venom
 * @param {object} message - Objeto de mensagem do Venom
 */
async function handleRepositoryRequest(client, message) {
  const repoPath = message.body;
  logger.info(`Buscando informações para o repositório: ${repoPath}`);

  try {
    // Atualiza o estado do usuário
    stateController.setUserState(
      message.from,
      stateController.STATE.SEARCHING,
      { repoPath }
    );

    // Envia uma mensagem de espera
    await messageService.sendMessage(client, message.from, intentService.getRandomResponse("searching"));

    // Busca informações do repositório
    const repoInfo = await getRepositoryInfo(repoPath);

    // Envia a resposta
    logger.info(`Enviando informações do repositório: ${repoPath}`);
    await messageService.sendMessage(client, message.from, repoInfo);

    // Atualiza o estado do usuário
    stateController.setUserState(message.from, stateController.STATE.INITIAL);
  } catch (error) {
    logger.error(`Erro ao buscar informações para ${repoPath}`, error);
    
    let errorMessage = intentService.getRandomResponse("not_found");
    if (error.message.includes("Timeout")) {
      errorMessage = "Desculpe, demorei muito para buscar as informações 😅\nTente novamente em alguns segundos.";
    }

    await messageService.sendMessage(client, message.from, errorMessage);

    // Atualiza o estado do usuário para erro
    stateController.setUserState(message.from, stateController.STATE.ERROR, {
      error: error.message,
    });
  }
}

module.exports = {
  handleMessage,
  handleRepositoryRequest,
  isGroupAllowed,
};
