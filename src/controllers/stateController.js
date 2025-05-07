/**
 * Controlador para gerenciar estados da conversa
 */

// Armazena os estados da conversa por usuário
const userStates = new Map();

/**
 * Estados possíveis da conversa
 */
const STATE = {
  INITIAL: "INITIAL", // Estado inicial
  WAITING_REPO: "WAITING_REPO", // Esperando por nome de repositório
  SEARCHING: "SEARCHING", // Buscando informações
  ERROR: "ERROR", // Estado de erro
};

/**
 * Obtém o estado atual de um usuário
 *
 * @param {string} userId - ID do usuário
 * @returns {object} - Estado atual e dados associados
 */
function getUserState(userId) {
  if (!userStates.has(userId)) {
    // Se o usuário não tem estado, inicia com o estado inicial
    userStates.set(userId, {
      state: STATE.INITIAL,
      data: {},
      timestamp: Date.now(),
    });
  }
  return userStates.get(userId);
}

/**
 * Atualiza o estado de um usuário
 *
 * @param {string} userId - ID do usuário
 * @param {string} state - Novo estado
 * @param {object} [data={}] - Dados associados ao estado
 */
function setUserState(userId, state, data = {}) {
  const currentState = getUserState(userId);
  userStates.set(userId, {
    state,
    data: { ...currentState.data, ...data },
    timestamp: Date.now(),
  });
}

/**
 * Limpa estados antigos (mais de 1 hora)
 */
function cleanOldStates() {
  const oneHour = 60 * 60 * 1000; // 1 hora em ms
  const now = Date.now();

  for (const [userId, stateData] of userStates.entries()) {
    if (now - stateData.timestamp > oneHour) {
      userStates.delete(userId);
    }
  }
}

// Limpa estados antigos a cada hora
setInterval(cleanOldStates, 60 * 60 * 1000);

module.exports = {
  STATE,
  getUserState,
  setUserState,
  cleanOldStates,
};
