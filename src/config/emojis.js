/**
 * Configurações de emojis para respostas do bot
 */

const EMOJI_CATEGORIES = {
  eyes: ['👀', '👁️', '👁️‍🗨️', '👁️‍🗨️', '👁️‍🗨️', '👁️‍🗨️', '👁️‍🗨️', '👁️‍🗨️', '👁️‍🗨️', '👁️‍🗨️'],
  happy: ['😊', '😄', '😃', '😀', '😁', '😆', '😅', '😂', '🤣', '😊'],
  love: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💖'],
  animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯'],
  food: ['🍕', '🍔', '🍟', '🌭', '🍿', '🧂', '🥨', '🥪', '🌮', '🌯'],
  nature: ['🌱', '🌲', '🌳', '🌴', '🌵', '🌾', '🌿', '☘️', '🍀', '🍁'],
  weather: ['☀️', '🌤️', '⛅', '🌥️', '☁️', '🌦️', '🌧️', '⛈️', '🌩️', '🌨️'],
  objects: ['⌚', '📱', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '🕹️', '🗜️'],
  symbols: ['✨', '⭐', '🌟', '💫', '⚡', '💥', '🔥', '💯', '💢', '💨'],
  misc: ['🎮', '🎲', '🎯', '🎨', '🎭', '🎪', '🎟️', '🎫', '🎗️', '🏆']
};

/**
 * Obtém um emoji aleatório de uma categoria específica
 * @param {string} category - Categoria do emoji
 * @returns {string} - Emoji aleatório
 */
function getRandomEmoji(category) {
  if (!category || !EMOJI_CATEGORIES[category]) {
    // Se a categoria não existir, retorna um emoji aleatório de qualquer categoria
    const categories = Object.keys(EMOJI_CATEGORIES);
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    return getRandomEmoji(randomCategory);
  }
  
  const emojis = EMOJI_CATEGORIES[category];
  return emojis[Math.floor(Math.random() * emojis.length)];
}

/**
 * Detecta se um emoji é da categoria "olhos"
 * @param {string} emoji - Emoji a ser verificado
 * @returns {boolean} - Verdadeiro se for um emoji de olhos
 */
function isEyeEmoji(emoji) {
  return EMOJI_CATEGORIES.eyes.includes(emoji);
}

/**
 * Obtém uma resposta de emoji apropriada
 * @param {string} emoji - Emoji recebido
 * @returns {string} - Resposta com emoji
 */
function getEmojiResponse(emoji) {
  if (isEyeEmoji(emoji)) {
    return getRandomEmoji('eyes');
  }
  
  // Para outros emojis, retorna um emoji aleatório de qualquer categoria
  return getRandomEmoji();
}

module.exports = {
  EMOJI_CATEGORIES,
  getRandomEmoji,
  isEyeEmoji,
  getEmojiResponse
}; 