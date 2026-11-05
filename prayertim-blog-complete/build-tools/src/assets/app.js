/* prayertim.blog – front-end behaviour (no third-party dependencies) */
(function () {
  'use strict';
  var C = window.PT_CONFIG || {};
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  /* ---------- settings (saved only in this browser) ---------- */
  function loadS() { try { return JSON.parse(localStorage.getItem('pt_settings') || '{}') || {}; } catch (e) { return {}; } }
  function saveS() { try { localStorage.setItem('pt_settings', JSON.stringify(S)); } catch (e) { /* storage blocked */ } }
  var S = loadS(); // { method:'auto'|KEY, school:'auto'|'0'|'1', h24:true|false }
  function h24() { return !!S.h24; }
  function cfgOf(el) {
    var m = el.dataset.method, sc = +el.dataset.school;
    if (S.method && S.method !== 'auto' && window.PT && PT.METHODS[S.method]) m = S.method;
    if (S.school === '0' || S.school === '1') sc = +S.school;
    return { lat: +el.dataset.lat, lng: +el.dataset.lng, tz: el.dataset.tz, method: m, school: sc };
  }

  /* ---------- options form ---------- */
  function initOptions(onChange) {
    var f = $('#optform'); if (!f) return;
    var m = $('#opt-method'), sc = $('#opt-school'), fm = $('#opt-fmt');
    m.value = S.method || 'auto'; sc.value = S.school || 'auto'; fm.value = S.h24 ? '24' : '12';
    function chg() {
      S.method = m.value; S.school = sc.value; S.h24 = fm.value === '24'; saveS(); onChange();
    }
    m.addEventListener('change', chg); sc.addEventListener('change', chg); fm.addEventListener('change', chg);
    var r = $('#opt-reset');
    if (r) r.addEventListener('click', function () { S = {}; saveS(); m.value = 'auto'; sc.value = 'auto'; fm.value = '12'; onChange(); });
  }

  /* ---------- today view (city pages and single-city country pages) ---------- */
  var KEYS = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
  function dmy(y, m, d) { return d + ' ' + PT.MN[m - 1] + ' ' + y; }
  function nextInfo(cfg, now) {
    var t = PT.day(cfg, now.y, now.m, now.d), i;
    for (i = 0; i < KEYS.length; i++) {
      var v = t[KEYS[i]];
      if (!isNaN(v) && now.minutes < v) return { key: KEYS[i], label: PT.NAMES.filter(function (n) { return n[0] === KEYS[i]; })[0][1], mins: v - now.minutes, t: t };
    }
    var nx = new Date(Date.UTC(now.y, now.m - 1, now.d + 1));
    var t2 = PT.day(cfg, nx.getUTCFullYear(), nx.getUTCMonth() + 1, nx.getUTCDate());
    return { key: 'fajr', label: 'Fajr', mins: 1440 - now.minutes + t2.fajr, t: t, tomorrow: true };
  }
  function human(mins) {
    var s = Math.max(0, Math.round(mins * 60)), h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), sec = s % 60;
    return (h ? h + 'h ' : '') + m + 'm ' + (sec < 10 ? '0' : '') + sec + 's';
  }
  var tick = null;
  function renderToday() {
    var app = $('#today-app'); if (!app || !$('#today-cards')) return;
    var cfg = cfgOf(app), now = PT.nowIn(cfg.tz), t = PT.day(cfg, now.y, now.m, now.d);
    var nx = nextInfo(cfg, now);
    $('#today-cards').innerHTML = PT.cardsHtml(t, h24(), nx.tomorrow ? 'fajr' : nx.key);
    var d = $('#today-date'); if (d) d.textContent = dmy(now.y, now.m, now.d);
    var hj = $('#today-hijri'); if (hj) { var h = PT.hijri(now.y, now.m, now.d); hj.textContent = h.text ? h.text + ' (Umm al-Qura calendar)' : ''; }
    var mt = $('#method-now'); if (mt) { var M = PT.METHODS[cfg.method]; mt.textContent = M.name + ' · ' + (cfg.school ? 'Hanafi Asr' : 'Standard Asr'); }
    var nl = $('#nextline');
    clearInterval(tick);
    function upd() {
      var n2 = PT.nowIn(cfg.tz), nn = nextInfo(cfg, n2);
      nl.hidden = false;
      nl.textContent = 'Next prayer: ' + nn.label + (nn.tomorrow ? ' (tomorrow)' : '') + ' in ' + human(nn.mins);
    }
    upd(); tick = setInterval(upd, 1000);
    app.dataset.todayY = now.y; app.dataset.todayM = now.m; app.dataset.todayD = now.d;
  }

  /* ---------- monthly timetable ---------- */
  var cur = null;
  function renderMonth() {
    var app = $('#today-app'), body = $('#month-body'); if (!app || !body || !app.dataset.lat) return;
    var cfg = cfgOf(app), now = PT.nowIn(cfg.tz);
    if (!cur) cur = { y: now.y, m: now.m };
    var todayD = (cur.y === now.y && cur.m === now.m) ? now.d : 0;
    body.innerHTML = PT.monthRowsHtml(cfg, cur.y, cur.m, h24(), todayD);
    var t = $('#month-title'); if (t) t.textContent = 'Prayer timetable for ' + app.dataset.name + ' – ' + PT.MN[cur.m - 1] + ' ' + cur.y;
    var cap = $('#month-cap'); if (cap) cap.textContent = PT.MN[cur.m - 1] + ' ' + cur.y;
  }
  function shiftMonth(delta) {
    var m = cur.m + delta, y = cur.y;
    if (m < 1) { m = 12; y--; } else if (m > 12) { m = 1; y++; }
    cur = { y: y, m: m }; renderMonth();
  }

  /* ---------- live rows (home + country tables) ---------- */
  function renderRows() {
    $$('tr[data-lat]').forEach(function (tr) {
      var cfg = cfgOf(tr), now = PT.nowIn(cfg.tz), t = PT.day(cfg, now.y, now.m, now.d);
      $$('td[data-k]', tr).forEach(function (td) { td.textContent = PT.fmt(t[td.dataset.k], h24()); });
    });
  }

  /* ---------- search ---------- */
  var idx = null, idxLoading = false;
  function norm(s) { return (s || '').normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase(); }
  function loadIndex(cb) {
    if (idx) return cb();
    if (idxLoading) { setTimeout(function () { loadIndex(cb); }, 150); return; }
    idxLoading = true;
    fetch('/assets/search-index.json').then(function (r) { return r.json(); }).then(function (j) { idx = j; cb(); }).catch(function () { idxLoading = false; });
  }
  function initSearch() {
    var q = $('#q'), res = $('#sres'); if (!q || !res) return;
    var items = [], act = -1;
    function close() { res.hidden = true; q.setAttribute('aria-expanded', 'false'); act = -1; }
    function show() {
      var v = norm(q.value.trim());
      if (v.length < 2 || !idx) { close(); return; }
      var out = [];
      for (var i = 0; i < idx.length && out.length < 200; i++) {
        var e = idx[i], n = norm(e.n), a = norm(e.a), c = norm(e.c);
        var sc = -1;
        if (n === v) sc = 0; else if (n.indexOf(v) === 0) sc = 1; else if (a && a.indexOf(v) === 0) sc = 1; else if ((' ' + n).indexOf(' ' + v) > -1) sc = 2; else if (n.indexOf(v) > -1 || (a && a.indexOf(v) > -1)) sc = 3; else if (c.indexOf(v) === 0 && e.t === 'city') sc = 4;
        if (sc > -1) out.push([sc + (e.t === 'country' ? 0 : 0.5), e]);
      }
      out.sort(function (x, y) { return x[0] - y[0] || (x[1].n < y[1].n ? -1 : 1); });
      items = out.slice(0, 8).map(function (o) { return o[1]; });
      if (!items.length) { res.innerHTML = '<li><a href="/prayer-times/"><span>No match — browse all countries</span><small>A–Z</small></a></li>'; res.hidden = false; return; }
      res.innerHTML = items.map(function (e, i) {
        return '<li><a href="' + e.u + '" data-i="' + i + '"><span>' + PT.esc(e.n) + (e.a ? ' <small>(' + PT.esc(e.a) + ')</small>' : '') + '</span><small>' + (e.t === 'city' ? PT.esc(e.c) : 'Country') + '</small></a></li>';
      }).join('');
      res.hidden = false; q.setAttribute('aria-expanded', 'true');
    }
    q.addEventListener('focus', function () { loadIndex(show); });
    q.addEventListener('input', function () { loadIndex(show); });
    q.addEventListener('keydown', function (ev) {
      var links = $$('a', res);
      if (ev.key === 'ArrowDown') { ev.preventDefault(); act = Math.min(links.length - 1, act + 1); }
      else if (ev.key === 'ArrowUp') { ev.preventDefault(); act = Math.max(0, act - 1); }
      else if (ev.key === 'Enter') { var t = links[act > -1 ? act : 0]; if (t && !res.hidden) { ev.preventDefault(); location.href = t.getAttribute('href'); } return; }
      else if (ev.key === 'Escape') { close(); return; }
      else return;
      links.forEach(function (l, i) { l.classList.toggle('act', i === act); });
    });
    document.addEventListener('click', function (ev) { if (!ev.target.closest('.searchbar')) close(); });
  }

  /* ---------- "use my location" on the home page ---------- */
  function initGeo() {
    var b = $('#geo-btn'), out = $('#geo-out'); if (!b || !out) return;
    b.addEventListener('click', function () {
      if (!navigator.geolocation) { out.textContent = 'Your browser does not support location access. Please search for your city above.'; return; }
      out.textContent = 'Finding your location…';
      navigator.geolocation.getCurrentPosition(function (p) {
        var lat = p.coords.latitude, lng = p.coords.longitude, tz = 'UTC';
        try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'; } catch (e) { /* ignore */ }
        var method = /^America\/(?!Sao|Argentina|Bogota|Lima|Caracas|Santiago)/.test(tz) ? 'ISNA' : 'MWL';
        if (S.method && S.method !== 'auto' && PT.METHODS[S.method]) method = S.method;
        var cfg = { lat: lat, lng: lng, tz: tz, method: method, school: (S.school === '1') ? 1 : 0 };
        var now = PT.nowIn(tz), t = PT.day(cfg, now.y, now.m, now.d), nx = nextInfo(cfg, now);
        var near = null;
        loadIndex(function () {
          var best = 1e9;
          idx.forEach(function (e) {
            if (e.t !== 'city') return;
            var dx = (e.la - lat), dy = (e.lo - lng) * Math.cos(lat * Math.PI / 180), d2 = dx * dx + dy * dy;
            if (d2 < best) { best = d2; near = e; }
          });
          var nearHtml = near ? '<p class="note">Nearest city we list: <a href="' + near.u + '">' + PT.esc(near.n) + ', ' + PT.esc(near.c) + '</a> — open it for the full monthly timetable.</p>' : '';
          out.innerHTML = '<div class="pcards">' + PT.cardsHtml(t, h24(), nx.tomorrow ? 'fajr' : nx.key) + '</div>' +
            '<p class="note">Calculated for your device location (' + lat.toFixed(2) + '°, ' + lng.toFixed(2) + '°) using ' + PT.esc(PT.METHODS[method].name) + '. Your location is used only inside your browser and is never sent to us.</p>' + nearHtml;
        });
      }, function () {
        out.textContent = 'We could not get your location. You can allow location access in your browser, or search for your city above.';
      }, { timeout: 12000, maximumAge: 600000 });
    });
  }

  /* ---------- cookie / storage notice ---------- */
  function initCookie() {
    var box = $('#cookie'); if (!box) return;
    var ok = false; try { ok = localStorage.getItem('pt_notice') === '1'; } catch (e) { /* ignore */ }
    if (!ok) box.hidden = false;
    var b = $('#cookie-ok');
    if (b) b.addEventListener('click', function () { box.hidden = true; try { localStorage.setItem('pt_notice', '1'); } catch (e) { /* ignore */ } });
  }

  /* ---------- contact form ---------- */
  function initContact() {
    var f = $('#contact-form'); if (!f) return;
    var msg = $('#form-msg');
    f.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var d = { name: f.name.value.trim(), email: f.email.value.trim(), subject: f.subject.value.trim(), message: f.message.value.trim() };
      if (C.formEndpoint) {
        fetch(C.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(d) })
          .then(function (r) {
            if (!r.ok) throw new Error('bad');
            msg.className = 'form-msg ok'; msg.hidden = false; msg.textContent = 'Thank you. Your message was sent.'; f.reset();
          }).catch(function () {
            msg.className = 'form-msg err'; msg.hidden = false; msg.textContent = 'Sorry, the message could not be sent. Please email us directly at ' + C.contactEmail + '.';
          });
      } else {
        var body = 'Name: ' + d.name + '\nEmail: ' + d.email + '\n\n' + d.message;
        location.href = 'mailto:' + C.contactEmail + '?subject=' + encodeURIComponent('[prayertim.blog] ' + d.subject) + '&body=' + encodeURIComponent(body);
        msg.className = 'form-msg ok'; msg.hidden = false;
        msg.textContent = 'Your email app should open with the message ready to send. If nothing opens, please write to ' + C.contactEmail + ' directly.';
      }
    });
  }

  /* ---------- boot ---------- */
  function all() { renderToday(); renderMonth(); renderRows(); }
  function boot() {
    initCookie(); initSearch(); initContact(); initGeo();
    if (!window.PT) return;
    initOptions(all);
    all();
    var p = $('#month-prev'), n = $('#month-next'), pr = $('#print-btn');
    if (p) p.addEventListener('click', function () { shiftMonth(-1); });
    if (n) n.addEventListener('click', function () { shiftMonth(1); });
    if (pr) pr.addEventListener('click', function () { window.print(); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
