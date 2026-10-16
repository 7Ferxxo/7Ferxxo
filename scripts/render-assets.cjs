const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require('playwright');

const TOTAL_FRAMES = 120;
const WIDTH = 960;
const HEIGHT = 330;

(async () => {
  const root = path.resolve(__dirname, '..');
  const frames = path.join(root, '.preview', 'frames');
  fs.rmSync(frames, { recursive: true, force: true });
  fs.mkdirSync(frames, { recursive: true });
  fs.mkdirSync(path.join(root, 'assets'), { recursive: true });
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT }, deviceScaleFactor: 1 });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const preset = JSON.parse(fs.readFileSync(path.join(__dirname, 'profile-preset.json'), 'utf8'));
    const params = new URLSearchParams({ ...preset, capture: '1' });
    await page.goto(pathToFileURL(path.join(root, 'docs', 'index.html')).href + '?' + params);
    await page.evaluate(() => document.fonts.ready);
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      await page.evaluate(t => window.profileArt.render(t), i / TOTAL_FRAMES);
      await page.screenshot({ path: path.join(frames, String(i).padStart(3, '0') + '.png') });
    }
    fs.copyFileSync(path.join(frames, '000.png'), path.join(root, 'assets', 'profile-static.png'));
    if (errors.length) throw new Error(errors.join('\n'));
    const marked = (await import(pathToFileURL(require.resolve('marked')).href)).marked;
    const body = marked(fs.readFileSync(path.join(root, 'README.md'), 'utf8'));
    const html = `<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><base href="../"><title>Vista previa del perfil</title><style>body{margin:0;background:#0d1117;color:#e6edf3;font:16px/1.7 system-ui}main{max-width:940px;margin:36px auto;border:1px solid #30363d;border-radius:8px;padding:28px}img{max-width:100%}a{color:#a9f577;text-decoration:none}a:hover{text-decoration:underline}h2,h3{line-height:1.4}h2{border-bottom:1px solid #30363d;padding-bottom:12px}h3{margin-top:32px}table{border-collapse:collapse;width:100%;font-size:14px}td,th{border:1px solid #30363d;padding:12px;text-align:left}th{background:#151c24}hr{border:0;border-top:1px solid #30363d;margin:32px 0}sub{color:#91a7b7}@media(max-width:650px){main{margin:0;padding:18px;border:0}body{font-size:14px}td,th{padding:8px}}</style><main>${body}</main></html>`;
    fs.writeFileSync(path.join(root, '.preview', 'readme.html'), html);
    console.log(`Rendered ${TOTAL_FRAMES} frames (${WIDTH}x${HEIGHT}), static banner and README preview.`);
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
