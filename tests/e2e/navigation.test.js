// tests/e2e/navigation.test.js
const TestHelper = require('../setup/test-utils.js');

describe('🧭 SyllaboKids - Tests de Navigation', () => {
  beforeAll(async () => {
    await TestHelper.setupBrowser();
  });

  afterAll(async () => {
    await TestHelper.closeBrowser();
  });

  test('Charger la page d\'accueil', async () => {
    try {
      await TestHelper.goto('/');
      const profileExists = await TestHelper.elementExists('.profile-card');
      expect(profileExists).toBe(true);
      await TestHelper.screenshot('01-home-screen');
    } catch (error) {
      console.error('Test failed:', error.message);
      throw error;
    }
  });

  test('Naviguer vers les semaines', async () => {
    try {
      await TestHelper.goto('/');
      
      const profileExists = await TestHelper.elementExists('.profile-card');
      if (profileExists) {
        await TestHelper.click('.profile-card:first-child');
        
        // ✅ CORRECTION : Remplacer waitForTimeout par wait
        await TestHelper.wait(1000);
        
        // ✅ Vérifier l'existence avec gestion d'erreur
        try {
          const weeksExists = await TestHelper.elementExists('.week-item');
          expect(weeksExists).toBe(true);
        } catch (e) {
          console.warn('⚠️ Week items not found immediately, waiting more...');
          await TestHelper.wait(1000);
          const weeksExistRetry = await TestHelper.elementExists('.week-item');
          expect(weeksExistRetry).toBe(true);
        }
        
        await TestHelper.screenshot('02-weeks-list');
      }
    } catch (error) {
      console.error('Test failed:', error.message);
      throw error;
    }
  });
});
