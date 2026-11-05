'use strict';
const PT = require('./prayer.js');
const esc = PT.esc;

function build(ctx, L, h) {
  const { EMAIL, countries, BUILD_LONG, SITE } = ctx;
  const nCities = countries.reduce((a, c) => a + c.cities.length, 0);
  const out = [];

  /* ---------- About ---------- */
  out.push({
    path: '/about/', crumb: 'About us', active: '/about/', title: 'About prayertim.com – Who We Are and How We Work',
    desc: 'prayertim.com provides prayer times, monthly azan timetables and guides for Muslims in every country. Learn who we are, how times are calculated and how to reach us.',
    ld: [{ '@context': 'https://schema.org', '@type': 'AboutPage', name: 'About prayertim.com', url: SITE + '/about/' }],
    body: `<div class="card article"><h1>About prayertim.com</h1>
<p class="lead">prayertim.com helps Muslims everywhere find accurate prayer times quickly and understand how those times are worked out.</p>
<h2>What we do</h2>
<p>We publish daily prayer times (Fajr, Sunrise, Dhuhr, Asr, Maghrib and Isha), full monthly timetables with Hijri dates, and the Qibla direction for ${nCities.toLocaleString('en-US')} cities in ${countries.length} countries. Alongside the timetables we write short guides explaining the astronomy and the differences between calculation methods, so that you can choose the setting that matches your community.</p>
<h2>How the times are produced</h2>
<p>Every time on this site is calculated in your browser from the sun's position at the city's coordinates, using the standard astronomical method described on our <a href="/methodology/">methodology page</a>. We do not copy timetables from other websites and we do not depend on an outside service to deliver the numbers, so the pages keep working and stay current for any date. For each country we start with the calculation method most widely used there, and every visitor can switch method, Asr school and time format.</p>
<h2>Editorial approach</h2>
<p>Our guides are written to explain widely accepted practice in plain language. Where scholars differ (for example the start of Asr, or how to pray at very high latitudes) we say so and describe each position rather than choosing one for you. These pages are educational and are not fatwas; for personal rulings please consult a qualified scholar.</p>
<h2>Our data and credits</h2>
<ul><li>The prayer-time calculations follow the astronomical formulas documented publicly by PrayTimes.org.</li><li>City locations are approximate city-centre coordinates compiled from public geographic references. A difference of a few kilometres changes prayer times by only seconds.</li><li>Hijri dates are produced by your browser's Umm al-Qura calendar support.</li></ul>
<h2>Corrections and feedback</h2>
<p>If you notice a time that looks wrong, a missing city, or an error in one of our articles, please tell us through the <a href="/contact/">contact page</a> or at <a href="mailto:${EMAIL}">${EMAIL}</a>. Include the city, the date and the time your mosque or authority publishes, and we will look into it.</p>
<h2>Advertising</h2>
<p>prayertim.com is free to use. We may show advertisements from Google AdSense to cover running costs. Ads never change the prayer times we calculate. Read more in our <a href="/privacy-policy/">privacy policy</a>.</p>
</div>`
  });

  /* ---------- Contact ---------- */
  out.push({
    path: '/contact/', crumb: 'Contact us', title: 'Contact prayertim.com – Questions, Corrections & Feedback',
    desc: 'Contact prayertim.com to report a prayer time error, suggest a city, ask a question or send feedback. We read every message.',
    ld: [{ '@context': 'https://schema.org', '@type': 'ContactPage', name: 'Contact prayertim.com', url: SITE + '/contact/' }],
    body: `<div class="card article"><h1>Contact us</h1>
<p class="lead">Questions, corrections, or a city you would like us to add? We read every message.</p>
<p><strong>Email:</strong> <a href="mailto:${EMAIL}">${EMAIL}</a></p>
<p>When you report a prayer-time problem, please tell us the city and country, the date, the time you see on our page, and the time you expected (and from which source). That lets us check it quickly.</p>
<form class="contact-form" id="contact-form" novalidate>
<div><label for="c-name">Your name</label><input id="c-name" name="name" type="text" required autocomplete="name"></div>
<div><label for="c-email">Your email address</label><input id="c-email" name="email" type="email" required autocomplete="email"></div>
<div><label for="c-subject">Subject</label><input id="c-subject" name="subject" type="text" required></div>
<div><label for="c-message">Message</label><textarea id="c-message" name="message" rows="6" required></textarea></div>
<div><button class="btn" type="submit">Send message</button></div>
<div class="form-msg" id="form-msg" role="status" hidden></div>
</form>
<p class="note" style="margin-top:14px">This form opens your email app with the message ready to send. You can also write to us directly at the address above.</p>
</div>`
  });

  /* ---------- Privacy ---------- */
  out.push({
    path: '/privacy-policy/', crumb: 'Privacy policy', title: 'Privacy Policy – prayertim.com',
    desc: 'How prayertim.com handles your information: log data, browser storage, location, cookies, Google AdSense advertising and your choices.',
    body: `<div class="card article"><h1>Privacy Policy</h1>
<p class="note">Last updated: ${BUILD_LONG}</p>
<p>This policy explains what information is collected when you visit <strong>prayertim.com</strong> (“we”, “us”), how it is used and what choices you have. By using the site you agree to this policy.</p>

<h2>1. Information we collect</h2>
<h3>Log data</h3>
<p>Like most websites, our hosting provider automatically records technical data when a page is requested, such as your IP address, browser type, device type, the pages you request, referring page and the date and time. This is used to deliver the site, keep it secure and understand overall traffic.</p>
<h3>Settings saved in your browser</h3>
<p>If you change the calculation method, Asr school or time format, your choice is saved in your own browser (local storage) so it is remembered next time. This information stays on your device and is not sent to us. A small flag also remembers that you dismissed the cookie notice.</p>
<h3>Your location</h3>
<p>If you press “Use my location”, your browser asks for permission. Your coordinates are used only inside your browser to calculate prayer times and find the nearest listed city. They are not sent to or stored by us.</p>
<h3>Messages you send us</h3>
<p>If you contact us, we receive your name, email address and message so that we can reply. We use this only to respond and to improve the site.</p>

<h2>2. Cookies and advertising</h2>
<p>We may display advertisements served by Google AdSense and its advertising partners. Google, as a third-party vendor, uses cookies and similar technologies to serve ads based on your visits to this and other websites. Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to our site and/or other sites on the internet.</p>
<ul>
<li>You can opt out of personalised advertising by visiting <a href="https://adssettings.google.com" target="_blank" rel="noopener">Google Ads Settings</a>.</li>
<li>You can also opt out of some third-party vendors' use of cookies for personalised advertising at <a href="https://www.aboutads.info" target="_blank" rel="noopener">www.aboutads.info</a>.</li>
<li>To learn how Google uses information from sites that use its services, see <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener">policies.google.com/technologies/partner-sites</a> and Google's <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener">advertising policies</a>.</li>
</ul>
<p>Visitors in the European Economic Area, the United Kingdom and Switzerland are shown a consent message by Google where required, and ads are personalised only if you agree. You can change your choice at any time using the privacy settings link provided by that message.</p>
<p>You can also control cookies in your browser settings; blocking them may reduce the relevance of ads but will not stop the prayer times from working.</p>

<h2>3. How we use information</h2>
<p>We use the information above to operate and secure the site, remember your settings, reply to messages, measure overall usage, and display advertising. We do not sell personal information that we collect directly from you.</p>

<h2>4. Sharing</h2>
<p>We share information only with service providers that help us run the site (such as our hosting provider) and with advertising partners as described above, or where required by law.</p>

<h2>5. Your rights</h2>
<p>Depending on where you live (for example under the GDPR or the California Consumer Privacy Act) you may have the right to access, correct or delete personal information we hold about you, to object to or restrict certain processing, and to opt out of personalised advertising. To make a request, email <a href="mailto:${EMAIL}">${EMAIL}</a>. Because we hold very little personal information, most requests concern messages you have sent us.</p>

<h2>6. Data retention</h2>
<p>Server logs are kept by our hosting provider for a limited period. Emails are kept for as long as needed to handle your request and then deleted.</p>

<h2>7. Children</h2>
<p>The site is not directed at children under 13 and we do not knowingly collect personal information from them. If you believe a child has sent us personal information, please contact us and we will delete it.</p>

<h2>8. External links</h2>
<p>Our pages may link to other websites. We are not responsible for their content or privacy practices, so please read their policies.</p>

<h2>9. Changes to this policy</h2>
<p>We may update this policy from time to time. The “last updated” date above shows when it was last changed.</p>

<h2>10. Contact</h2>
<p>Questions about this policy? Email <a href="mailto:${EMAIL}">${EMAIL}</a> or use our <a href="/contact/">contact page</a>.</p>
</div>`
  });

  /* ---------- Terms ---------- */
  out.push({
    path: '/terms/', crumb: 'Terms of service', title: 'Terms of Service – prayertim.com',
    desc: 'The terms that apply when you use prayertim.com: permitted use, accuracy of prayer times, intellectual property, links and limits of liability.',
    body: `<div class="card article"><h1>Terms of Service</h1>
<p class="note">Last updated: ${BUILD_LONG}</p>
<p>Welcome to <strong>prayertim.com</strong>. By accessing or using this website you agree to these terms. If you do not agree, please do not use the site.</p>
<h2>1. Use of the site</h2>
<p>You may view, print and share prayer timetables and articles for personal, non-commercial purposes, provided you do not remove attribution and you link back to prayertim.com when you quote or share material. You agree not to misuse the site, attempt to disrupt it, or use automated tools to copy large parts of it, including the complete set of timetables, without our written permission.</p>
<h2>2. Accuracy of prayer times</h2>
<p>Prayer times are calculated from astronomical formulas and standard calculation methods. We work to keep them accurate, but we cannot guarantee that they match every mosque, authority or community, and small differences of a few minutes are normal. Please read our <a href="/disclaimer/">disclaimer</a>. For congregational prayers, follow the timetable of your local mosque or religious authority.</p>
<h2>3. Intellectual property</h2>
<p>The text, design, code and layout of this site belong to prayertim.com unless stated otherwise. Prayer times themselves are facts of astronomy, but our presentation and written content are protected. Third-party names and trademarks belong to their owners.</p>
<h2>4. Advertising and third-party links</h2>
<p>The site may show advertisements and may link to external websites. We do not control or endorse third-party content, products or services, and we are not responsible for them.</p>
<h2>5. Availability</h2>
<p>We aim to keep the site available, but we do not promise uninterrupted access and we may change, suspend or remove content or features at any time.</p>
<h2>6. Limitation of liability</h2>
<p>The site and its content are provided “as is” and “as available” without warranties of any kind. To the fullest extent permitted by law, prayertim.com is not liable for any loss or damage arising from your use of, or inability to use, the site or from reliance on its content.</p>
<h2>7. Changes</h2>
<p>We may update these terms. Continued use of the site after a change means you accept the updated terms.</p>
<h2>8. Contact</h2>
<p>Questions about these terms? Email <a href="mailto:${EMAIL}">${EMAIL}</a>.</p>
</div>`
  });

  /* ---------- Disclaimer ---------- */
  out.push({
    path: '/disclaimer/', crumb: 'Disclaimer', title: 'Disclaimer – Prayer Times and Religious Content',
    desc: 'Important notes about the accuracy of calculated prayer times, Hijri dates, Qibla direction and the educational nature of our articles.',
    body: `<div class="card article"><h1>Disclaimer</h1>
<p class="note">Last updated: ${BUILD_LONG}</p>
<h2>Calculated times</h2>
<p>The prayer times on <strong>prayertim.com</strong> are calculated automatically from standard astronomical formulas and well-known calculation methods used by Islamic institutions. Real conditions such as altitude, the local horizon, weather and local adjustments can make the observed times differ slightly. Mosques often publish their own adhan and iqamah times, sometimes with fixed safety margins, and these may differ from ours by a few minutes.</p>
<h2>Please verify</h2>
<p>We encourage you to confirm timings with your local mosque, Islamic centre or religious authority, especially for congregational prayers, Jumu'ah, fasting times in Ramadan and Eid.</p>
<h2>Hijri dates and moon sighting</h2>
<p>Hijri dates shown on the site follow the calculation-based Umm al-Qura calendar. The start of Islamic months, including Ramadan and Eid, is decided in many countries by moon sighting and can differ from the calculated date by a day. Follow your local announcement.</p>
<h2>Qibla direction</h2>
<p>The Qibla direction is the great-circle bearing to the Kaaba from the city centre. Please verify with a reliable compass or your mosque's orientation, and remember that magnetic compasses show magnetic rather than true north.</p>
<h2>Educational content</h2>
<p>Our articles are intended to inform, not to issue religious rulings (fatwas). Where scholars differ we describe the main views. For personal religious guidance, consult a qualified scholar.</p>
<h2>Advertising</h2>
<p>Advertisements are provided by third parties such as Google AdSense. The appearance of an ad does not mean that we endorse the advertiser or its products.</p>
<h2>Contact</h2>
<p>If you spot an error, please tell us at <a href="mailto:${EMAIL}">${EMAIL}</a>.</p>
</div>`
  });

  /* ---------- Methodology ---------- */
  const byMethod = {};
  for (const c of countries) (byMethod[c.method] = byMethod[c.method] || []).push(c);
  const methodRows = Object.keys(PT.METHODS).map(k => {
    const M = PT.METHODS[k];
    const isha = M.ishaMin ? `${M.ishaMin} min after Maghrib` : `${M.isha}°`;
    const extra = [M.maghribAngle ? `Maghrib at ${M.maghribAngle}°` : '', M.adj ? 'small fixed margins: ' + Object.keys(M.adj).map(x => `${x} ${M.adj[x] > 0 ? '+' : ''}${M.adj[x]} min`).join(', ') : ''].filter(Boolean).join('; ');
    return `<tr><td>${esc(M.name)}</td><td>${M.fajr}°</td><td>${isha}</td><td>${esc(extra || '—')}</td></tr>`;
  }).join('');
  const defaults = Object.keys(PT.METHODS).filter(k => byMethod[k]).map(k => {
    const list = byMethod[k].map(c => c.name);
    const shown = list.length > 40 ? list.slice(0, 40).join(', ') + ` and ${list.length - 40} more` : list.join(', ');
    return `<p><strong>${esc(PT.METHODS[k].name)}</strong> (${list.length} ${list.length === 1 ? 'country' : 'countries'}): ${esc(shown)}.</p>`;
  }).join('');
  const hanafi = countries.filter(c => c.school).map(c => c.name).join(', ');
  out.push({
    path: '/methodology/', crumb: 'Methodology', active: '/methodology/', title: 'How We Calculate Prayer Times – Methodology',
    desc: 'The astronomy and settings behind prayertim.com timetables: Fajr and Isha angles by method, Asr schools, sunrise and sunset, high-latitude rules, time zones and Hijri dates.',
    ld: [{ '@context': 'https://schema.org', '@type': 'TechArticle', headline: 'How prayertim.com calculates prayer times', url: SITE + '/methodology/', author: { '@type': 'Organization', name: 'prayertim.com' } }],
    body: `<div class="card article"><h1>How We Calculate Prayer Times</h1>
<p class="lead">Every time on prayertim.com is computed from the sun's position at the city's coordinates. This page lists exactly what is used so you can check it or match it with your own authority.</p>
<h2>1. The sun's position</h2>
<p>For each date we calculate the sun's declination (how far north or south of the equator it is) and the equation of time (the difference between solar noon and clock noon). Together with the city's latitude and longitude, these give the moment of solar noon and the time the sun reaches any chosen angle below or above the horizon.</p>
<h2>2. The five prayers</h2>
<ul>
<li><strong>Dhuhr</strong> begins just after solar noon, when the sun has passed its highest point.</li>
<li><strong>Asr</strong> begins when an object's shadow reaches its own length plus the shadow it had at noon (Standard: Shafi'i, Maliki, Hanbali), or twice its length plus the noon shadow (Hanafi).</li>
<li><strong>Maghrib</strong> begins at sunset, defined as the sun's upper edge reaching the horizon with a standard allowance for atmospheric refraction (the sun's centre 0.833° below the horizon). The Tehran method instead uses 4.5°.</li>
<li><strong>Isha</strong> begins when evening twilight ends, defined by an angle of the sun below the horizon or, in some methods, a fixed time after Maghrib.</li>
<li><strong>Fajr</strong> begins at true dawn, defined by an angle of the sun below the horizon before sunrise. <strong>Sunrise</strong> uses the same 0.833° definition and marks the end of the Fajr time.</li>
</ul>
<h2>3. Calculation methods</h2>
<p>Institutions choose slightly different angles for Fajr and Isha. These are the methods available on this site:</p>
<div class="twrap"><table class="pt" style="text-align:left"><thead><tr><th>Method</th><th>Fajr angle</th><th>Isha</th><th>Other</th></tr></thead><tbody>${methodRows}</tbody></table></div>
<p class="note">Our <a href="/blog/prayer-time-calculation-methods-compared/">comparison guide</a> explains why these differ and how large the difference is in practice.</p>
<h2>4. Default method for each country</h2>
<p>We start each country on the method most commonly used there. You can always change it with the Options box on any timetable.</p>
${defaults}
<h2>5. Default Asr school</h2>
<p>Hanafi Asr is the default in: ${esc(hanafi)}. Everywhere else the default is Standard Asr. Both are available on every page.</p>
<h2>6. Very high latitudes</h2>
<p>In summer at high latitudes the sun may never sink far enough below the horizon for twilight to end, so the Fajr and Isha angles are never reached. When that happens, or when the computed Fajr or Isha would fall unreasonably far from sunrise or sunset, we apply the night-fraction rule: above 48° latitude Fajr and Isha are limited to one seventh of the night from sunrise or sunset, and below that latitude to half of the night. Read more in <a href="/blog/prayer-times-at-high-latitudes/">prayer times at high latitudes</a>.</p>
<h2>7. Time zones and daylight saving time</h2>
<p>Each city is assigned an IANA time zone. The UTC offset is looked up for every calendar date, so daylight saving changes are applied on the correct day automatically. Times are shown in the city's local time and rounded to the nearest minute.</p>
<h2>8. Hijri dates</h2>
<p>Hijri dates come from the Umm al-Qura calendar built into your browser. They are calculation-based and can differ by a day from local moon sighting; the Islamic day also begins at Maghrib, whereas the date shown changes at midnight.</p>
<h2>9. Qibla</h2>
<p>The Qibla is the great-circle initial bearing from the city to the Kaaba (21.4225° N, 39.8262° E), measured clockwise from true north.</p>
<h2>10. Limits of accuracy</h2>
<p>City coordinates are approximate city-centre points, and we do not adjust for elevation or the local horizon. These effects normally change times by well under a minute, but your mosque's published timetable always takes priority for congregational prayers. If you find a discrepancy, please <a href="/contact/">tell us</a>.</p>
</div>`
  });

  return out;
}
module.exports = { build };
