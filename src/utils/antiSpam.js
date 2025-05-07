/**
 * Sistema de controle de spam
 */
const {
  COOLDOWN_PERIOD,
  DUPLICATE_MESSAGE_TIMEOUT,
} = require("../config/constants");

// Armazenamento de controle de mensagens
const messageStore = {
  lastResponses: {}, // Armazena o timestamp da última resposta para cada número
  lastMessageContent: {}, // Armazena o conteúdo da última mensagem para cada número
};

/**
 * Verifica se uma mensagem deve ser ignorada (spam ou duplicada)
 *
 * @param {string} sender - ID do remetente
 * @param {string} content - Conteúdo da mensagem
 * @returns {boolean} - true se a mensagem deve ser ignorada
 */
function shouldIgnoreMessage(sender, content) {
  // Ignorar mensagens vazias ou apenas com espaços em branco
  if (!content || content.trim() === "") {
    return true;
  }

  const currentTime = Date.now();
  const lastResponse = messageStore.lastResponses[sender] || 0;
  const lastContent = messageStore.lastMessageContent[sender] || "";

  // Se a mensagem for igual à anterior ou estiver dentro do período de cooldown, ignore
  if (
    (content === lastContent &&
      currentTime - lastResponse < DUPLICATE_MESSAGE_TIMEOUT) ||
    currentTime - lastResponse < COOLDOWN_PERIOD
  ) {
    return true;
  }

  return false;
}

/**
 * Atualiza o controle de mensagens para um remetente
 *
 * @param {string} sender - ID do remetente
 * @param {string} content - Conteúdo da mensagem
 */
function updateMessageControl(sender, content) {
  messageStore.lastResponses[sender] = Date.now();
  messageStore.lastMessageContent[sender] = content;
}

module.exports = {
  shouldIgnoreMessage,
  updateMessageControl,
};
