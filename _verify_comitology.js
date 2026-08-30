const puppeteer = require('C:/Users/huawei/.workbuddy/binaries/node/workspace/node_modules/puppeteer-core');
const path = require('path');
const FILE = path.resolve(__dirname, 'index.html');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME, headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));

  await page.goto('file://' + FILE, { waitUntil: 'networkidle0' });
  await page.waitForSelector('.rb-pill-nav-btn', { timeout: 30000 });

  const clicked = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('.rb-pill-nav-btn'));
    const t = btns.find(b => (b.textContent || '').includes('活性物质清单'));
    if (t) { t.click(); return t.textContent.trim(); }
    return null;
  });
  console.log('nav:', clicked);
  await page.waitForSelector('.rbv-row', { timeout: 30000 });
  await new Promise(r => setTimeout(r, 1200));

  const targets = ['Deltamethrin','Difenoconazole','Dodine','Pinoxaden','Prothioconazole'];
  const result = await page.evaluate((names) => {
    const out = {};
    const rows = Array.from(document.querySelectorAll('tr, .rbv-row'));
    names.forEach(n => {
      const rowsWith = rows.filter(r => (r.textContent || '').includes(n));
      if (!rowsWith.length) { out[n] = {found:false}; return; }
      const r = rowsWith[0];
      const anchors = Array.from(r.querySelectorAll('a'));
      const src = anchors.find(a => /transparency|comitology|agrinfo|efsa|eur-lex/.test(a.getAttribute('href')||''));
      const hasAgrinfo = anchors.some(a => /agrinfo/.test(a.getAttribute('href')||''));
      const hasComitology = anchors.some(a => /transparency\/comitology-register/.test(a.getAttribute('href')||''));
      const hasBadge = !!r.querySelector('.rbv-src-badge');
      out[n] = {
        found: true,
        href: src ? src.getAttribute('href') : null,
        text: src ? (src.textContent || '').trim().slice(0, 80) : null,
        hasAgrinfo, hasComitology, hasBadge,
        rowExcerpt: r.textContent.replace(/\s+/g,' ').slice(0,200)
      };
    });
    return out;
  }, targets);

  console.log('\n=== data source results ===');
  for (const n of targets) {
    const r = result[n];
    if (!r.found) { console.log(n, ': NOT FOUND'); continue; }
    console.log(n + ':');
    console.log('  href:', r.href);
    console.log('  text:', r.text);
    console.log('  hasAgrinfo:', r.hasAgrinfo, '| hasComitology:', r.hasComitology, '| hasBadge:', r.hasBadge);
  }
  console.log('\nCONSOLE ERRORS:', errors.length, errors.slice(0,3));

  const allOfficial = targets.every(n => result[n].found && result[n].hasComitology && !result[n].hasAgrinfo && !result[n].hasBadge);
  console.log(allOfficial ? '\nPASS - all 5 show official comitology link' : '\nFAIL');

  await browser.close();
  process.exit(allOfficial ? 0 : 1);
})().catch(e => { console.error('SCRIPT ERROR', e); process.exit(2); });