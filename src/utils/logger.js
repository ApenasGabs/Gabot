/**
 * Sistema de logs para o bot
 */

/**
 * Registra uma mensagem de log com cabeçalho
 * @param {string} title - Título do log
 * @param {object} data - Dados a serem exibidos
 */
function logWithHeader(title, data = {}, fullMessage) {
  console.log("=================================\n");
  console.log("fullMessage: ", fullMessage);
  console.log(`\n===== ${title} =====`);

  if (Object.keys(data).length > 0) {
    Object.entries(data).forEach(([key, value]) => {
      console.log(`${key}: ${value}`);
    });
  }

  console.log("=================================\n");
}

/**
 * Registra uma mensagem recebida
 * @param {object} message - Objeto de mensagem do Venom
 */
function logReceivedMessage(message) {
  logWithHeader(
    "NOVA MENSAGEM RECEBIDA",
    {
      De: message.sender.pushname || "Sem nome",
      Número: message.from,
      Hora: new Date(message.timestamp * 1000).toLocaleString("pt-BR"),
      Conteúdo: message.body,
    },
    message
  );
}

/**
 * Registra uma mensagem ignorada
 * @param {string} reason - Motivo para ignorar a mensagem
 * @param {string} [from] - Remetente
 */
function logIgnoredMessage(reason, from = "") {
  console.log(`Mensagem ignorada: ${reason}${from ? ` (${from})` : ""}`);
}

/**
 * Registra informação
 * @param {string} message - Mensagem de informação
 */
function info(message) {
  console.log(`🔵 INFO: ${message}`);
}

/**
 * Registra erro
 * @param {string} message - Mensagem de erro
 * @param {Error} [error] - Objeto de erro opcional
 */
function error(message, error = null) {
  console.error(`🔴 ERRO: ${message}`);
  if (error) {
    console.error(error);
  }
}

/**
 * Registra sucesso
 * @param {string} message - Mensagem de sucesso
 */
function success(message) {
  console.log(`✅ SUCESSO: ${message}`);
}

module.exports = {
  logReceivedMessage,
  logIgnoredMessage,
  info,
  error,
  success,
};
