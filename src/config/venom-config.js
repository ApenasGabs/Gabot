/**
 * Configurações para inicialização do Venom Bot
 */
const venomConfig = {
  session: "gabot-session",
  headless: true, // Modo headless para não exibir a interface do navegador
  logQR: true, // Mostra o QR code no terminal
  browserArgs: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-dev-shm-usage",
    "--disable-accelerated-2d-canvas",
    "--no-first-run",
    "--no-zygote",
    "--single-process",
    "--disable-gpu",
  ],
  disableWelcome: true, // Desabilita a mensagem de boas-vindas
};

module.exports = venomConfig;
