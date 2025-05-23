const axios = require('axios');

/**
 * Busca informações de um repositório no GitHub
 * @param {string} repoPath - Caminho do repositório no formato "usuario/repositorio"
 * @returns {Promise<string>} - Mensagem formatada com informações do repositório
 */
async function getRepositoryInfo(repoPath) {
  try {
    // Busca informações do repositório
    const repoResponse = await axios.get(
      `https://api.github.com/repos/${repoPath}`
    );

    // Busca as linguagens do repositório
    const languagesResponse = await axios.get(repoResponse.data.languages_url);

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
      updated_at
    } = repoResponse.data;

    // Formatar as linguagens
    const languages = Object.keys(languagesResponse.data);
    const languagesText =
      languages.length > 0 ? languages.join(', ') : 'Não especificado';

    // Formatar datas
    const createDate = new Date(created_at).toLocaleDateString('pt-BR');
    const updateDate = new Date(updated_at).toLocaleDateString('pt-BR');

    // Construir mensagem formatada
    return (
      `📂 *${name}*\n` +
      `${description ? `_${description}_\n\n` : '\n'}` +
      `👤 *Autor:* ${owner.login}\n` +
      `⭐ *Stars:* ${stargazers_count}\n` +
      `🔄 *Forks:* ${forks_count}\n` +
      `🐞 *Issues:* ${open_issues_count}\n` +
      `💻 *Linguagens:* ${languagesText}\n` +
      `📅 *Criado em:* ${createDate}\n` +
      `🔄 *Última atualização:* ${updateDate}\n\n` +
      `🔗 *Link:* ${html_url}\n\n` +
      `_Informações fornecidas pela API do GitHub_`
    );
  } catch (error) {
    console.error('Erro na API do GitHub:', error.message);
    if (error.response && error.response.status === 404) {
      return `❌ Repositório "${repoPath}" não encontrado.`;
    }
    throw new Error('Falha ao obter informações do repositório.');
  }
}

module.exports = {
  getRepositoryInfo
};
