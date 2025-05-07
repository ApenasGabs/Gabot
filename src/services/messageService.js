/**
 * Serviço para lidar com mensagens
 */
const logger = require("../utils/logger");
const { DEFAULT_MESSAGES } = require("../config/constants");

/**
 * Envia uma mensagem para um número específico
 *
 * @param {object} client - Cliente Venom
 * @param {string} to - Número para enviar a mensagem
 * @param {string} message - Mensagem a ser enviada
 * @returns {Promise<object>} - Resultado do envio
 */
async function sendMessage(client, to, message) {
  try {
    const result = await client.sendText(to, message);
    logger.info(`Mensagem enviada para ${to}`);
    return result;
  } catch (error) {
    logger.error(`Erro ao enviar mensagem para ${to}`, error);
    throw error;
  }
}

/**
 * Envia a mensagem de boas-vindas
 *
 * @param {object} client - Cliente Venom
 * @param {string} to - Número para enviar a mensagem
 * @returns {Promise<object>} - Resultado do envio
 */
async function sendWelcomeMessage(client, to) {
  logger.info(`Enviando mensagem de boas-vindas para ${to}`);
  return sendMessage(client, to, DEFAULT_MESSAGES.welcome);
}

/**
 * Envia a mensagem de boas-vindas para grupos
 *
 * @param {object} client - Cliente Venom
 * @param {string} groupId - ID do grupo
 * @returns {Promise<object>} - Resultado do envio
 */
async function sendGroupWelcomeMessage(client, groupId) {
  logger.info(`Enviando mensagem de boas-vindas para o grupo ${groupId}`);
  return sendMessage(client, groupId, DEFAULT_MESSAGES.groupWelcome);
}

/**
 * Envia mensagem de pesquisa em andamento
 *
 * @param {object} client - Cliente Venom
 * @param {string} to - Número para enviar a mensagem
 * @returns {Promise<object>} - Resultado do envio
 */
async function sendSearchingMessage(client, to) {
  return sendMessage(client, to, DEFAULT_MESSAGES.searching);
}

/**
 * Envia mensagem de erro quando repositório não é encontrado
 *
 * @param {object} client - Cliente Venom
 * @param {string} to - Número para enviar a mensagem
 * @returns {Promise<object>} - Resultado do envio
 */
async function sendNotFoundMessage(client, to) {
  return sendMessage(client, to, DEFAULT_MESSAGES.notFound);
}

/**
 * Envia mensagem de formato inválido
 *
 * @param {object} client - Cliente Venom
 * @param {string} to - Número para enviar a mensagem
 * @returns {Promise<object>} - Resultado do envio
 */
async function sendInvalidFormatMessage(client, to) {
  return sendMessage(client, to, DEFAULT_MESSAGES.invalidFormat);
}

module.exports = {
  sendMessage,
  sendWelcomeMessage,
  sendGroupWelcomeMessage,
  sendSearchingMessage,
  sendNotFoundMessage,
  sendInvalidFormatMessage,
};
