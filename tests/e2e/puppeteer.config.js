// tests/e2e/puppeteer.config.js
module.exports = {
  // Configuration du navigateur
  launch: {
    headless: process.env.HEADLESS !== 'false',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage'
    ],
    slowMo: 100 // Ralentir les actions pour mieux voir
  },

  // Configuration de la page
  page: {
    setViewport: { width: 375, height: 667 } // Taille mobile (adapté pour enfants)
  },

  // URL de base
  baseURL: process.env.BASE_URL || 'http://localhost:5173',

  // Timeouts
  timeout: 30000,
  navigationTimeout: 30000,

  // Répertoire pour les artefacts
  artifacts: {
    screenshots: 'tests/e2e/artifacts/screenshots',
    videos: 'tests/e2e/artifacts/videos',
    reports: 'tests/e2e/artifacts/reports'
  }
};
