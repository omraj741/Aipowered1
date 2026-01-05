const { chromium } = require('playwright');
const OpenAI = require('openai');

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

function buildElementSummary(elements) {
  const counts = elements.reduce((acc, el) => {
    acc[el.type] = (acc[el.type] || 0) + 1;
    return acc;
  }, {});
  return counts;
}

async function labelTestNameWithAI(defaultName, context) {
  if (!openai) return defaultName;
  try {
    const prompt = `You are a QA assistant. Suggest a concise, human-friendly test case name for the following action. Return only the name.
Default: ${defaultName}
Context: ${JSON.stringify(context).slice(0, 2000)}`;
    const resp = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You name UI test cases succinctly.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 40
    });
    const name = resp.choices?.[0]?.message?.content?.trim();
    return name || defaultName;
  } catch (_) {
    return defaultName;
  }
}

function toSelectorInfo(locator) {
  return locator.selector || locator.toString?.() || '';
}

function dedupe(arr, key) {
  const seen = new Set();
  return arr.filter(item => {
    const k = item[key];
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

async function extractElements(page) {
  const elements = await page.evaluate(() => {
    const results = [];
    const push = (type, el) => {
      const rect = el.getBoundingClientRect();
      results.push({
        type,
        tag: el.tagName?.toLowerCase() || 'unknown',
        text: (el.innerText || el.value || '').trim().slice(0, 120),
        id: el.id || null,
        name: el.getAttribute('name'),
        classes: el.className || '',
        href: el.getAttribute('href') || null,
        role: el.getAttribute('role') || null,
        visible: rect.width > 0 && rect.height > 0,
      });
    };

    document.querySelectorAll('button').forEach(el => push('button', el));
    document.querySelectorAll('input').forEach(el => push('input', el));
    document.querySelectorAll('a').forEach(el => push('link', el));
    document.querySelectorAll('select').forEach(el => push('select', el));
    document.querySelectorAll('textarea').forEach(el => push('textarea', el));

    return results;
  });

  return elements.filter(e => e.visible);
}

function buildPlaywrightTests(url, elements) {
  const lines = [];
  lines.push("import { test, expect } from '@playwright/test';");
  lines.push('');
  lines.push("test('page loads', async ({ page }) => {");
  lines.push(`  await page.goto('${url}');`);
  lines.push("  await expect(page).toHaveTitle(/.+/);");
  lines.push('});');
  lines.push('');

  let idx = 1;
  for (const el of elements.slice(0, 30)) {
    const defaultName = `interact ${el.type} ${el.text || el.name || el.id || el.tag}`.trim();
    const safeName = defaultName.replace(/['"`]/g, '');
    lines.push(`test('${safeName} #${idx++}', async ({ page }) => {`);
    lines.push(`  await page.goto('${url}');`);
    if (el.type === 'button' || el.type === 'link') {
      const text = (el.text || '').replace(/'/g, "\\'");
      lines.push(`  await page.getByRole('${el.type === 'button' ? 'button' : 'link'}', { name: '${text}' }).first().click();`);
      lines.push('  await expect(page).toHaveURL(/.*/);');
    } else if (el.type === 'input' || el.type === 'textarea') {
      const placeholder = el.name || el.id || el.text || '';
      const safe = placeholder.replace(/'/g, "\\'");
      lines.push(`  const field = page.getByPlaceholder('${safe}').first();`);
      lines.push("  if (await field.count()) { await field.fill('test'); } else { await page.locator('input, textarea').first().fill('test'); }");
      lines.push("  await expect(page).toHaveURL(/.*/);");
    } else {
      lines.push('  // Element type not directly handled; page opened.');
    }
    lines.push('});');
    lines.push('');
  }

  return lines.join('\n');
}

async function generateTestsForUrl({ url, userId, framework = 'playwright', options = {} }) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  const logs = [];

  try {
    logs.push(`Opening ${url}`);
    const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    const status = response?.status();
    logs.push(`Status ${status}`);

    const elements = await extractElements(page);
    logs.push(`Found ${elements.length} elements (visible).`);

    const coverage = buildElementSummary(elements);
    let generatedCode = '';
    if (framework === 'playwright') {
      generatedCode = buildPlaywrightTests(url, elements);
    } else {
      // Placeholder for Selenium+TestNG code generation
      generatedCode = buildPlaywrightTests(url, elements);
    }

    const summary = {
      url,
      elementCounts: coverage,
      totalElements: elements.length,
      framework,
      generatedTestsApprox: Math.min(elements.length, 30) + 1,
      logs,
    };

    return { summary, elements: elements.slice(0, 200), code: generatedCode };
  } finally {
    await browser.close();
  }
}

module.exports = {
  generateTestsForUrl,
};


