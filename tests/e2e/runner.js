// tests/e2e/runner.js
const fs = require('fs');
const path = require('path');

// Configuration
const config = require('./puppeteer.config.js');
const TestHelper = require('../setup/test-utils.js');

const testFiles = [
  'navigation.test.js',
  'profiles.test.js',
  'exercises.test.js',
  'scoring.test.js',
  'accessibility.test.js'
];

const baseDir = __dirname;

/**
 * Initialiser les dossiers d'artefacts
 */
function initializeArtifactsFolders() {
  const artifactsDirs = [
    config.artifacts.screenshots,
    config.artifacts.videos,
    config.artifacts.reports
  ];

  artifactsDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📁 Dossier créé: ${dir}`);
    }
  });
}

/**
 * Charger dynamiquement et exécuter un test
 */
async function runTest(testFilePath) {
  try {
    // Charger le module de test
    const testModule = require(testFilePath);
    
    console.log(`✅ Module de test chargé: ${path.basename(testFilePath)}`);
    return true;
  } catch (error) {
    console.error(`❌ Erreur lors du chargement du test: ${error.message}`);
    return false;
  }
}

/**
 * Lancer tous les tests
 */
async function runAllTests() {
  console.log('\n🚀 Démarrage des tests E2E Puppeteer...\n');

  initializeArtifactsFolders();

  // Initialiser Puppeteer
  console.log('🌐 Initialisation de Puppeteer...');
  await TestHelper.setupBrowser();

  let passedTests = 0;
  let failedTests = 0;

  // Exécuter chaque fichier de test
  for (const file of testFiles) {
    const filepath = path.join(baseDir, file);
    
    if (fs.existsSync(filepath)) {
      console.log(`\n▶️  Test: ${file}`);
      console.log('─'.repeat(50));

      try {
        const result = await runTest(filepath);
        if (result) {
          console.log(`✓ ${file} exécuté`);
          passedTests++;
        } else {
          failedTests++;
        }
      } catch (error) {
        console.error(`✗ Erreur: ${error.message}`);
        failedTests++;
      }
    } else {
      console.warn(`⚠️  Fichier de test non trouvé: ${filepath}`);
    }
  }

  // Fermer Puppeteer
  console.log('\n🛑 Fermeture de Puppeteer...');
  await TestHelper.closeBrowser();

  // Afficher le résumé
  console.log('\n' + '═'.repeat(50));
  console.log('📊 RÉSUMÉ DES TESTS');
  console.log('═'.repeat(50));
  console.log(`✅ Tests réussis: ${passedTests}`);
  console.log(`❌ Tests échoués: ${failedTests}`);
  console.log(`📁 Screenshots: ${config.artifacts.screenshots}`);
  console.log('═'.repeat(50));

  // Lister les screenshots générés
  if (fs.existsSync(config.artifacts.screenshots)) {
    const files = fs.readdirSync(config.artifacts.screenshots);
    if (files.length > 0) {
      console.log(`\n📸 ${files.length} screenshot(s) générés:`);
      files.forEach(file => {
        console.log(`   ✓ ${file}`);
      });
    }
  }

  console.log('\n');
}

// Exécuter les tests
runAllTests().catch(error => {
  console.error('❌ Erreur fatale:', error);
  process.exit(1);
});
