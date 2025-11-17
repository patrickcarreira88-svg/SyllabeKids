// tests/e2e/exercises.test.js
const TestHelper = require('../setup/test-utils.js');

describe('🎮 SyllaboKids - Tests des Exercices', () => {
  beforeAll(async () => {
    await TestHelper.setupBrowser();
  });

  afterAll(async () => {
    await TestHelper.closeBrowser();
  });

  test('Application est accessible', async () => {
    try {
      await TestHelper.goto('/');
      
      const pageTitle = await TestHelper.page.title();
      expect(pageTitle.length).toBeGreaterThan(0);
      
      console.log(`✓ App accessible: ${pageTitle}`);
      await TestHelper.screenshot('03-app-accessible');
    } catch (error) {
      console.error('Test failed:', error.message);
      throw error;
    }
  });

  test('Pas d\'erreurs critiques', async () => {
    try {
      await TestHelper.goto('/');
      
      // Vérifier qu'il n'y a pas d'éléments d'erreur
      const errorElements = await TestHelper.countElements('.error, [role="alert"]');
      expect(errorElements).toBeLessThanOrEqual(0);
      
      console.log('✓ Pas d\'erreurs');
    } catch (error) {
      console.error('Test failed:', error.message);
      throw error;
    }
  });
});
