/**
 * Modelo para gerenciar sessões de usuário
 */
const { FLOW_STATES, LANGUAGES } = require("../conversation/flowStates");

/**
 * Classe que representa uma sessão de usuário
 */
class UserSession {
  /**
   * Cria uma nova sessão de usuário
   *
   * @param {string} userId - ID único do usuário (número de telefone)
   * @param {object} options - Opções da sessão
   */
  constructor(userId, options = {}) {
    this.userId = userId;
    this.state = options.state || "INITIAL";
    this.language = options.language || LANGUAGES.PT_BR;
    this.data = options.data || {};
    this.history = [];
    this.lastActivity = Date.now();
  }

  /**
   * Atualiza o estado da sessão
   *
   * @param {string} newState - Novo estado
   * @param {object} data - Dados adicionais
   */
  updateState(newState, data = {}) {
    // Guarda o estado anterior no histórico
    this.history.push({
      state: this.state,
      timestamp: Date.now(),
    });

    // Atualiza para o novo estado
    this.state = newState;
    this.data = { ...this.data, ...data };
    this.lastActivity = Date.now();
  }

  /**
   * Verifica se a sessão está inativa por um período determinado
   *
   * @param {number} timeoutMs - Tempo de inatividade em milissegundos
   * @returns {boolean} - Verdadeiro se a sessão estiver inativa
   */
  isInactive(timeoutMs = 3600000) {
    // Padrão: 1 hora
    return Date.now() - this.lastActivity > timeoutMs;
  }

  /**
   * Obtém o estado atual da sessão
   *
   * @returns {object} - Estado atual e dados da sessão
   */
  getCurrentState() {
    const stateDefinition = FLOW_STATES[this.state] || FLOW_STATES.INITIAL;

    return {
      id: this.state,
      definition: stateDefinition,
      language: this.language,
      data: this.data,
      lastActivity: this.lastActivity,
    };
  }
}

module.exports = UserSession;
