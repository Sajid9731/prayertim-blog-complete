/*!
 * prayertim.blog – prayer time engine
 * Standard astronomical algorithm (solar position, hour-angle equations) as widely
 * documented for Islamic prayer times (see praytimes.org). Works in Node and browsers.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.PT = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  var D2R = Math.PI / 180, R2D = 180 / Math.PI;
  function sin(d) { return Math.sin(d * D2R); }
  function cos(d) { return Math.cos(d * D2R); }
  function tan(d) { return Math.tan(d * D2R); }
  function asin(x) { return Math.asin(x) * R2D; }
  function acos(x) { return Math.acos(x) * R2D; }
  function atan2(y, x) { return Math.atan2(y, x) * R2D; }
  function fixAngle(a) { return a - 360 * Math.floor(a / 360); }
  function fixHour(h) { return h - 24 * Math.floor(h / 24); }

  // Calculation methods. fajr / isha are sun depression angles in degrees;
  // ishaMin = fixed minutes after Maghrib; maghribAngle = depression angle for Maghrib;
  // adj = fixed minute adjustments (safety margins used by some authorities).
  var METHODS = {
    MWL:       { name: 'Muslim World League', short: 'MWL', fajr: 18, isha: 17 },
    ISNA:      { name: 'Islamic Society of North America (ISNA)', short: 'ISNA', fajr: 15, isha: 15 },
    EGYPT:     { name: 'Egyptian General Authority of Survey', short: 'Egyptian', fajr: 19.5, isha: 17.5 },
    KARACHI:   { name: 'University of Islamic Sciences, Karachi', short: 'Karachi', fajr: 18, isha: 18 },
    MAKKAH:    { name: 'Umm al-Qura University, Makkah', short: 'Umm al-Qura', fajr: 18.5, ishaMin: 90 },
    DUBAI:     { name: 'Gulf Region (Dubai)', short: 'Gulf / Dubai', fajr: 18.2, isha: 18.2, adj: { sunrise: -3, dhuhr: 3, asr: 3, maghrib: 3 } },
    KUWAIT:    { name: 'Kuwait', short: 'Kuwait', fajr: 18, isha: 17.5 },
    QATAR:     { name: 'Qatar', short: 'Qatar', fajr: 18, ishaMin: 90 },
    SINGAPORE: { name: 'Singapore / Southeast Asia', short: 'Singapore / SE Asia', fajr: 20, isha: 18, adj: { dhuhr: 1 } },
    TURKEY:    { name: 'Turkey (Diyanet style)', short: 'Turkey', fajr: 18, isha: 17, adj: { sunrise: -7, dhuhr: 5, asr: 4, maghrib: 7 } },
    TEHRAN:    { name: 'Institute of Geophysics, University of Tehran', short: 'Tehran', fajr: 17.7, isha: 14, maghribAngle: 4.5 }
  };

  function julian(y, m, d) {
    if (m <= 2) { y -= 1; m += 12; }
    var A = Math.floor(y / 100), B = 2 - A + Math.floor(A / 4);
    return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5;
  }

  function sunPos(jd) {
    var D = jd - 2451545.0;
    var g = fixAngle(357.529 + 0.98560028 * D);
    var q = fixAngle(280.459 + 0.98564736 * D);
    var L = fixAngle(q + 1.915 * sin(g) + 0.020 * sin(2 * g));
    var e = 23.439 - 0.00000036 * D;
    var RA = fixHour(atan2(cos(e) * sin(L), cos(L)) / 15);
    return { decl: asin(sin(e) * sin(L)), eqt: q / 15 - RA };
  }

  // UTC offset (hours) of an IANA time zone near local noon on a given calendar date.
  var _fmtCache = {};
  function tzOffset(tz, y, m, d, lng) {
    var f = _fmtCache[tz];
    if (!f) {
      f = _fmtCache[tz] = new Intl.DateTimeFormat('en-US', {
        timeZone: tz, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric',
        hour: 'numeric', minute: 'numeric', second: 'numeric'
      });
    }
    var t = Date.UTC(y, m - 1, d, 12) - (lng || 0) / 15 * 3600000;
    var p = {}, parts = f.formatToParts(new Date(t));
    for (var i = 0; i < parts.length; i++) p[parts[i].type] = parseInt(parts[i].value, 10);
    var local = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
    return Math.round((local - Math.floor(t / 1000) * 1000) / 900000) / 4; // quarter-hour precision
  }

  /**
   * Compute prayer times for one calendar day.
   * cfg: { lat, lng, tz, method, school (0 standard / 1 hanafi) }
   * Returns minutes after local midnight (rounded) for each prayer, NaN when undefined.
   */
  function day(cfg, y, m, d) {
    var M = METHODS[cfg.method] || METHODS.MWL;
    var lat = cfg.lat, lng = cfg.lng;
    var tzh = tzOffset(cfg.tz, y, m, d, lng);
    var jd0 = julian(y, m, d) - lng / (15 * 24);
    var asrFactor = cfg.school === 1 ? 2 : 1;

    function midDay(t) { return fixHour(12 - sunPos(jd0 + t).eqt); }
    function angleTime(angle, t, ccw) {
      var sp = sunPos(jd0 + t);
      var v = (-sin(angle) - sin(sp.decl) * sin(lat)) / (cos(sp.decl) * cos(lat));
      if (v > 1 || v < -1) return NaN;
      return midDay(t) + (ccw ? -1 : 1) * acos(v) / 15;
    }
    function asrTime(f, t) {
      var sp = sunPos(jd0 + t);
      var angle = -Math.atan(1 / (f + tan(Math.abs(lat - sp.decl)))) * R2D;
      return angleTime(angle, t, false);
    }

    var tt = { fajr: 5, sunrise: 6, dhuhr: 12, asr: 13, sunset: 18, maghrib: 18, isha: 18 };
    var r;
    for (var it = 0; it < 3; it++) {
      var tn = {};
      for (var k in tt) tn[k] = tt[k] / 24;
      r = {
        fajr: angleTime(M.fajr, tn.fajr, true),
        sunrise: angleTime(0.833, tn.sunrise, true),
        dhuhr: midDay(tn.dhuhr),
        asr: asrTime(asrFactor, tn.asr),
        sunset: angleTime(0.833, tn.sunset, false),
        isha: M.isha != null ? angleTime(M.isha, tn.isha, false) : NaN
      };
      r.maghrib = M.maghribAngle != null ? angleTime(M.maghribAngle, tn.maghrib, false) : r.sunset;
      // use results as next guesses (fall back to defaults when undefined)
      for (var k2 in r) if (!isNaN(r[k2])) tt[k2] = r[k2];
    }

    // High-latitude handling (night-fraction rule) when Fajr/Isha are undefined or too far from sunrise/sunset
    var night = fixHour(r.sunrise - r.sunset);
    if (isNaN(night) || night === 0) night = 12;
    var useSeventh = Math.abs(lat) > 48;
    function portion(angle) { return (useSeventh ? 1 / 7 : 1 / 2) * night; }
    if (isNaN(r.fajr) || fixHour(r.sunrise - r.fajr) > portion(M.fajr)) r.fajr = r.sunrise - portion(M.fajr);
    if (M.isha != null) {
      if (isNaN(r.isha) || fixHour(r.isha - r.sunset) > portion(M.isha)) r.isha = r.sunset + portion(M.isha);
    }
    if (M.ishaMin != null) r.isha = r.maghrib + M.ishaMin / 60;

    var shift = tzh - lng / 15, out = {}, adj = M.adj || {};
    var names = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];
    for (var i = 0; i < names.length; i++) {
      var n = names[i];
      var v = r[n] + shift + ((adj[n] || 0) / 60);
      out[n] = isNaN(v) ? NaN : Math.round(v * 60);
    }
    out.tzOffset = tzh;
    return out;
  }

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function fmt(min, h24) {
    if (min == null || isNaN(min)) return '—';
    min = ((min % 1440) + 1440) % 1440;
    var h = Math.floor(min / 60), mi = min % 60;
    if (h24) return pad(h) + ':' + pad(mi);
    var ap = h >= 12 ? 'PM' : 'AM', hh = h % 12; if (hh === 0) hh = 12;
    return pad(hh) + ':' + pad(mi) + ' ' + ap;
  }

  function daysInMonth(y, m) { return new Date(Date.UTC(y, m, 0)).getUTCDate(); }
  var WD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var MN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  function month(cfg, y, m) {
    var n = daysInMonth(y, m), rows = [];
    for (var d = 1; d <= n; d++) {
      var t = day(cfg, y, m, d);
      t.d = d; t.wd = WD[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
      rows.push(t);
    }
    return rows;
  }

  function hijri(y, m, d) {
    try {
      var f = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
      var p = {}, parts = f.formatToParts(new Date(Date.UTC(y, m - 1, d, 12)));
      for (var i = 0; i < parts.length; i++) p[parts[i].type] = parts[i].value;
      return { day: p.day, month: p.month, year: String(p.year).replace(/\D/g, ''), text: p.day + ' ' + p.month + ' ' + String(p.year).replace(/\D/g, '') + ' AH' };
    } catch (e) { return { text: '' }; }
  }

  function qibla(lat, lng) {
    var kl = 21.4225, kg = 39.8262, dl = (kg - lng) * D2R;
    var a = lat * D2R, b = kl * D2R;
    var br = Math.atan2(Math.sin(dl) * Math.cos(b), Math.cos(a) * Math.sin(b) - Math.sin(a) * Math.cos(b) * Math.cos(dl)) * R2D;
    br = fixAngle(br);
    var dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    var dist = 6371 * Math.acos(Math.max(-1, Math.min(1, sin(lat) * sin(kl) + cos(lat) * cos(kl) * cos(kg - lng))));
    return { deg: br, dir: dirs[Math.round(br / 22.5) % 16], km: Math.round(dist) };
  }

  // Calendar date (y,m,d) and minutes-of-day "now" in a given time zone.
  function nowIn(tz, date) {
    var f = new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' });
    var p = {}, parts = f.formatToParts(date || new Date());
    for (var i = 0; i < parts.length; i++) p[parts[i].type] = parseInt(parts[i].value, 10);
    return { y: p.year, m: p.month, d: p.day, minutes: p.hour * 60 + p.minute + p.second / 60 };
  }

  var NAMES = [
    ['fajr', 'Fajr', 'الفجر'], ['sunrise', 'Sunrise', 'الشروق'], ['dhuhr', 'Dhuhr', 'الظهر'],
    ['asr', 'Asr', 'العصر'], ['maghrib', 'Maghrib', 'المغرب'], ['isha', 'Isha', 'العشاء']
  ];
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

  // HTML for the six "today" cards
  function cardsHtml(t, h24, nextKey) {
    var h = '';
    for (var i = 0; i < NAMES.length; i++) {
      var k = NAMES[i][0];
      h += '<div class="pcard' + (k === nextKey ? ' next' : '') + (k === 'sunrise' ? ' minor' : '') + '" data-p="' + k + '">' +
        '<span class="pn">' + NAMES[i][1] + '</span><span class="pa" lang="ar" dir="rtl">' + NAMES[i][2] + '</span>' +
        '<span class="pt">' + fmt(t[k], h24) + '</span></div>';
    }
    return h;
  }

  // HTML for the <tbody> rows of a monthly timetable
  function monthRowsHtml(cfg, y, m, h24, todayD) {
    var rows = month(cfg, y, m), html = '';
    for (var i = 0; i < rows.length; i++) {
      var r = rows[i], hj = hijri(y, m, r.d);
      var cls = (r.d === todayD ? 'today' : '') + (r.wd === 'Fri' ? ' fri' : '');
      html += '<tr' + (cls.trim() ? ' class="' + cls.trim() + '"' : '') + '><th scope="row"><span class="dd">' + r.d + ' ' + MN[m - 1].slice(0, 3) +
        '</span> <span class="wd">' + r.wd + '</span>' + (hj.day ? '<span class="hj">' + esc(hj.day + ' ' + hj.month) + '</span>' : '') + '</th>';
      for (var j = 0; j < NAMES.length; j++) html += '<td>' + fmt(r[NAMES[j][0]], h24) + '</td>';
      html += '</tr>';
    }
    return html;
  }

  return { METHODS: METHODS, NAMES: NAMES, day: day, month: month, fmt: fmt, hijri: hijri, qibla: qibla, nowIn: nowIn, tzOffset: tzOffset, daysInMonth: daysInMonth, cardsHtml: cardsHtml, monthRowsHtml: monthRowsHtml, esc: esc, MN: MN, WD: WD };
});
