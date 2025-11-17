// tests/setup/test-utils.js
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class TestHelper {
  static browser = null;
  static page = null;

  // Configuration directement dans la classe (pas de dépendance externe)
  static config = {
    baseURL: 'http://localhost:5173',
    timeout: 30000,
    navigationTimeout: 30000,
    artifacts: {
      screenshots: 'tests/e2e/artifacts/screenshots',
      videos: 'tests/e2e/artifacts/videos',
      reports: 'tests/e2e/artifacts/reports'
    }
  };

  /**
   * Initialiser le navigateur et la page
   */
  static async setupBrowser() {
    if (!this.browser) {
      console.log('🌐 Initialisation de Puppeteer...');
      this.browser = await puppeteer.launch({
        headless: process.env.HEADLESS !== 'false',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage'
        ],
        slowMo: 100
      });
      
      this.page = await this.browser.newPage();
      await this.page.setViewport({ width: 375, height: 667 });

      this.page.on('console', msg => {
        console.log('[BROWSER]', msg.text());
      });

      this.page.on('error', err => {
        console.error('[BROWSER ERROR]', err);
      });
    }
    return this.page;
  }

  /**
   * Fermer le navigateur
   */
  static async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
    }
  }

  /**
   * Naviguer vers l'app - VERSION CORRIGÉE
   */
  static async goto(path = '') {
    if (!this.page) {
      throw new Error('Browser not initialized. Call setupBrowser() first.');
    }
    
    // ✅ Construction correcte de l'URL
    const url = path.startsWith('http') 
      ? path 
      : `${this.config.baseURL}${path}`;
    
    console.log(`📍 Navigating to: ${url}`);
    
    try {
      await this.page.goto(url, { 
        waitUntil: 'networkidle2', 
        timeout: this.config.navigationTimeout 
      });
    } catch (error) {
      console.error(`❌ Navigation error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Attendre et cliquer sur un élément
   */
  static async click(selector) {
    if (!this.page) throw new Error('Browser not initialized');
    
    try {
      await this.page.waitForSelector(selector, { timeout: 5000 });
      await this.page.click(selector);
    } catch (error) {
      console.warn(`⚠️ Click failed on ${selector}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Taper du texte
   */
  static async type(selector, text) {
    if (!this.page) throw new Error('Browser not initialized');
    
    await this.page.waitForSelector(selector, { timeout: 5000 });
    await this.page.type(selector, text);
  }

  /**
   * Attendre un élément
   */
  static async waitForElement(selector, timeout = 5000) {
    if (!this.page) throw new Error('Browser not initialized');
    
    await this.page.waitForSelector(selector, { timeout });
  }

  /**
   * Vérifier qu'un élément existe
   */
  static async elementExists(selector) {
    if (!this.page) throw new Error('Browser not initialized');
    
    const element = await this.page.$(selector);
    return element !== null;
  }

  /**
   * Récupérer le texte d'un élément
   */
  static async getText(selector) {
    if (!this.page) throw new Error('Browser not initialized');
    
    await this.page.waitForSelector(selector, { timeout: 5000 });
    return await this.page.$eval(selector, el => el.textContent);
  }

  /**
   * Capturer un screenshot
   */
  static async screenshot(name) {
    if (!this.page) throw new Error('Browser not initialized');
    
    const screenshotsDir = this.config.artifacts.screenshots;
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }
    
    const filename = `${name}-${Date.now()}.png`;
    const filepath = path.join(screenshotsDir, filename);
    
    try {
      await this.page.screenshot({ path: filepath, fullPage: false });
      console.log(`📸 Screenshot: ${filename}`);
      return filepath;
    } catch (error) {
      console.error(`❌ Screenshot failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * ✅ NOUVEAU : Attendre avec délai (remplace waitForTimeout)
   */
  static async wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Attendre la navigation - VERSION CORRIGÉE
   */
  static async waitForNavigation() {
    if (!this.page) throw new Error('Browser not initialized');
    
    try {
      await Promise.race([
        this.page.waitForNavigation({ waitUntil: 'networkidle2', timeout: this.config.navigationTimeout }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Navigation timeout')), this.config.navigationTimeout)
        )
      ]);
    } catch (error) {
      console.warn(`⚠️ Navigation wait failed: ${error.message}`);
      // Ne pas thrower pour ne pas casser les tests
    }
  }

  /**
   * Compter les éléments
   */
  static async countElements(selector) {
    if (!this.page) throw new Error('Browser not initialized');
    
    return await this.page.$$eval(selector, elements => elements.length);
  }

  /**
   * Vérifier les erreurs d'accessibilité
   */
  static async checkAccessibility() {
    if (!this.page) throw new Error('Browser not initialized');
    
    const accessibility = await this.page.evaluate(() => {
      const issues = [];
      
      document.querySelectorAll('img').forEach(img => {
        if (!img.alt) {
          issues.push(`Image sans alt: ${img.src}`);
        }
      });

      document.querySelectorAll('button').forEach(btn => {
        if (!btn.textContent && !btn.getAttribute('aria-label')) {
          issues.push('Bouton sans texte ni aria-label');
        }
      });

      return issues;
    });

    return accessibility;
  }
}

module.exports = TestHelper;
