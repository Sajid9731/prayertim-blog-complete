'use strict';
const PT = require('./prayer.js');
const legal = require('./legal.js');

const esc = PT.esc;
const LOGO = '<svg viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" rx="14" fill="#073d2e"/><path d="M32 12c-7 0-12 6-12 13h24c0-7-5-13-12-13z" fill="#c9a227"/><rect x="16" y="25" width="32" height="5" rx="1" fill="#f3e7b8"/><rect x="19" y="30" width="26" height="20" fill="#e9f3ee"/><path d="M27 50V39a5 5 0 0 1 10 0v11z" fill="#073d2e"/><rect x="10" y="22" width="5" height="28" fill="#f3e7b8"/><rect x="49" y="22" width="5" height="28" fill="#f3e7b8"/><path d="M12.5 14l3 8h-6z M51.5 14l3 8h-6z" fill="#c9a227"/></svg>';

function methodLine(code) {
  const M = PT.METHODS[code]; let s = `Fajr at ${M.fajr}°`;
  s += M.ishaMin ? `, Isha ${M.ishaMin} minutes after Maghrib` : `, Isha at ${M.isha}°`;
  if (M.maghribAngle) s += `, Maghrib at ${M.maghribAngle}° below the horizon`;
  return s;
}
function plural(n, w) { return n + ' ' + w + (n === 1 ? '' : 's'); }
function dispName(ct) { return ct.alias ? `${ct.name} (${ct.alias})` : ct.name; }
function fmtCoord(v, pos, neg) { return Math.abs(v).toFixed(2) + '° ' + (v >= 0 ? pos : neg); }
function offStr(h) { const s = h < 0 ? '-' : '+'; const a = Math.abs(h), hh = Math.floor(a), mm = Math.round((a - hh) * 60); return 'UTC' + s + hh + (mm ? ':' + String(mm).padStart(2, '0') : ''); }
function dstInfo(ct) {
  const w = PT.tzOffset(ct.tz, 2026, 1, 15, ct.lng), s = PT.tzOffset(ct.tz, 2026, 7, 15, ct.lng);
  if (w === s) return { dst: false, text: `${ct.name} does not change its clocks during the year (${offStr(w)}), so prayer times move only with the sun.` };
  return { dst: true, text: `Clocks in ${ct.name} change seasonally (${offStr(Math.min(w, s))} and ${offStr(Math.max(w, s))}). The timetable on this page follows the local clock automatically, so the times shift by an hour on the day the clocks change.` };
}
function hash(s) { let h = 0; for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return h; }

/* ---------- layout ---------- */
function make(ctx) {
  const { SITE, VER, EMAIL, BUILD_LONG, BUILD_ISO } = ctx;
  const A = ctx.ARTICLES;

  function head(o) {
    const url = SITE + o.path;
    const og = `${SITE}/og-image.png`;
    const ld = (o.ld || []).map(x => `<script type="application/ld+json">${JSON.stringify(x)}</script>`).join('\n');
    return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(o.title)}</title>
<meta name="description" content="${esc(o.desc)}">
<link rel="canonical" href="${url}">
<meta name="robots" content="${o.noindex ? 'noindex,follow' : 'index,follow,max-image-preview:large'}">
<meta name="theme-color" content="#0d5c46">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<meta property="og:type" content="${o.ogType || 'website'}">
<meta property="og:site_name" content="prayertim.com">
<meta property="og:title" content="${esc(o.ogTitle || o.title)}">
<meta property="og:description" content="${esc(o.desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${og}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="prayertim.com – prayer times for every country">
<meta property="og:locale" content="en_US">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(o.ogTitle || o.title)}">
<meta name="twitter:description" content="${esc(o.desc)}">
<meta name="twitter:image" content="${og}">
<link rel="stylesheet" href="/assets/style.css?v=${VER}">
<!-- ADSENSE_SNIPPET (paste your Google AdSense code here after you sign up) -->
${ld}
</head>`;
  }

  function header(active) {
    const nav = [['/', 'Home'], ['/prayer-times/', 'Countries'], ['/blog/', 'Blog'], ['/methodology/', 'Methodology'], ['/about/', 'About']]
      .map(([u, t]) => `<a href="${u}"${u === active ? ' aria-current="page"' : ''}>${t}</a>`).join('');
    return `<body>
<a class="skip" href="#main">Skip to content</a>
<header class="site-header"><div class="wrap">
<a class="logo" href="/" aria-label="prayertim.com home">${LOGO}<b>prayertim<span>.com</span></b></a>
<div class="searchbar"><input id="q" type="search" placeholder="Search city or country…" autocomplete="off" aria-label="Search for a city or country" role="combobox" aria-expanded="false" aria-controls="sres"><ul class="sres" id="sres" hidden></ul></div>
<nav class="main-nav" aria-label="Main">${nav}</nav>
</div></header>
<main id="main"><div class="wrap">`;
  }

  function footer() {
    const pop = [['saudi-arabia', 'makkah', 'Makkah'], ['pakistan', 'karachi', 'Karachi'], ['india', 'new-delhi', 'New Delhi'], ['bangladesh', 'dhaka', 'Dhaka'], ['united-arab-emirates', 'dubai', 'Dubai'], ['united-kingdom', 'london', 'London'], ['united-states', 'new-york', 'New York'], ['turkey', 'istanbul', 'Istanbul']]
      .map(([c, t, n]) => `<li><a href="/prayer-times/${c}/${t}/">${n} prayer times</a></li>`).join('');
    return `</div></main>
<footer class="site-footer"><div class="wrap">
<div class="fcols">
<div><h2>prayertim.com</h2><p>Prayer times, azan timetables and Hijri dates for every country, with plain-language guides to how they are calculated.</p></div>
<div><h2>Explore</h2><ul><li><a href="/prayer-times/">All countries A–Z</a></li><li><a href="/blog/">Blog &amp; guides</a></li><li><a href="/methodology/">How we calculate</a></li></ul></div>
<div><h2>Popular cities</h2><ul>${pop}</ul></div>
<div><h2>Site</h2><ul><li><a href="/about/">About us</a></li><li><a href="/contact/">Contact us</a></li><li><a href="/privacy-policy/">Privacy policy</a></li><li><a href="/terms/">Terms of service</a></li><li><a href="/disclaimer/">Disclaimer</a></li></ul></div>
</div>
<p class="copy">&copy; ${ctx.BY} prayertim.com. All rights reserved. Prayer times are calculated and may differ from your local mosque; see the <a href="/disclaimer/">disclaimer</a>.</p>
</div></footer>
<div class="cookie" id="cookie" role="dialog" aria-label="Notice about cookies and local storage" hidden>
<p>This site saves your calculation settings in your browser, and Google and its partners may use cookies to show and measure ads. See our <a href="/privacy-policy/">privacy policy</a> for details and choices.</p>
<button class="btn" id="cookie-ok" type="button">OK</button>
</div>
<script src="/config.js"></script>
<script src="/assets/prayer.js?v=${VER}"></script>
<script src="/assets/app.js?v=${VER}" defer></script>
</body>
</html>`;
  }

  function crumbs(list) {
    const li = list.map((c, i) => i === list.length - 1 ? `<li aria-current="page">${esc(c[1])}</li>` : `<li><a href="${c[0]}">${esc(c[1])}</a></li>`).join('');
    return `<nav class="crumbs" aria-label="Breadcrumb"><ol>${li}</ol></nav>`;
  }
  function crumbLd(list) {
    return { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: list.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c[1], item: SITE + c[0] })) };
  }
  function optionsBox() {
    const ms = Object.keys(PT.METHODS).map(k => `<option value="${k}">${esc(PT.METHODS[k].name)} (${methodLine(k).replace(/,.*Isha/, ' / Isha').replace(/ at /g, ' ')})</option>`).join('');
    return `<details class="optbox noprint"><summary>Options: calculation method, Asr school, 12/24-hour time</summary>
<form id="optform" class="opts" onsubmit="return false">
<div><label for="opt-method">Calculation method</label><select id="opt-method"><option value="auto">Default for this place</option>${ms}</select></div>
<div><label for="opt-school">Asr (juristic school)</label><select id="opt-school"><option value="auto">Default for this place</option><option value="0">Standard (Shafi'i, Maliki, Hanbali)</option><option value="1">Hanafi</option></select></div>
<div><label for="opt-fmt">Time format</label><select id="opt-fmt"><option value="12">12-hour (AM/PM)</option><option value="24">24-hour</option></select></div>
<div><button class="btn ghost" type="button" id="opt-reset">Reset to default</button></div>
</form><p class="note">Your choices are saved only in this browser.</p></details>`;
  }
  function page(o, body) {
    return head(o) + '\n' + header(o.active || '') + '\n' + body + '\n' + footer();
  }
  function liveRowAttrs(ct) {
    return `data-lat="${ct.lat}" data-lng="${ct.lng}" data-tz="${ct.tz}" data-method="${ct.country.method}" data-school="${ct.country.school}"`;
  }
  function liveRow(ct, label, href, h24) {
    const now = PT.nowIn(ct.tz, new Date(Date.UTC(ctx.BY, ctx.BM - 1, ctx.BD, 12)));
    const t = PT.day({ lat: ct.lat, lng: ct.lng, tz: ct.tz, method: ct.country.method, school: ct.country.school }, ctx.BY, ctx.BM, ctx.BD);
    return `<tr ${liveRowAttrs(ct)}><th scope="row"><a href="${href}">${esc(label)}</a></th>` +
      PT.NAMES.map(n => `<td data-k="${n[0]}">${PT.fmt(t[n[0]], false)}</td>`).join('') + '</tr>';
  }
  function liveTable(rows, firstCol, caption) {
    return `<div class="twrap"><table class="pt"><caption>${esc(caption)}</caption><thead><tr><th scope="col" style="text-align:left">${firstCol}</th>${PT.NAMES.map(n => `<th scope="col">${n[1]}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div>`;
  }
  function postCards(list) {
    return `<div class="posts">${list.map(a => `<article class="post-card"><h3><a href="/blog/${a.slug}/">${esc(a.title)}</a></h3><p>${esc(a.desc)}</p><a href="/blog/${a.slug}/">Read the guide →</a></article>`).join('')}</div>`;
  }
  function faqHtml(list) {
    return `<div class="faq">${list.map(q => `<details><summary>${esc(q[0])}</summary><p>${q[1]}</p></details>`).join('')}</div>`;
  }
  function faqLd(list) {
    return { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: list.map(q => ({ '@type': 'Question', name: q[0], acceptedAnswer: { '@type': 'Answer', text: q[1].replace(/<[^>]+>/g, '') } })) };
  }
  function fit(title, brand) {
    return (title + brand).length <= 68 ? title + brand : title;
  }
  return { head, header, footer, crumbs, crumbLd, optionsBox, page, liveRow, liveTable, postCards, faqHtml, faqLd, fit };
}

/* ---------- page builders ---------- */
function buildAll(ctx) {
  const { SITE, EMAIL, countries, ARTICLES, write, BUILD_LONG, BUILD_ISO } = ctx;
  const L = make(ctx);
  const BRAND = ' | prayertim.com';
  const nCities = countries.reduce((a, c) => a + c.cities.length, 0);
  const nameCount = {};
  for (const c of countries) for (const ct of c.cities) nameCount[ct.name] = (nameCount[ct.name] || 0) + 1;
  const cityTitle = (ct, c) => { const D = dispName(ct); const base = `${D}${nameCount[ct.name] > 1 ? ', ' + c.name : ''} Prayer Times Today & Monthly Timetable`; return L.fit(base, BRAND); };
  const cityDesc = (ct, c) => { const D = dispName(ct); const d1 = `Prayer times in ${D}, ${c.name} today: Fajr, Dhuhr, Asr, Maghrib and Isha, plus a full monthly namaz timetable with Hijri dates and Qibla.`; return d1.length <= 158 ? d1 : `Prayer times in ${ct.name}, ${c.name}: today's five prayers, monthly namaz timetable, Hijri dates and Qibla direction.`; };
  const T = (a) => ARTICLES.find(x => x.slug === a);

  /* ===== Home ===== */
  (function () {
    const feat = [['Saudi Arabia', 'Makkah'], ['Saudi Arabia', 'Madinah'], ['Saudi Arabia', 'Riyadh'], ['Pakistan', 'Karachi'], ['Pakistan', 'Lahore'], ['Bangladesh', 'Dhaka'], ['India', 'New Delhi'], ['United Arab Emirates', 'Dubai'], ['Turkey', 'Istanbul'], ['Egypt', 'Cairo'], ['Indonesia', 'Jakarta'], ['United Kingdom', 'London'], ['United States', 'New York'], ['Canada', 'Toronto']];
    const rows = feat.map(([c, t]) => { const ct = ctx.byName(c, t); return L.liveRow(ct, ct.alias ? ct.name : ct.name, ct.url); }).join('');
    const popC = ['Saudi Arabia', 'Pakistan', 'India', 'Bangladesh', 'Indonesia', 'Egypt', 'Turkey', 'United Arab Emirates', 'Malaysia', 'United Kingdom', 'United States', 'Canada', 'Australia', 'Nigeria', 'Morocco', 'Iran', 'Iraq', 'Qatar', 'Kuwait', 'Oman', 'Jordan', 'South Africa', 'Germany', 'France']
      .map(n => ctx.byName(n)).map(c => `<li><a href="${c.url}">${esc(c.name)} <small>${c.single ? 'city' : plural(c.cities.length, 'city').replace('citys', 'cities')}</small></a></li>`).join('');
    const letters = [...new Set(countries.map(c => c.name[0].toUpperCase()))];
    const az = letters.map(l => `<li><a href="/prayer-times/#letter-${l.toLowerCase()}">${l}</a></li>`).join('');
    const body = `
<section class="hero">
<h1>Prayer Times Today: Namaz &amp; Azan Timetable for Every Country</h1>
<p>Check today's Fajr, Dhuhr, Asr, Maghrib and Isha for ${nCities.toLocaleString('en-US')} cities in ${countries.length} countries, open a full monthly timetable with Hijri dates, and learn how the times are calculated.</p>
<p><button class="btn gold" id="geo-btn" type="button">Use my location</button> <a class="btn ghost" href="/prayer-times/">Browse countries A–Z</a></p>
<div id="geo-out" aria-live="polite" style="margin-top:12px;color:#fff"></div>
</section>
<section class="card"><h2>Prayer times in popular cities</h2>
<p class="lead">Today's times for some of the most searched cities. Select a city for its full monthly timetable.</p>
${L.optionsBox()}
${L.liveTable(rows, 'City', 'Today\'s prayer times (each city in its own local time)')}
<p class="note">Times are calculated for each city's coordinates and local time zone using that region's usual method (see <a href="/methodology/">methodology</a>). They can differ by a few minutes from your local mosque.</p>
</section>
<section class="card"><h2>Browse prayer times by country</h2>
<ul class="az" aria-label="Jump to letter">${az}</ul>
<ul class="grid">${popC}</ul>
<p style="margin-top:14px"><a class="btn" href="/prayer-times/">See all ${countries.length} countries</a></p>
</section>
<section class="card"><h2>Accurate namaz times, explained</h2>
<p>prayertim.com calculates the five daily prayer times from the position of the sun at your exact location. Fajr begins at true dawn, Dhuhr just after the sun passes its highest point, Asr when an object's shadow reaches a set length, Maghrib at sunset and Isha when evening twilight ends. Because every one of these depends on latitude, longitude and the date, a timetable for one city cannot be copied to another a few hundred kilometres away.</p>
<p>Scholars and institutions use slightly different angles for Fajr and Isha, and two schools of thought define Asr differently. We start each country on the method most commonly used there and let you change it in one click. Read the full explanation on our <a href="/methodology/">methodology page</a> or in our guides below.</p>
<h3>What you can do here</h3>
<ul><li>See today's times and a live countdown to the next prayer for any listed city.</li><li>Open a month-by-month timetable you can print, with Gregorian and Hijri dates.</li><li>Switch between calculation methods, Standard or Hanafi Asr, and 12 or 24-hour time.</li><li>Check the Qibla direction from the city you choose.</li></ul>
</section>
<section class="card"><h2>Guides from the blog</h2>${L.postCards(ARTICLES.slice(0, 3))}<p style="margin-top:14px"><a href="/blog/">All guides →</a></p></section>`;
    const ld = [{ '@context': 'https://schema.org', '@type': 'WebSite', name: 'prayertim.com', url: SITE + '/', description: 'Prayer times, azan timetables and Hijri dates for every country.' },
      { '@context': 'https://schema.org', '@type': 'Organization', name: 'prayertim.com', url: SITE + '/', logo: SITE + '/apple-touch-icon.png', email: EMAIL }];
    write('/', L.page({ path: '/', active: '/', title: 'Prayer Times Today: Namaz & Azan Timetable Worldwide' + BRAND, desc: `Accurate prayer times for ${nCities.toLocaleString('en-US')} cities in ${countries.length} countries: today's Fajr, Dhuhr, Asr, Maghrib and Isha, monthly timetables, Hijri dates and Qibla.`, ld }, body));
  })();

  /* ===== Countries index ===== */
  (function () {
    const groups = {};
    for (const c of countries) (groups[c.name[0].toUpperCase()] = groups[c.name[0].toUpperCase()] || []).push(c);
    const letters = Object.keys(groups).sort();
    const az = letters.map(l => `<li><a href="#letter-${l.toLowerCase()}">${l}</a></li>`).join('');
    const sec = letters.map(l => `<h2 class="letter" id="letter-${l.toLowerCase()}">${l}</h2><ul class="grid">${groups[l].map(c => `<li><a href="${c.url}">${esc(c.name)} <small>${c.single ? 'city' : c.cities.length + ' cities'}</small></a></li>`).join('')}</ul>`).join('');
    const bc = [['/', 'Home'], ['/prayer-times/', 'Countries']];
    const body = `${L.crumbs(bc)}
<div class="card"><h1>Prayer Times by Country (A–Z)</h1>
<p class="lead">Choose a country to see prayer times for its main cities. All ${countries.length} countries and ${nCities.toLocaleString('en-US')} cities below have their own page with today's times and a full monthly timetable.</p>
<ul class="az" aria-label="Jump to letter">${az}</ul>${sec}</div>`;
    write('/prayer-times/', L.page({ path: '/prayer-times/', active: '/prayer-times/', title: `Prayer Times by Country A–Z: ${countries.length} Countries${BRAND}`, desc: `Browse prayer times for all ${countries.length} countries from A to Z. Pick a country, then a city, for today's namaz times and a monthly timetable.`, ld: [L.crumbLd(bc)] }, body));
  })();

  /* ===== Country pages ===== */
  const faqFor = (ct, c, d) => {
    const q = PT.qibla(ct.lat, ct.lng), M = PT.METHODS[c.method], D = dispName(ct);
    return [
      [`What are today's prayer times in ${D}?`, `They are shown at the top of this page. They are calculated for ${ct.name}'s coordinates and its time zone (${ct.tz}), and the page refreshes them automatically every day, so you always see the current date.`],
      [`Which calculation method is used for ${ct.name}?`, `By default this page uses the ${M.name} method (${methodLine(c.method)}), which is the usual choice for ${c.name}. You can change the method in the Options box above if your local authority or mosque uses another one.`],
      [`How is Asr time calculated in ${ct.name}?`, `${c.school ? 'The default here is the Hanafi calculation, where Asr begins when an object\'s shadow is twice its length (plus the noon shadow), because most local Muslims follow the Hanafi school.' : 'The default here is the Standard (Shafi\'i, Maliki and Hanbali) calculation, where Asr begins when an object\'s shadow equals its length (plus the noon shadow).'} Use the Options box to switch to ${c.school ? 'Standard' : 'Hanafi'} Asr, which begins later.`],
      [`Does ${ct.name} change its clocks for daylight saving time?`, d.text],
      [`What is the Qibla direction in ${ct.name}?`, `The Qibla from ${ct.name} is about ${Math.round(q.deg)}° clockwise from true north (${q.dir}), roughly ${q.km.toLocaleString('en-US')} km along the great circle to the Kaaba in Makkah. A compass shows magnetic north, which differs slightly from true north, so check your local magnetic declination.`],
      [`Can I use these times instead of my local mosque timetable?`, `These times are calculated from astronomy and are a reliable guide, but many mosques publish their own adhan and iqamah times, sometimes with fixed adjustments. If your mosque publishes a timetable, follow it for congregational prayers.`]
    ];
  };

  function cityBody(ct, c, bc) {
    const D = dispName(ct), q = PT.qibla(ct.lat, ct.lng), M = PT.METHODS[c.method], d = dstInfo(ct), f = faqFor(ct, c, d);
    const place = ct.name === c.name ? D : `${D}, ${c.name}`;
    const cfg = { lat: ct.lat, lng: ct.lng, tz: ct.tz, method: c.method, school: c.school };
    const rows = PT.monthRowsHtml(cfg, ctx.BY, ctx.BM, false, 0);
    const t0 = PT.day(cfg, ctx.BY, ctx.BM, ctx.BD);
    const intros = [
      `This page gives the prayer times for ${place}: Fajr, Sunrise, Dhuhr, Asr, Maghrib and Isha for today, plus a full monthly timetable. The times are calculated from ${ct.name}'s coordinates (${fmtCoord(ct.lat, 'N', 'S')}, ${fmtCoord(ct.lng, 'E', 'W')}) and local time zone (${ct.tz}), so they follow the sun and adjust automatically when clocks change.`,
      `Looking for accurate namaz timings in ${D}? Below are today's azan times and a complete month-by-month timetable for ${place}, worked out for the city's exact location and its time zone (${ct.tz}).`,
      `${D} prayer times, updated automatically every day. Check today's Fajr, Dhuhr, Asr, Maghrib and Isha for ${ct.name === c.name ? ct.name : ct.name + ' in ' + c.name}, follow the countdown to the next prayer, and open the monthly timetable with Hijri dates.`
    ];
    const intro = intros[hash(ct.slug + c.slug) % 3];
    const others = c.single ? [] : c.cities.filter(x => x !== ct).slice(0, 14);
    const near = others.length ? `<section class="card"><h2>Prayer times in other cities in ${esc(c.name)}</h2><ul class="grid">${others.map(o => `<li><a href="${o.url}">${esc(o.name)}</a></li>`).join('')}</ul><p style="margin-top:12px"><a href="${c.url}">All cities in ${esc(c.name)} →</a></p></section>` : '';
    const rel = ['how-prayer-times-are-calculated', 'prayer-time-calculation-methods-compared', 'hanafi-vs-shafii-asr-time'].map(T);
    return `${L.crumbs(bc)}
<div class="card" id="today-app" data-lat="${ct.lat}" data-lng="${ct.lng}" data-tz="${ct.tz}" data-method="${c.method}" data-school="${c.school}" data-name="${esc(ct.name)}">
<h1>Prayer Times in ${esc(place)} – Today &amp; Monthly Timetable</h1>
<p class="lead">${intro}</p>
<div class="today-head"><span class="date" id="today-date"></span><span class="hijri" id="today-hijri"></span></div>
<div class="pcards" id="today-cards">${PT.cardsHtml(t0, false, '')}</div>
<p class="nextline" id="nextline" hidden></p>
<p class="note" style="margin-top:12px">Method: <span id="method-now">${esc(M.name)} · ${c.school ? 'Hanafi Asr' : 'Standard Asr'}</span>. Times are in ${esc(ct.name)} local time.</p>
${L.optionsBox()}
</div>
<section class="card"><h2 id="month-title">Prayer timetable for ${esc(ct.name)} – ${PT.MN[ctx.BM - 1]} ${ctx.BY}</h2>
<div class="tools noprint"><button type="button" id="month-prev" aria-label="Previous month">← Previous month</button><button type="button" id="month-next" aria-label="Next month">Next month →</button><button type="button" id="print-btn">Print timetable</button></div>
<div class="twrap"><table class="pt"><caption>Monthly prayer times for ${esc(ct.name)}, ${esc(c.name)}: <span id="month-cap">${PT.MN[ctx.BM - 1]} ${ctx.BY}</span></caption>
<thead><tr><th scope="col" style="text-align:left">Date</th>${PT.NAMES.map(n => `<th scope="col">${n[1]}</th>`).join('')}</tr></thead><tbody id="month-body">${rows}</tbody></table></div>
<p class="note">Friday rows are highlighted: Dhuhr is replaced by the Jumu'ah (Friday) prayer. Hijri dates follow the Umm al-Qura calendar and may differ by a day from local moon sighting.</p>
</section>
<section class="card"><h2>About prayer times in ${esc(ct.name)}</h2>
<table class="facts"><tbody>
<tr><th scope="row">Location</th><td>${fmtCoord(ct.lat, 'N', 'S')}, ${fmtCoord(ct.lng, 'E', 'W')}</td></tr>
<tr><th scope="row">Time zone</th><td>${esc(ct.tz)} (${offStr(PT.tzOffset(ct.tz, ctx.BY, ctx.BM, ctx.BD, ct.lng))} on ${BUILD_LONG})</td></tr>
<tr><th scope="row">Default method</th><td>${esc(M.name)}: ${esc(methodLine(c.method))}</td></tr>
<tr><th scope="row">Default Asr</th><td>${c.school ? 'Hanafi (shadow = 2× object height)' : 'Standard (shadow = 1× object height)'}</td></tr>
<tr><th scope="row">Qibla direction</th><td>${Math.round(q.deg)}° from true north (${q.dir}), about ${q.km.toLocaleString('en-US')} km to the Kaaba</td></tr>
</tbody></table>
<p style="margin-top:14px">${esc(c.name)} is set to the ${esc(M.short)} method by default on this site because it is widely used in the region. Every method gives the same Dhuhr, Maghrib and Sunrise (apart from small fixed adjustments); they differ mainly in how early Fajr starts and how late Isha begins. If your local mosque or religious authority publishes its own timetable, choose the matching method in the Options box or follow the mosque's timetable for congregational prayers.</p>
<p>${esc(d.text)}</p>
</section>
<section class="card"><h2>Frequently asked questions about prayer times in ${esc(ct.name)}</h2>${L.faqHtml(f)}</section>
${near}
<section class="card"><h2>Learn more</h2>${L.postCards(rel)}</section>`;
  }

  for (const c of countries) {
    if (c.single) {
      const ct = c.cities[0], D = dispName(ct);
      const bc = [['/', 'Home'], ['/prayer-times/', 'Countries'], [c.url, c.name]];
      const f = faqFor(ct, c, dstInfo(ct));
      const title = cityTitle(ct, c);
      const desc = cityDesc(ct, c);
      write(c.url, L.page({ path: c.url, active: '/prayer-times/', title, desc, ld: [L.crumbLd(bc), L.faqLd(f)] }, cityBody(ct, c, bc)));
      continue;
    }
    const M = PT.METHODS[c.method];
    const bc = [['/', 'Home'], ['/prayer-times/', 'Countries'], [c.url, c.name]];
    const zones = [...new Set(c.cities.map(x => x.tz))];
    const dstAny = c.cities.some(x => dstInfo(x).dst);
    const rows = c.cities.map(ct => L.liveRow(ct, dispName(ct), ct.url)).join('');
    const idx = countries.indexOf(c), nearC = [-4, -3, -2, -1, 1, 2, 3, 4].map(k => countries[(idx + k + countries.length) % countries.length]);
    const q = [
      [`What are the prayer times in ${c.name} today?`, `The table at the top of this page lists today's Fajr, Sunrise, Dhuhr, Asr, Maghrib and Isha for ${plural(c.cities.length, 'city').replace('citys', 'cities')} in ${c.name}. Select a city to see its full monthly timetable.`],
      [`Which calculation method is used in ${c.name}?`, `This site defaults to the ${M.name} method (${methodLine(c.method)}) for ${c.name}, with ${c.school ? 'Hanafi' : 'Standard'} Asr. You can change both in the Options box.`],
      [`Do prayer times differ between cities in ${c.name}?`, `Yes. Prayer times depend on a city's latitude and longitude, so cities in ${c.name} can differ by several minutes even on the same day${zones.length > 1 ? ', and the country spans more than one time zone' : ''}.`]
    ];
    const body = `${L.crumbs(bc)}
<div class="card"><h1>Prayer Times in ${esc(c.name)} – City-wise Namaz Timetable</h1>
<p class="lead">Today's prayer times for ${plural(c.cities.length, 'city').replace('citys', 'cities')} in ${esc(c.name)}. Select a city to open its monthly timetable with Hijri dates and Qibla direction.</p>
${L.optionsBox()}
${L.liveTable(rows, 'City', `Today's prayer times in ${c.name} (local time)`)}
<p class="note">Default method: ${esc(M.name)} (${esc(methodLine(c.method))}), ${c.school ? 'Hanafi' : 'Standard'} Asr. Times are calculated for each city's coordinates.</p>
</div>
<section class="card"><h2>About prayer times in ${esc(c.name)}</h2>
<p>${esc(c.name)} is listed here with ${plural(c.cities.length, 'major city').replace('citys', 'cities')}, starting with ${esc(c.cities[0].name)}. ${zones.length > 1 ? `The country covers ${zones.length} time zones, so every city page uses its own local time.` : `All cities use the ${esc(zones[0])} time zone.`} ${dstAny ? 'Some or all of the country changes its clocks seasonally; the timetables follow the local clock automatically.' : 'Clocks do not change seasonally, so prayer times shift only with the sun through the year.'}</p>
<p>The ${esc(M.short)} method sets ${esc(methodLine(c.method).toLowerCase())}. ${c.school ? 'Hanafi Asr is the default because most Muslims in this region follow the Hanafi school; Asr begins when a shadow is twice the object\'s length.' : 'Standard Asr is the default; Asr begins when a shadow equals the object\'s length. Hanafi followers can switch to Hanafi Asr, which begins later.'} For the reasoning behind these choices see <a href="/blog/prayer-time-calculation-methods-compared/">calculation methods compared</a> and our <a href="/methodology/">methodology</a>.</p>
</section>
<section class="card"><h2>Frequently asked questions</h2>${L.faqHtml(q)}</section>
<section class="card"><h2>Other countries</h2><ul class="grid">${nearC.map(x => `<li><a href="${x.url}">${esc(x.name)}</a></li>`).join('')}</ul><p style="margin-top:12px"><a href="/prayer-times/">All countries A–Z →</a></p></section>`;
    write(c.url, L.page({ path: c.url, active: '/prayer-times/', title: (`Prayer Times in ${c.name} – City-wise Namaz Timetable` + BRAND).length <= 68 ? `Prayer Times in ${c.name} – City-wise Namaz Timetable` + BRAND : (`Prayer Times in ${c.name}` + BRAND), desc: (`Prayer times in ${c.name} today for ${plural(c.cities.length, 'city').replace('citys', 'cities')}, including ${c.cities.slice(0, 3).map(x => x.name).join(', ')}. Pick a city for its monthly namaz timetable.`).slice(0, 300), ld: [L.crumbLd(bc), L.faqLd(q)] }, body));

    for (const ct of c.cities) {
      const D = dispName(ct);
      const bc2 = [['/', 'Home'], ['/prayer-times/', 'Countries'], [c.url, c.name], [ct.url, ct.name]];
      const f = faqFor(ct, c, dstInfo(ct));
      const title = cityTitle(ct, c);
      const desc = cityDesc(ct, c);
      write(ct.url, L.page({ path: ct.url, active: '/prayer-times/', title, desc, ld: [L.crumbLd(bc2), L.faqLd(f)] }, cityBody(ct, c, bc2)));
    }
  }

  /* ===== Blog ===== */
  (function () {
    const bc = [['/', 'Home'], ['/blog/', 'Blog']];
    write('/blog/', L.page({ path: '/blog/', active: '/blog/', title: 'Prayer Time Guides & Islamic Timekeeping Articles' + BRAND, desc: 'Plain-language guides on how prayer times are calculated, Fajr and Isha angles, Hanafi and Shafi\'i Asr, Qibla, the Hijri calendar and praying while traveling.', ld: [L.crumbLd(bc)] },
      `${L.crumbs(bc)}<div class="card"><h1>Blog &amp; Guides</h1><p class="lead">Clear explanations of the astronomy and rulings behind the five daily prayer times.</p>${L.postCards(ARTICLES)}</div>`));
    for (const a of ARTICLES) {
      const url = `/blog/${a.slug}/`, bc2 = bc.concat([[url, a.title]]);
      const rel = (a.related || []).map(T).filter(Boolean);
      const ld = [L.crumbLd(bc2), { '@context': 'https://schema.org', '@type': 'Article', headline: a.title, description: a.desc, datePublished: a.date, dateModified: BUILD_ISO, author: { '@type': 'Organization', name: 'prayertim.com Editorial Team', url: SITE + '/about/' }, publisher: { '@type': 'Organization', name: 'prayertim.com', logo: { '@type': 'ImageObject', url: SITE + '/apple-touch-icon.png' } }, mainEntityOfPage: SITE + url, image: SITE + '/og-image.png' }];
      const body = `${L.crumbs(bc2)}<article class="card article"><h1>${esc(a.title)}</h1>
<p class="byline">By the prayertim.com Editorial Team · Published ${new Date(a.date + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })}</p>
${a.html}
<div class="callout">Find today's prayer times for your city: <a href="/prayer-times/">browse all countries</a> or use the search box at the top of the page. Calculated times are a guide; follow your local mosque or scholar for rulings.</div>
</article>
${rel.length ? `<section class="card"><h2>Related guides</h2>${L.postCards(rel)}</section>` : ''}`;
      write(url, L.page({ path: url, active: '/blog/', title: L.fit(a.title, BRAND), ogTitle: a.title, ogType: 'article', desc: a.desc, ld }, body));
    }
  })();

  /* ===== Static pages ===== */
  const staticPages = legal.build(ctx, L, { methodLine, countries });
  for (const sp of staticPages) {
    const bc = [['/', 'Home'], [sp.path, sp.crumb]];
    write(sp.path, L.page({ path: sp.path, active: sp.active || '', title: L.fit(sp.title, BRAND), ogTitle: sp.title, desc: sp.desc, ld: [L.crumbLd(bc)].concat(sp.ld || []) }, `${L.crumbs(bc)}${sp.body}`));
  }

  /* ===== 404 ===== */
  write('/404.html', L.page({ path: '/404.html', title: 'Page not found' + BRAND, desc: 'The page you were looking for could not be found.', noindex: true },
    `<div class="card"><h1>Page not found</h1><p class="lead">Sorry, we could not find that page. It may have moved, or the address may be mistyped.</p><p><a class="btn" href="/">Go to the home page</a> <a class="btn ghost" href="/prayer-times/">Browse countries A–Z</a></p></div>`));
}

module.exports = { buildAll };
