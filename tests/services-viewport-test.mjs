/**
 * Services Section - Viewport Testing
 * Tests the #services section across 4 viewports:
 * 1. iPhone SE (375x667) - Mobile grid, NO expanding card
 * 2. iPhone 15 (390x844) - Mobile grid, NO expanding card
 * 3. iPad Mini (768x1024) - Expanding card with clip-path
 * 4. Desktop (1920x1080) - Full expanding card
 */

import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:3000';

const VIEWPORTS = [
  { name: 'iPhone SE', width: 375, height: 667, isDesktop: false },
  { name: 'iPhone 15', width: 390, height: 844, isDesktop: false },
  { name: 'iPad Mini', width: 768, height: 1024, isDesktop: true },
  { name: 'Desktop', width: 1920, height: 1080, isDesktop: true },
];

async function testViewport(browser, viewport) {
  const results = {
    viewport: viewport.name,
    resolution: `${viewport.width}x${viewport.height}`,
    tests: {},
    consoleErrors: [],
    consoleWarnings: [],
  };

  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: viewport.width <= 390 ? 3 : viewport.width <= 768 ? 2 : 1,
  });
  const page = await context.newPage();

  // Capture console messages
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      results.consoleErrors.push(msg.text());
    } else if (msg.type() === 'warning') {
      results.consoleWarnings.push(msg.text());
    }
  });

  try {
    // 1. Navigate
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
    results.tests['page_load'] = { pass: true, detail: 'Page loaded successfully' };

    // 2. Scroll to #services
    await page.evaluate(() => {
      const el = document.getElementById('services');
      if (el) el.scrollIntoView({ behavior: 'instant' });
    });
    await page.waitForTimeout(1500); // Wait for GSAP/animations to settle

    // 3. Check horizontal overflow
    const overflow = await page.evaluate(() => {
      return {
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        innerWidth: window.innerWidth,
        hasOverflow: document.documentElement.scrollWidth > window.innerWidth,
      };
    });
    results.tests['no_horizontal_overflow'] = {
      pass: !overflow.hasOverflow,
      detail: `scrollWidth=${overflow.scrollWidth}, innerWidth=${overflow.innerWidth}`,
    };

    // 4. Check section renders
    const sectionExists = await page.locator('#services').count();
    results.tests['section_exists'] = {
      pass: sectionExists > 0,
      detail: sectionExists > 0 ? 'Section #services found' : 'Section #services NOT found',
    };

    // 5. Check cards visible (3 service cards)
    // CarouselCard has buttons with "+" text, look for them in the services section
    const serviceSection = page.locator('#services');

    // Check for card titles
    const consultoria = await serviceSection.getByText('Consultoria Estrategica').count();
    const implementacion = await serviceSection.getByText('Implementacion de IA').count();
    const formacion = await serviceSection.getByText('Formacion y Capacitacion').count();

    const cardsVisible = consultoria > 0 && implementacion > 0 && formacion > 0;
    results.tests['cards_visible'] = {
      pass: cardsVisible,
      detail: `Consultoria=${consultoria > 0}, Implementacion=${implementacion > 0}, Formacion=${formacion > 0}`,
    };

    // 6. Check "+" buttons exist and are clickable
    const plusButtons = await serviceSection.locator('button').filter({ hasText: '+' }).count();
    // Also look for buttons with aria-label containing service names or generic open buttons
    const allButtons = await serviceSection.locator('button').count();
    results.tests['plus_buttons_exist'] = {
      pass: plusButtons >= 3 || allButtons >= 3,
      detail: `Plus buttons: ${plusButtons}, Total buttons in section: ${allButtons}`,
    };

    // 7. Click first "+" button to open modal
    let modalOpened = false;
    try {
      // Find clickable buttons in the service cards
      const clickableButtons = serviceSection.locator('button').filter({ hasText: '+' });
      const btnCount = await clickableButtons.count();

      if (btnCount > 0) {
        await clickableButtons.first().click({ timeout: 5000 });
        await page.waitForTimeout(500);

        // Check if modal opened (ServiceModal should render with role="dialog" or similar)
        const modalVisible = await page.locator('[role="dialog"]').count();
        const overlayVisible = await page.locator('.fixed.inset-0').count();
        // Also check for modal content by looking for "Que incluye?" text
        const modalContent = await page.getByText('Que incluye?').count();

        modalOpened = modalVisible > 0 || overlayVisible > 0 || modalContent > 0;
      } else {
        // Try clicking any button in the section
        const anyBtn = serviceSection.locator('button');
        if ((await anyBtn.count()) > 0) {
          await anyBtn.first().click({ timeout: 5000 });
          await page.waitForTimeout(500);
          const modalContent = await page.getByText('Que incluye?').count();
          modalOpened = modalContent > 0;
        }
      }
    } catch (e) {
      modalOpened = false;
    }

    results.tests['modal_opens_on_click'] = {
      pass: modalOpened,
      detail: modalOpened ? 'Modal opened after clicking card button' : 'Modal did NOT open',
    };

    // 8. Close modal if opened
    if (modalOpened) {
      try {
        // Press Escape to close
        await page.keyboard.press('Escape');
        await page.waitForTimeout(300);

        const modalStillOpen = await page.getByText('Que incluye?').count();
        results.tests['modal_closes'] = {
          pass: modalStillOpen === 0,
          detail: modalStillOpen === 0 ? 'Modal closed with Escape' : 'Modal still open after Escape',
        };
      } catch {
        results.tests['modal_closes'] = { pass: false, detail: 'Error closing modal' };
      }
    } else {
      results.tests['modal_closes'] = { pass: false, detail: 'Skipped - modal did not open' };
    }

    // 9. Desktop-specific checks (>= 768px)
    if (viewport.isDesktop) {
      // Check for HeroServiceCard background (aria-hidden="true" or bg element)
      const heroCardBg = await page.locator('#services [aria-hidden="true"]').count();
      const bgHeroDiv = await page.locator('#services .absolute.inset-0.z-0').count();
      results.tests['hero_card_bg_exists'] = {
        pass: heroCardBg > 0 || bgHeroDiv > 0,
        detail: `aria-hidden elements: ${heroCardBg}, bg-hero divs: ${bgHeroDiv}`,
      };

      // Check section has h-screen (pinning indicator)
      const hasHScreen = await page.evaluate(() => {
        const section = document.getElementById('services');
        if (!section) return false;
        const style = window.getComputedStyle(section);
        return (
          section.classList.contains('h-screen') ||
          style.height === `${window.innerHeight}px`
        );
      });
      results.tests['section_pinnable'] = {
        pass: hasHScreen,
        detail: hasHScreen ? 'Section has h-screen class (pinnable)' : 'Section does NOT have h-screen',
      };

      // Check grid is 3-column on desktop
      const gridCols = await page.evaluate(() => {
        const section = document.getElementById('services');
        if (!section) return null;
        const grid = section.querySelector('.grid');
        if (!grid) return null;
        const style = window.getComputedStyle(grid);
        return {
          gridTemplateColumns: style.gridTemplateColumns,
          display: style.display,
        };
      });
      results.tests['grid_3_columns'] = {
        pass: gridCols && gridCols.gridTemplateColumns && gridCols.gridTemplateColumns.split(' ').length >= 3,
        detail: gridCols ? `grid-template-columns: ${gridCols.gridTemplateColumns}` : 'No grid found',
      };
    } else {
      // Mobile-specific: should NOT have expanding card (no h-screen, no hero bg)
      const hasHScreen = await page.evaluate(() => {
        const section = document.getElementById('services');
        return section ? section.classList.contains('h-screen') : false;
      });
      results.tests['no_expanding_card'] = {
        pass: !hasHScreen,
        detail: hasHScreen ? 'FAIL: h-screen found on mobile (expanding card active)' : 'Correctly no h-screen on mobile',
      };
    }

    // 10. Console errors check
    const criticalErrors = results.consoleErrors.filter(
      (e) => !e.includes('favicon') && !e.includes('net::ERR') && !e.includes('404')
    );
    results.tests['no_console_errors'] = {
      pass: criticalErrors.length === 0,
      detail:
        criticalErrors.length === 0
          ? 'No critical console errors'
          : `${criticalErrors.length} errors: ${criticalErrors.slice(0, 3).join('; ')}`,
    };

    // Take screenshot
    await page.screenshot({
      path: `/Users/cristianbejaranomendez/Documents/GitHub/studiotek-landing/tests/evidence/services-${viewport.name.replace(/\s/g, '-').toLowerCase()}.png`,
      fullPage: false,
    });

  } catch (err) {
    results.tests['critical_error'] = { pass: false, detail: err.message };
  } finally {
    await context.close();
  }

  return results;
}

async function main() {
  // Ensure evidence directory exists
  const { mkdirSync } = await import('fs');
  try {
    mkdirSync('/Users/cristianbejaranomendez/Documents/GitHub/studiotek-landing/tests/evidence', { recursive: true });
  } catch {}

  const browser = await chromium.launch({ headless: true });

  console.log('='.repeat(80));
  console.log('SERVICES SECTION (#services) - VIEWPORT TEST REPORT');
  console.log('='.repeat(80));
  console.log('');

  const allResults = [];

  for (const vp of VIEWPORTS) {
    console.log(`\n--- Testing: ${vp.name} (${vp.width}x${vp.height}) ---`);
    const result = await testViewport(browser, vp);
    allResults.push(result);

    for (const [testName, testResult] of Object.entries(result.tests)) {
      const icon = testResult.pass ? 'PASS' : 'FAIL';
      console.log(`  [${icon}] ${testName}: ${testResult.detail}`);
    }

    if (result.consoleErrors.length > 0) {
      console.log(`  Console errors (${result.consoleErrors.length}):`);
      result.consoleErrors.slice(0, 5).forEach((e) => console.log(`    - ${e}`));
    }
  }

  // Summary table
  console.log('\n\n');
  console.log('='.repeat(80));
  console.log('SUMMARY TABLE');
  console.log('='.repeat(80));

  // Collect all test names
  const allTestNames = new Set();
  allResults.forEach((r) => Object.keys(r.tests).forEach((t) => allTestNames.add(t)));

  // Header
  const header = ['Test', ...allResults.map((r) => r.viewport)];
  console.log(header.join(' | '));
  console.log(header.map((h) => '-'.repeat(h.length)).join(' | '));

  for (const testName of allTestNames) {
    const row = [testName.padEnd(25)];
    for (const result of allResults) {
      const test = result.tests[testName];
      row.push(test ? (test.pass ? 'PASS' : 'FAIL') : 'N/A');
    }
    console.log(row.join(' | '));
  }

  console.log('\n\nTotal viewports tested:', allResults.length);
  const totalTests = allResults.reduce((sum, r) => sum + Object.keys(r.tests).length, 0);
  const totalPassed = allResults.reduce(
    (sum, r) => sum + Object.values(r.tests).filter((t) => t.pass).length,
    0
  );
  console.log(`Total tests: ${totalTests}, Passed: ${totalPassed}, Failed: ${totalTests - totalPassed}`);

  await browser.close();

  // Exit with error code if any test failed
  if (totalPassed < totalTests) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
