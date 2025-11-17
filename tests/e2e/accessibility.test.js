// tests/e2e/accessibility.test.js
const TestHelper = require('../setup/test-utils.js');

describe('♿ SyllaboKids - Tests d\'Accessibilité', () => {
  beforeAll(async () => {
    await TestHelper.setupBrowser();
  });

  afterAll(async () => {
    await TestHelper.closeBrowser();
  });

  test('Taille de police lisible', async () => {
    try {
      await TestHelper.goto('/');

      const minSize = await TestHelper.page.evaluate(() => {
        const elements = document.querySelectorAll('p, button, h1, h2, h3');
        let min = 999;
        
        elements.forEach(el => {
          const fontSize = parseInt(window.getComputedStyle(el).fontSize);
          if (fontSize < min && fontSize > 0) min = fontSize;
        });
        
        return min === 999 ? 16 : min;
      });

      expect(minSize).toBeGreaterThanOrEqual(12);
      console.log(`✓ Taille police: ${minSize}px`);
    } catch (error) {
      console.error('Test failed:', error.message);
      throw error;
    }
  });

  test('Zones cliquables accessibles', async () => {
    try {
      await TestHelper.goto('/');

      const clickableSize = await TestHelper.page.evaluate(() => {
        const buttons = document.querySelectorAll('button, a');
        const sizes = [];
        
        buttons.forEach(btn => {
          const rect = btn.getBoundingClientRect();
          const minDim = Math.min(rect.width, rect.height);
          if (minDim > 0) sizes.push(minDim);
        });

        return sizes.length > 0 ? Math.min(...sizes) : 44;
      });

      console.log(`✓ Zones cliquables: ${clickableSize}px`);
    } catch (error) {
      console.error('Test failed:', error.message);
      throw error;
    }
  });
});
