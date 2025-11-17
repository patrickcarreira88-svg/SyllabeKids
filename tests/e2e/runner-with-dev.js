// tests/e2e/runner-with-dev.js
const { spawn } = require('child_process');
const fs = require('fs');

console.log('\n🚀 SyllaboKids - Tests E2E\n');

// Créer les dossiers
const dirs = [
  'tests/e2e/artifacts/screenshots',
  'tests/e2e/artifacts/videos',
  'tests/e2e/artifacts/reports'
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

console.log('[1/3] Démarrage du serveur Vite (mode production)...\n');

// Démarrer Vite en mode production (mode "preview")
const vite = spawn('npm', ['run', 'preview'], {
  shell: true,
  stdio: 'pipe'
});

let viteLogs = '';
let serverReady = false;

// Capturer les logs de Vite
vite.stdout.on('data', (data) => {
  viteLogs += data.toString();
  console.log('[Vite]', data.toString().trim());
  
  // Détecte quand Vite est prêt
  if (viteLogs.includes('ready') && !serverReady) {
    serverReady = true;
    runTests();
  }
});

vite.stderr.on('data', (data) => {
  console.error('[Vite Error]', data.toString().trim());
});

function runTests() {
  console.log('\n[2/3] Attente de 3 secondes...\n');

  setTimeout(async () => {
    try {
      console.log('[3/3] Lancement des tests Vitest...\n');

      // Lancer Vitest avec les tests E2E
      const vitest = spawn('npm', ['run', 'test', '--', 'tests/e2e', '--run'], {
        shell: true,
        stdio: 'inherit'
      });

      vitest.on('exit', (code) => {
        console.log('\n✓ Tests terminés\n');
        vite.kill();
        process.exit(code || 0);
      });

      vite.on('error', (error) => {
        console.error('❌ Erreur Vite:', error);
        process.exit(1);
      });

    } catch (error) {
      console.error('❌ Erreur:', error.message);
      vite.kill();
      process.exit(1);
    }
  }, 3000);
}

setTimeout(() => {
  if (!serverReady) {
    console.error('❌ Timeout: Vite n\'a pas démarré après 15 secondes');
    vite.kill();
    process.exit(1);
  }
}, 15000);
