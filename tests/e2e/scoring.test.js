// tests/e2e/scoring.test.js
const TestHelper = require('../setup/test-utils.js');

describe('📊 SyllaboKids - Tests du Scoring', () => {
  beforeAll(async () => {
    await TestHelper.setupBrowser();
  });

  afterAll(async () => {
    await TestHelper.closeBrowser();
  });

  test('Page charge sans erreur', async () => {
    try {
      await TestHelper.goto('/');
      
      const content = await TestHelper.page.content();
      expect(content.length).toBeGreaterThan(100);
      
      console.log('✓ Contenu présent');
    } catch (error) {
      console.error('Test failed:', error.message);
      throw error;
    }
  });

  test('Structure DOM valide', async () => {
    try {
      await TestHelper.goto('/');
      
      const hasBody = await TestHelper.elementExists('body');
      expect(hasBody).toBe(true);
      
      console.log('✓ DOM valide');
    } catch (error) {
      console.error('Test failed:', error.message);
      throw error;
    }
  });
});
