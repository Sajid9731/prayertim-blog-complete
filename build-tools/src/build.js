'use strict';
/* prayertim.com static site generator.  Usage: node src/build.js [outputDir] */
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const PT = require('./prayer.js');
const { load, slugify } = require('./loaddata.js');
const ARTICLES = require('./articles.js');
const pages = require('./pages.js');

const OUT = path.resolve(process.argv[2] || path.join(__dirname, '../site'));
const SITE = 'https://prayertim.com';
const EMAIL = 'sajidsgd567@gmail.com';
const NOW = new Date();
const BY = NOW.getUTCFullYear(), BM = NOW.getUTCMonth() + 1, BD = NOW.getUTCDate();
const BUILD_ISO = NOW.toISOString().slice(0, 10);
const BUILD_LONG = `${BD} ${PT.MN[BM - 1]} ${BY}`;

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

/* ---------- assets ---------- */
const ASSET_DIR = path.join(__dirname, 'assets');
fs.mkdirSync(path.join(OUT, 'assets'), { recursive: true });
for (const f of ['style.css', 'app.js']) fs.copyFileSync(path.join(ASSET_DIR, f), path.join(OUT, 'assets', f));
fs.copyFileSync(path.join(ASSET_DIR, 'config.js'), path.join(OUT, 'config.js'));
fs.copyFileSync(path.join(__dirname, 'prayer.js'), path.join(OUT, 'assets', 'prayer.js'));
const VER = crypto.createHash('md5').update(['style.css', 'app.js', 'prayer.js'].map(f => fs.readFileSync(path.join(OUT, 'assets', f))).join('')).digest('hex').slice(0, 8);
const STATIC = path.join(__dirname, 'static');
if (fs.existsSync(STATIC)) for (const f of fs.readdirSync(STATIC)) {
  fs.copyFileSync(path.join(STATIC, f), path.join(OUT, f));
}

/* ---------- data ---------- */
const countries = load(path.join(__dirname, '../data'));
for (const c of countries) {
  c.single = c.cities.length === 1;
  c.url = `/prayer-times/${c.slug}/`;
  for (const ct of c.cities) ct.url = c.single ? c.url : `/prayer-times/${c.slug}/${ct.slug}/`;
}
const byName = (cn, ct) => { const c = countries.find(x => x.name === cn); return c ? (ct ? c.cities.find(x => x.name === ct) : c) : null; };

const ctx = { SITE, EMAIL, VER, BY, BM, BD, BUILD_ISO, BUILD_LONG, countries, byName, ARTICLES, PT, slugify };
const written = [];
function write(url, html) {
  const p = url.endsWith('/') ? url + 'index.html' : url;
  const full = path.join(OUT, p);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, html);
  written.push(url);
}
ctx.write = write;

pages.buildAll(ctx);

/* ---------- search index ---------- */
const idx = [];
for (const c of countries) {
  idx.push({ t: 'country', n: c.name, a: '', c: c.name, u: c.url });
  if (!c.single) for (const ct of c.cities) idx.push({ t: 'city', n: ct.name, a: ct.alias, c: c.name, u: ct.url, la: +ct.lat.toFixed(2), lo: +ct.lng.toFixed(2) });
  else idx[idx.length - 1].t = 'city', Object.assign(idx[idx.length - 1], { n: c.cities[0].name, a: c.cities[0].alias, c: c.name, la: +c.cities[0].lat.toFixed(2), lo: +c.cities[0].lng.toFixed(2) });
}
fs.writeFileSync(path.join(OUT, 'assets', 'search-index.json'), JSON.stringify(idx));

/* ---------- sitemap, robots, ads.txt, headers ---------- */
const urls = written.filter(u => !u.endsWith('404.html'));
const sm = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
  .concat(urls.map(u => `  <url><loc>${SITE}${u}</loc><lastmod>${BUILD_ISO}</lastmod></url>`)).concat(['</urlset>', '']).join('\n');
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), sm);
fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
fs.writeFileSync(path.join(OUT, 'ads.txt'),
  `# ads.txt for prayertim.com\n# After Google AdSense approves the site, replace the line below with your own publisher ID\n# (it looks like pub-1234567890123456) and remove the leading "#".\n# google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0\n`);
fs.writeFileSync(path.join(OUT, '_headers'),
  `/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: camera=(), microphone=(), geolocation=(self)\n\n/assets/*\n  Cache-Control: public, max-age=86400\n\n/sitemap.xml\n  Cache-Control: public, max-age=3600\n`);

console.log(`Built ${written.length} pages into ${OUT}`);
console.log(`Countries: ${countries.length}, cities: ${countries.reduce((a, c) => a + c.cities.length, 0)}, version ${VER}`);
