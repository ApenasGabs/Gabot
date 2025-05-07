/**
 * Controlador para processamento de mensagens
 */
const { GITHUB_REPO_PATTERN, ALLOWED_GROUPS, DEFAULT_MESSAGES } = require("../config/constants");
const { getRepositoryInfo } = require("../services/githubService");
const messageService = require("../services/messageService");
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
 * Mostra o menu de opções do bot
 * @param {object} client - Cliente Venom
 * @param {object} message - Objeto de mensagem do Venom
 */
async function showMenu(client, message) {
  // Limpa o estado de busca ao mostrar o menu
  userSearchState.delete(message.from);
  await messageService.sendMessage(client, message.from, DEFAULT_MESSAGES.menu);
}

/**
 * Mostra a mensagem de ajuda
 * @param {object} client - Cliente Venom
 * @param {object} message - Objeto de mensagem do Venom
 */
async function showHelp(client, message) {
  // Limpa o estado de busca ao mostrar a ajuda
  userSearchState.delete(message.from);
  await messageService.sendMessage(client, message.from, DEFAULT_MESSAGES.help);
}

/**
 * Mostra informações sobre o bot
 * @param {object} client - Cliente Venom
 * @param {object} message - Objeto de mensagem do Venom
 */
async function showAbout(client, message) {
  // Limpa o estado de busca ao mostrar informações
  userSearchState.delete(message.from);
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

    // Verificar controle anti-spam
    if (shouldIgnoreMessage(message.from, message.body)) {
      logger.logIgnoredMessage(
        message.body.trim() === "" ? "conteúdo vazio" : "cooldown ou duplicada",
        message.from
      );
      return;
    }

    // Atualiza controle de mensagens
    updateMessageControl(message.from, message.body);

    // Verifica se a mensagem contém "gabot"
    if (message.body.toLowerCase().includes("gabot")) {
      await showMenu(client, message);
      return;
    }

    // Verifica se o usuário está em estado de busca
    if (userSearchState.get(message.from)) {
      // Se estiver em estado de busca, tenta processar como repositório
      if (GITHUB_REPO_PATTERN.test(message.body)) {
        await handleRepositoryRequest(client, message);
        userSearchState.delete(message.from); // Limpa o estado após a busca
      } else {
        await messageService.sendMessage(client, message.from, DEFAULT_MESSAGES.invalidFormat);
      }
      return;
    }

    // Processa opções do menu
    const menuOption = message.body.trim();
    if (menuOption === "1") {
      userSearchState.set(message.from, true); // Ativa o estado de busca
      await messageService.sendMessage(client, message.from, "Digite o nome do repositório no formato 'usuario/repositorio'");
      return;
    } else if (menuOption === "2") {
      await showHelp(client, message);
      return;
    } else if (menuOption === "3") {
      await showAbout(client, message);
      return;
    }

    // Se não estiver em nenhum estado especial, verifica se é um repositório
    if (GITHUB_REPO_PATTERN.test(message.body)) {
      await handleRepositoryRequest(client, message);
    } else {
      await handleInvalidFormat(client, message);
    }
  } catch (error) {
    logger.error("Erro ao processar mensagem", error);
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
    await messageService.sendSearchingMessage(client, message.from);

    // Busca informações do repositório
    const repoInfo = await getRepositoryInfo(repoPath);

    // Envia a resposta
    logger.info(`Enviando informações do repositório: ${repoPath}`);
    await messageService.sendMessage(client, message.from, repoInfo);

    // Atualiza o estado do usuário
    stateController.setUserState(message.from, stateController.STATE.INITIAL);
  } catch (error) {
    logger.error(`Erro ao buscar informações para ${repoPath}`, error);
    await messageService.sendNotFoundMessage(client, message.from);

    // Atualiza o estado do usuário para erro
    stateController.setUserState(message.from, stateController.STATE.ERROR, {
      error: error.message,
    });
  }
}

/**
 * Processa mensagens com formato inválido
 *
 * @param {object} client - Cliente Venom
 * @param {object} message - Objeto de mensagem do Venom
 */
async function handleInvalidFormat(client, message) {
  logger.info(`Formato inválido de repositório: ${message.body}`);

  // Atualiza o estado do usuário
  stateController.setUserState(
    message.from,
    stateController.STATE.WAITING_REPO
  );

  await messageService.sendInvalidFormatMessage(client, message.from);
}

module.exports = {
  handleMessage,
  handleRepositoryRequest,
  handleInvalidFormat,
  isGroupAllowed,
};
