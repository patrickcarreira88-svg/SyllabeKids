// tests/e2e/profiles.test.js
const TestHelper = require('../setup/test-utils.js');

describe('👧👦 SyllaboKids - Tests des Profils', () => {
  beforeAll(async () => {
    await TestHelper.setupBrowser();
  });

  afterAll(async () => {
    await TestHelper.closeBrowser();
  });

  test('Afficher les profils d\'enfants', async () => {
    try {
      await TestHelper.goto('/');
      
      const profileCount = await TestHelper.countElements('.profile-card');
      expect(profileCount).toBeGreaterThan(0);
      
      console.log(`✓ ${profileCount} profil(s)`);
      await TestHelper.screenshot('profiles-view');
    } catch (error) {
      console.error('Test failed:', error.message);
      throw error;
    }
  });

  test('Chaque profil doit avoir un avatar', async () => {
    try {
      await TestHelper.goto('/');
      
      const avatarCount = await TestHelper.countElements('.profile-card img');
      expect(avatarCount).toBeGreaterThan(0);
      
      console.log('✓ Avatars présents');
    } catch (error) {
      console.error('Test failed:', error.message);
      throw error;
    }
  });
});
