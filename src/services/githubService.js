/**
 * Serviço de integração com a API do GitHub
 */
const axios = require("axios");
const { formatDate, formatNumber } = require("../utils/helpers");
const { GITHUB_CONFIG } = require("../config/github-config");

// Cria uma instância do axios com as configurações do GitHub
const githubClient = axios.create(GITHUB_CONFIG);

/**
 * Busca informações de um repositório no GitHub
 * @param {string} repoPath - Caminho do repositório no formato "usuario/repositorio"
 * @returns {Promise<string>} - Mensagem formatada com informações do repositório
 */
async function getRepositoryInfo(repoPath) {
  try {
    // Busca informações do repositório
    const repoResponse = await githubClient.get(`/repos/${repoPath}`);
    console.log("repoResponse: ", repoResponse);

    // Busca as linguagens do repositório
    const languagesResponse = await githubClient.get(
      repoResponse.data.languages_url
    );

    // Extrair informações relevantes
    const {
      name,
      description,
      html_url,
      stargazers_count,
      forks_count,
      open_issues_count,
      owner,
      created_at,
      updated_at,
    } = repoResponse.data;

    // Formatar as linguagens
    const languages = Object.keys(languagesResponse.data);
    const languagesText =
      languages.length > 0 ? languages.join(", ") : "Não especificado";

    // Formatar datas
    const createDate = formatDate(created_at);
    const updateDate = formatDate(updated_at);

    // Construir mensagem formatada
    return (
      `📂 *${name}*\n` +
      `${description ? `_${description}_\n\n` : "\n"}` +
      `👤 *Autor:* ${owner.login}\n` +
      `⭐ *Stars:* ${formatNumber(stargazers_count)}\n` +
      `🔄 *Forks:* ${formatNumber(forks_count)}\n` +
      `🐞 *Issues:* ${formatNumber(open_issues_count)}\n` +
      `💻 *Linguagens:* ${languagesText}\n` +
      `📅 *Criado em:* ${createDate}\n` +
      `🔄 *Última atualização:* ${updateDate}\n\n` +
      `🔗 *Link:* ${html_url}\n\n` +
      `_Informações fornecidas pela API do GitHub_`
    );
  } catch (error) {
    console.log("error: ", error);
    console.error("Erro na API do GitHub:", error.message);
    if (error.response) {
      if (error.response.status === 404) {
        return `❌ Repositório "${repoPath}" não encontrado.`;
      } else if (error.response.status === 403) {
        return `❌ Limite de requisições excedido. Por favor, tente novamente em alguns minutos.`;
      }
    }
    throw new Error("Falha ao obter informações do repositório.");
  }
}

module.exports = {
  getRepositoryInfo,
};
