/**
 * Configurações da API do GitHub
 */
const axios = require('axios');

// Token de autenticação do GitHub
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// Configurações do cliente HTTP
const GITHUB_CONFIG = {
  baseURL: 'https://api.github.com',
  headers: {
    'Accept': 'application/vnd.github.v3+json',
    'Authorization': GITHUB_TOKEN ? `token ${GITHUB_TOKEN}` : undefined,
    'User-Agent': 'GaBot-WhatsApp'
  },
  timeout: 30000, // 30 segundos
  maxRedirects: 5,
  validateStatus: function (status) {
    return status >= 200 && status < 500; // Aceita qualquer status entre 200 e 499
  }
};

// Configuração do retry
const RETRY_CONFIG = {
  retries: 3,
  retryDelay: 1000, // 1 segundo
  retryCondition: (error) => {
    return axios.isRetryableError(error) || 
           error.code === 'ECONNABORTED' ||
           error.response?.status === 429; // Rate limit
  }
};

module.exports = {
  GITHUB_CONFIG,
  RETRY_CONFIG
}; 