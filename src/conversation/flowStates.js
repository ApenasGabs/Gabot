/**
 * Definição de estados da conversa para controle de fluxo
 */
const ptBR = require("./responses/pt-BR.json");
const enUS = require("./responses/en-US.json");

// Define os idiomas suportados
const LANGUAGES = {
  PT_BR: "pt-BR",
  EN_US: "en-US",
};

// Mapeia idiomas para arquivos de mensagens
const MESSAGES = {
  [LANGUAGES.PT_BR]: ptBR,
  [LANGUAGES.EN_US]: enUS,
};

/**
 * Obtém a mensagem no idioma especificado
 *
 * @param {string} key - Chave da mensagem
 * @param {string} language - Código do idioma
 * @returns {string} - Mensagem traduzida
 */
function getMessage(key, language = LANGUAGES.PT_BR) {
  const messages = MESSAGES[language] || MESSAGES[LANGUAGES.PT_BR];
  return messages[key] || "";
}

/**
 * Estados do fluxo de conversa
 */
const FLOW_STATES = {
  // Estado inicial - primeira interação
  INITIAL: {
    id: "INITIAL",
    message: (language) => getMessage("welcome", language),
    nextState: "WAITING_REPO",
  },

  // Aguardando repositório válido
  WAITING_REPO: {
    id: "WAITING_REPO",
    // Não envia mensagem, apenas aguarda input
    validate: (input) => /^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/.test(input),
    onValid: "SEARCHING",
    onInvalid: "INVALID_FORMAT",
  },

  // Formato inválido do repositório
  INVALID_FORMAT: {
    id: "INVALID_FORMAT",
    message: (language) => getMessage("invalidFormat", language),
    nextState: "WAITING_REPO",
  },

  // Buscando informações
  SEARCHING: {
    id: "SEARCHING",
    message: (language) => getMessage("searching", language),
    // Estado transitório, alterado programaticamente após a busca
  },

  // Erro na busca
  ERROR: {
    id: "ERROR",
    message: (language) => getMessage("error", language),
    nextState: "WAITING_REPO",
  },
};

module.exports = {
  LANGUAGES,
  getMessage,
  FLOW_STATES,
};
