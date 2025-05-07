/**
 * Serviço para gerenciar intenções e respostas do bot
 */
const intents = require("../conversation/intents.json").intents;
const { getEmojiResponse } = require('../config/emojis');

// Comandos do bot
const BOT_COMMANDS = {
  MENU: 'gabot',
  HELP: 'ajuda',
  ABOUT: 'sobre'
};

/**
 * Verifica se uma string contém alguma das palavras-chave
 * @param {string} text - Texto a ser verificado
 * @param {string[]} keywords - Lista de palavras-chave
 * @returns {boolean} - Verdadeiro se encontrar alguma palavra-chave
 */
function containsAny(text, keywords) {
  if (!text || !keywords) return false;
  return keywords.some(keyword => text.toLowerCase().includes(keyword.toLowerCase()));
}

/**
 * Verifica se o texto é um comando do bot
 * @param {string} text - Texto a ser verificado
 * @returns {boolean} - Verdadeiro se for um comando
 */
function isBotCommand(text) {
  if (!text) return false;
  const cleanText = text.toLowerCase().trim();
  return Object.values(BOT_COMMANDS).includes(cleanText);
}

/**
 * Verifica se o formato do repositório é válido
 * @param {string} text - Texto a ser verificado
 * @returns {boolean} - Verdadeiro se o formato for válido
 */
function isValidRepoFormat(text) {
  if (!text) return false;
  
  // Remove espaços extras e converte para minúsculo
  const cleanText = text.trim().toLowerCase();
  
  // Se for um comando do bot, não é um repositório
  if (isBotCommand(cleanText)) return false;
  
  // Verifica se tem exatamente uma barra
  if ((cleanText.match(/\//g) || []).length !== 1) return false;
  
  // Divide em usuário e repositório
  const [user, repo] = cleanText.split('/');
  
  // Verifica se ambos os lados têm pelo menos 1 caractere
  if (!user || !repo) return false;
  
  // Verifica se contém apenas caracteres válidos (letras, números, hífen, underscore e ponto)
  const validChars = /^[a-z0-9_.-]+$/;
  if (!validChars.test(user) || !validChars.test(repo)) return false;
  
  // Verifica tamanho máximo (40 caracteres para cada lado, conforme limite do GitHub)
  if (user.length > 40 || repo.length > 100) return false;
  
  return true;
}

/**
 * Obtém uma resposta aleatória para uma intenção
 * @param {string} intent - Nome da intenção
 * @returns {string} - Resposta aleatória
 */
function getRandomResponse(intent) {
  if (!intent || !intents[intent] || !intents[intent].responses) {
    return "Desculpe, não entendi. Tente novamente ou envie 'gabot' para ver o menu.";
  }
  const responses = intents[intent].responses;
  return responses[Math.floor(Math.random() * responses.length)];
}

/**
 * Detecta a intenção do usuário com base na mensagem
 * @param {string} message - Mensagem do usuário
 * @returns {string} - Nome da intenção detectada
 */
function detectIntent(message) {
  if (!message || typeof message !== 'string') {
    return "unknown";
  }

  const text = message.toLowerCase().trim();

  // Verifica se é um comando do bot
  if (isBotCommand(text)) {
    if (text === BOT_COMMANDS.MENU) return "menu";
    if (text === BOT_COMMANDS.HELP) return "help";
    if (text === BOT_COMMANDS.ABOUT) return "about";
  }

  // Verifica se é um emoji único
  if (text.length === 2 || (text.length === 4 && text.includes('‍'))) {
    return "emoji";
  }

  // Verifica saudações
  if (containsAny(text, intents.greeting.keywords)) {
    return "greeting";
  }

  // Verifica ajuda
  if (containsAny(text, intents.help.keywords)) {
    return "help";
  }

  // Verifica despedidas
  if (containsAny(text, intents.farewell.keywords)) {
    return "farewell";
  }

  // Verifica formato de repositório
  if (isValidRepoFormat(text)) {
    return "searching";
  }

  // Se não encontrou nenhuma intenção específica
  return "invalid_format";
}

/**
 * Obtém uma resposta apropriada para a mensagem do usuário
 * @param {string} message - Mensagem do usuário
 * @returns {string} - Resposta do bot
 */
function getResponse(message) {
  if (!message || typeof message !== 'string') {
    return "Desculpe, não entendi. Tente novamente ou envie 'gabot' para ver o menu.";
  }

  const intent = detectIntent(message);

  // Se for um emoji, retorna uma resposta de emoji
  if (intent === "emoji") {
    try {
      return getEmojiResponse(message);
    } catch (error) {
      console.error("Erro ao processar emoji:", error);
      return "😅"; // Emoji de fallback
    }
  }

  return getRandomResponse(intent);
}

module.exports = {
  detectIntent,
  getResponse,
  getRandomResponse,
  isValidRepoFormat,
  BOT_COMMANDS
}; 