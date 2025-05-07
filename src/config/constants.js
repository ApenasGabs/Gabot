/**
 * Constantes utilizadas no projeto
 */

// Configurações gerais
const DEFAULT_PHONE_NUMBER = "@c.us"; // Número padrão para envio de mensagem inicial

// Grupo WhatsApp permitido (adicione mais IDs conforme necessário)
const ALLOWED_GROUPS = ["120363132077830172@g.us"];

// Tempo de cooldown para controle de spam (em milissegundos)
const COOLDOWN_PERIOD = 5000;

// Tempo para ignorar mensagens duplicadas (30 segundos)
const DUPLICATE_MESSAGE_TIMEOUT = 30000;

// Mensagens padrão
const DEFAULT_MESSAGES = {
  welcome:
    "Olá! Sou o GaBot 🤖\n\n" +
    "Para começar, envie 'gabot' para ver o menu de opções!",
  searching: "🔍 Buscando informações do repositório...",
  notFound:
    "❌ Não foi possível encontrar informações sobre este repositório.\n" +
    "Verifique se o formato está correto (usuário/repositório) e tente novamente.",
  invalidFormat:
    'Por favor, envie o nome do repositório no formato "usuario/repositorio".\n' +
    'Por exemplo: "orkestral/venom"\n\n' +
    'Para ver o menu, envie "gabot"',
  groupWelcome:
    "Olá! Agora estou disponível neste grupo também! 👋\n" +
    "Para começar, envie 'gabot' para ver o menu de opções!",
  menu:
    "🤖 *Menu do GaBot*\n\n" +
    "1️⃣ - Buscar repositório GitHub\n" +
    "2️⃣ - Ver ajuda\n" +
    "3️⃣ - Sobre o bot\n\n" +
    "Digite o número da opção desejada ou envie o nome de um repositório no formato 'usuario/repositorio'",
  help:
    "📚 *Ajuda do GaBot*\n\n" +
    "Para buscar informações sobre um repositório do GitHub, envie o nome no formato:\n" +
    "`usuario/repositorio`\n\n" +
    "Exemplos:\n" +
    "• `orkestral/venom`\n" +
    "• `facebook/react`\n\n" +
    "Para ver o menu novamente, envie 'gabot'",
  about:
    "ℹ️ *Sobre o GaBot*\n\n" +
    "GaBot é um bot do WhatsApp que busca informações sobre repositórios do GitHub.\n\n" +
    "Desenvolvido com ❤️ usando:\n" +
    "• Node.js\n" +
    "• Venom-Bot\n" +
    "• GitHub API\n\n" +
    "Para ver o menu, envie 'gabot'"
};

module.exports = {
  DEFAULT_PHONE_NUMBER,
  ALLOWED_GROUPS,
  COOLDOWN_PERIOD,
  DUPLICATE_MESSAGE_TIMEOUT,
  DEFAULT_MESSAGES,
};
