/**
 * Árvore de decisão para o fluxo da conversa
 */
const { FLOW_STATES, LANGUAGES } = require("./flowStates");
const { GITHUB_REPO_PATTERN } = require("../config/constants");

/**
 * Processa uma mensagem de entrada e determina o próximo estado da conversa
 *
 * @param {string} currentState - Estado atual da conversa
 * @param {string} input - Entrada do usuário
 * @param {object} options - Opções adicionais
 * @returns {object} - Próximo estado e ação a ser executada
 */
function processInput(currentState, input, options = {}) {
  const language = options.language || LANGUAGES.PT_BR;
  const state = FLOW_STATES[currentState] || FLOW_STATES.INITIAL;

  // Estado atual tem validação
  if (state.validate) {
    const isValid = state.validate(input);
    const nextStateKey = isValid ? state.onValid : state.onInvalid;
    const nextState = FLOW_STATES[nextStateKey];

    return {
      nextState: nextStateKey,
      message: nextState.message ? nextState.message(language) : null,
      action: isValid ? "PROCESS_REPO" : "SHOW_HELP",
      data: { input },
    };
  }

  // Estado atual tem próximo estado definido
  if (state.nextState) {
    const nextState = FLOW_STATES[state.nextState];

    return {
      nextState: state.nextState,
      message: nextState.message ? nextState.message(language) : null,
      action: "CONTINUE",
      data: {},
    };
  }

  // Estado sem transição definida - verifica se é um repositório
  if (GITHUB_REPO_PATTERN.test(input)) {
    return {
      nextState: "SEARCHING",
      message: FLOW_STATES.SEARCHING.message(language),
      action: "PROCESS_REPO",
      data: { input },
    };
  }

  // Default - retorna para ajuda
  return {
    nextState: "INVALID_FORMAT",
    message: FLOW_STATES.INVALID_FORMAT.message(language),
    action: "SHOW_HELP",
    data: {},
  };
}

module.exports = {
  processInput,
};
