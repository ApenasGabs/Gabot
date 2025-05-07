/**
 * Funções utilitárias para o bot
 */

/**
 * Formata uma data para string legível
 *
 * @param {Date|string} date - Data a ser formatada
 * @returns {string} - Data formatada
 */
function formatDate(date) {
  const dateObj = date instanceof Date ? date : new Date(date);
  return dateObj.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Formata número para incluir separadores de milhar
 *
 * @param {number} num - Número a ser formatado
 * @returns {string} - Número formatado
 */
function formatNumber(num) {
  return num.toLocaleString("pt-BR");
}

/**
 * Trunca texto longo com ellipsis
 *
 * @param {string} text - Texto a ser truncado
 * @param {number} maxLength - Tamanho máximo
 * @returns {string} - Texto truncado
 */
function truncateText(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + "...";
}

/**
 * Converte milissegundos para string de tempo legível
 *
 * @param {number} ms - Milissegundos
 * @returns {string} - Tempo formatado
 */
function msToTime(ms) {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

module.exports = {
  formatDate,
  formatNumber,
  truncateText,
  msToTime,
};
