'use strict';
const D = '2026-11-03';
module.exports = [
{
  slug: 'how-prayer-times-are-calculated', date: D,
  title: 'How Prayer Times Are Calculated: The Astronomy Behind Fajr to Isha',
  desc: 'A plain-language explanation of how the five daily prayer times are worked out from the sun\'s position, and why they change through the year and from city to city.',
  related: ['prayer-time-calculation-methods-compared', 'hanafi-vs-shafii-asr-time', 'why-prayer-times-differ-between-apps-and-mosques'],
  html: `<p>The five daily prayers are tied to visible movements of the sun, so every prayer time can be worked out with astronomy. Once you know where the sun is, you can say when each prayer begins, for any place and any date. Here is how that works.</p>
<h2>The signs in the sky</h2>
<p>Islamic sources describe each prayer by an observable sign. Modern timetables turn those signs into precise positions of the sun.</p>
<ul>
<li><strong>Fajr</strong> begins at true dawn (al-fajr as-sadiq), the thin horizontal band of light that spreads across the eastern horizon. Astronomers measure it as the moment the sun is a certain number of degrees below the horizon before sunrise.</li>
<li><strong>Sunrise</strong> is when the top edge of the sun appears. It ends the time of Fajr and is not itself a prayer time.</li>
<li><strong>Dhuhr</strong> begins when the sun has passed its highest point (zawal), a few minutes after solar noon.</li>
<li><strong>Asr</strong> begins when the shadow of an object reaches a set multiple of its height, in addition to the shadow it had at noon.</li>
<li><strong>Maghrib</strong> begins at sunset, when the sun has fully disappeared below the horizon.</li>
<li><strong>Isha</strong> begins when the red (or, in some views, white) glow of twilight has disappeared from the western sky, again measured as an angle of the sun below the horizon.</li>
</ul>
<h2>Three numbers drive the calculation</h2>
<p>To calculate the times for a city on a given date, a program needs three things: the city's <strong>latitude</strong>, its <strong>longitude</strong>, and the <strong>date</strong>. From the date it works out two quantities that describe the sun that day:</p>
<ul>
<li>the sun's <strong>declination</strong>, how far north or south of the equator the sun is overhead (it swings between about 23.4° north in June and 23.4° south in December), and</li>
<li>the <strong>equation of time</strong>, the difference between real solar time and the even ticking of a clock, which varies by up to about 16 minutes through the year.</li>
</ul>
<p>Longitude and the time zone fix when solar noon happens on the clock. Latitude and declination decide how long the sun takes to climb or sink to any angle. The "hour angle" formula combines them to give the time between solar noon and the moment the sun reaches a given angle.</p>
<h2>Why sunrise and sunset use 0.833°</h2>
<p>You might expect sunrise to be when the sun's centre is exactly on the horizon (0°). In practice two small effects matter. The sun's disc has a radius of about 0.27°, and we count sunrise when its upper edge appears. The atmosphere also bends light, lifting the sun's apparent position by about 0.57° at the horizon. Added together, the sun's centre is about 0.833° below the geometric horizon at the moment we see sunrise or sunset. Calculators use this standard value.</p>
<h2>Why times change every day</h2>
<p>As the earth orbits the sun, the declination changes a little each day. In winter at mid-latitudes the sun's path is low and short, so days are shorter and the Fajr–sunrise and sunset–Isha gaps are different from summer. Near the equator the changes are small, while at higher latitudes they are large. This is why a timetable for one city cannot be reused for another, and why a monthly timetable is useful.</p>
<h2>What changes between methods</h2>
<p>Sunrise, solar noon and sunset are fixed by physics. The disagreement among institutions is mainly about the <strong>angles</strong> that define Fajr and Isha (15° to 19.5°) and about the <strong>Asr</strong> shadow rule. Those choices are explained in our guides on <a href="/blog/prayer-time-calculation-methods-compared/">calculation methods</a> and <a href="/blog/hanafi-vs-shafii-asr-time/">the two schools of Asr</a>.</p>
<h2>See it in action</h2>
<p>Every timetable on prayertim.com uses these steps. You can read the exact settings on our <a href="/methodology/">methodology page</a> and look up your own city from the <a href="/prayer-times/">country list</a>.</p>`
},
{
  slug: 'prayer-time-calculation-methods-compared', date: D,
  title: 'Prayer Time Calculation Methods Compared: MWL, ISNA, Karachi',
  desc: 'Why different apps show different Fajr and Isha times: the angles used by the main calculation methods, how big the difference is, and how to choose one.',
  related: ['how-prayer-times-are-calculated', 'prayer-times-at-high-latitudes', 'why-prayer-times-differ-between-apps-and-mosques'],
  html: `<p>If you have ever compared two prayer apps and found that Fajr differs by 15 or 20 minutes, you have met the calculation methods. They are not mistakes. They are different, well-established ways of defining the start of Fajr and the start of Isha.</p>
<h2>What the methods agree on</h2>
<p>All methods use the same position of the sun for sunrise, solar noon and sunset, so Dhuhr and Maghrib are essentially the same everywhere (some authorities add a few minutes of caution). The real differences are the depression angle of the sun used for Fajr and for Isha, and how Isha is defined in a few methods.</p>
<h2>The main methods</h2>
<table><thead><tr><th>Method</th><th>Fajr</th><th>Isha</th><th>Commonly used in</th></tr></thead><tbody>
<tr><td>Muslim World League</td><td>18°</td><td>17°</td><td>Europe, the Far East, parts of the Americas</td></tr>
<tr><td>ISNA</td><td>15°</td><td>15°</td><td>North America</td></tr>
<tr><td>Egyptian General Authority of Survey</td><td>19.5°</td><td>17.5°</td><td>Egypt, Syria, Iraq, Lebanon, parts of Africa</td></tr>
<tr><td>University of Islamic Sciences, Karachi</td><td>18°</td><td>18°</td><td>Pakistan, India, Bangladesh, Afghanistan</td></tr>
<tr><td>Umm al-Qura University, Makkah</td><td>18.5°</td><td>90 minutes after Maghrib</td><td>Saudi Arabia and the Arabian Peninsula</td></tr>
<tr><td>Gulf Region</td><td>18.2°</td><td>18.2°</td><td>United Arab Emirates</td></tr>
<tr><td>Kuwait</td><td>18°</td><td>17.5°</td><td>Kuwait</td></tr>
<tr><td>Qatar</td><td>18°</td><td>90 minutes after Maghrib</td><td>Qatar</td></tr>
<tr><td>Singapore / Southeast Asia</td><td>20°</td><td>18°</td><td>Singapore, Indonesia, Brunei</td></tr>
<tr><td>Turkey (Diyanet style)</td><td>18°</td><td>17°</td><td>Turkey</td></tr>
<tr><td>University of Tehran</td><td>17.7°</td><td>14°</td><td>Iran, some Shia communities</td></tr>
</tbody></table>
<h2>How big is the difference?</h2>
<p>The sun moves roughly one degree every four minutes near the equator, and more slowly across the horizon at higher latitudes, so each degree of angle can mean 4 to 8 minutes. A 3° difference between the ISNA (15°) and the Muslim World League (18°) Fajr angles therefore shifts Fajr by roughly 12 minutes near the equator and often 20 to 30 minutes at mid-latitudes, with the later time for the smaller angle. Isha varies similarly.</p>
<h2>Why do the angles differ?</h2>
<p>The difference comes from how scholars and observatories interpret true dawn and the end of twilight, and from field observations made in different climates. Clear desert skies show dawn differently from humid or polluted skies. Several institutions have run observation studies and reached different angle estimates, and each community adopted the one it trusts. Some communities also prefer a slightly later Fajr and earlier Isha as a matter of caution or ease.</p>
<h2>Fixed-interval Isha</h2>
<p>Umm al-Qura and Qatar do not use an angle for Isha. They set Isha a fixed time after Maghrib (90 minutes). This is simple to publish and follows a long-standing practice in the region, but it means Isha does not track the actual end of twilight as the seasons change.</p>
<h2>How to choose</h2>
<ol>
<li>If your local mosque or religious authority publishes a timetable, choose the method that matches it.</li>
<li>If not, use the default for your country, which is the method most people near you already follow.</li>
<li>If you are in the West, check what your community's mosque uses before comparing apps; North American mosques often follow ISNA, while many European ones follow the Muslim World League or the local mosque's calendar.</li>
</ol>
<p>On every prayertim.com timetable you can open the Options box and switch method instantly, and our <a href="/methodology/">methodology page</a> lists the default for each country. For the high-latitude special case read <a href="/blog/prayer-times-at-high-latitudes/">prayer times at high latitudes</a>.</p>`
},
{
  slug: 'hanafi-vs-shafii-asr-time', date: D,
  title: 'Hanafi vs Shafi\'i Asr Time: Why Asr Starts Later for Some',
  desc: 'The two shadow-length rules for the start of Asr, how much later Hanafi Asr begins, and how to pick the right one on a prayer timetable.',
  related: ['how-prayer-times-are-calculated', 'five-daily-prayers-names-times-rakat', 'why-prayer-times-differ-between-apps-and-mosques'],
  html: `<p>Of the five prayers, Asr is the one where a school of thought changes the start time itself. Almost every prayer app has a setting for it, usually labelled "Standard" and "Hanafi". This guide explains what the setting does.</p>
<h2>Two ways to measure the shadow</h2>
<p>Hadith literature describes Asr in terms of the length of an object's shadow. When the sun passes its highest point at noon, an upright stick still casts a small shadow, which is longer in winter than in summer and zero at some tropical latitudes on some days. Asr begins when the shadow grows beyond that noon shadow by a certain amount:</p>
<ul>
<li><strong>Standard (Shafi'i, Maliki and Hanbali):</strong> Asr begins when the shadow equals the height of the object (a shadow ratio of 1), plus the noon shadow.</li>
<li><strong>Hanafi:</strong> Asr begins when the shadow is twice the height of the object (a ratio of 2), plus the noon shadow. This is the position of Imam Abu Hanifa, which is relied on in most Hanafi practice today.</li>
</ul>
<p>Each school bases its view on its reading of the reports about the times of prayer. The disagreement is respected and long-standing, and followers of each school can pray at the time of their own.</p>
<h2>How much later is Hanafi Asr?</h2>
<p>The gap depends on latitude and season. Near the equator it is relatively small, around 30 to 40 minutes. In mid-latitude winter, when the sun stays low and shadows are long, the gap can grow larger, often an hour or more. In summer at high latitudes it is smaller in relative terms but can still be considerable. Because of this seasonal swing you should not use a fixed number of minutes; use a timetable that calculates both.</p>
<h2>Where the Hanafi setting is common</h2>
<p>Most Muslims in Pakistan, India, Bangladesh, Afghanistan and Central Asia, and many in Turkey and the Balkans, follow the Hanafi school, and timetables in South Asian communities are often printed with Hanafi Asr. Many mosques in the UK also publish both an earlier and a later Asr time so that members of either school can pray together. Shafi'i communities are common in Southeast Asia, East Africa and parts of the Arab world, and Maliki and Hanbali communities in North and West Africa and the Arabian Peninsula.</p>
<h2>Does it affect other prayers?</h2>
<p>No. Only the start of Asr changes. The end of Asr, around sunset, and the other four prayers are unaffected. The Hanafi setting does also move the time of the end of Dhuhr, since Dhuhr runs until Asr begins. Sunset and Maghrib do not change.</p>
<h2>Which setting should I use?</h2>
<ul>
<li>Use the setting that matches the school you follow, or that your local mosque follows.</li>
<li>If you are unsure, ask your imam, or use the earlier (Standard) time only if you accept that the Hanafi time is later; people who follow Hanafi rulings should wait for the later time.</li>
<li>When praying with a congregation, follow the congregation's time.</li>
</ul>
<p>On prayertim.com the default is Hanafi for countries where that school is dominant, and Standard elsewhere. You can switch in the Options box on any city page. For more background see <a href="/blog/how-prayer-times-are-calculated/">how prayer times are calculated</a>.</p>`
},
{
  slug: 'prayer-times-at-high-latitudes', date: D,
  title: 'Prayer Times at High Latitudes: What to Do When Twilight Never Ends',
  desc: 'How Muslims in northern Europe and other high-latitude places work out Fajr and Isha when the sun barely sets: the main approaches and the reasoning behind them.',
  related: ['prayer-time-calculation-methods-compared', 'how-prayer-times-are-calculated', 'praying-while-traveling-qasr-and-jam'],
  html: `<p>Above roughly 48° to 50° latitude, which includes London, Berlin, Amsterdam, Warsaw, Moscow, Stockholm and most of Canada, summer nights are short and the sky never gets fully dark. The sun may never drop low enough for the Fajr or Isha angle to be reached, so a formula returns "no result". This guide explains how communities handle that.</p>
<h2>The problem</h2>
<p>Fajr and Isha are defined by the sun reaching a certain angle below the horizon (for example 18°). In London in June the sun at its lowest is only about 15° below the horizon, so 18° twilight never ends: dusk glow merges into dawn glow. Further north, around 60° latitude, the sun in midsummer may not sink even a few degrees. Closer to the poles there are weeks of midnight sun in summer and polar night in winter.</p>
<h2>Approaches used by scholars and timetable makers</h2>
<ol>
<li><strong>Middle of the night:</strong> Fajr is placed no earlier than half the night before sunrise, and Isha no later than half the night after sunset. The night is the time between sunset and sunrise.</li>
<li><strong>One-seventh of the night:</strong> Fajr begins one-seventh of the night before sunrise and Isha one-seventh of the night after sunset. This is a widely used rule in northern Europe because it gives practical times.</li>
<li><strong>Angle-based (twilight angle):</strong> The night is divided in proportion to the angle, so for an 18° angle Fajr starts at 18/60 of the night before sunrise, and similarly for Isha.</li>
<li><strong>Nearest latitude:</strong> Use the times of the nearest latitude where the signs of dawn and dusk occur normally, often 45° or 48.5°.</li>
<li><strong>Nearest day:</strong> Keep using the last normal times from the last day on which twilight ended.</li>
<li><strong>Follow Makkah or a fixed clock schedule:</strong> In extreme latitudes, some councils allow following the prayer times of Makkah or of the nearest country where the usual signs appear, or dividing the 24 hours into five periods.</li>
</ol>
<p>Scholars and councils differ on which approach is best, and mosques in the same city sometimes follow different ones. Which to use is a religious decision that your mosque or a scholar can make for you.</p>
<h2>What prayertim.com does</h2>
<p>When the Fajr or Isha angle cannot be reached, or the calculated time would be unusually far from sunrise or sunset, we use the night-fraction approach: one-seventh of the night above 48° latitude and half the night below that. The method is documented on our <a href="/methodology/">methodology page</a>. If your local mosque uses another approach, follow your mosque's timetable for congregational prayers.</p>
<h2>Practical tips</h2>
<ul>
<li>In summer, expect Isha to be very late and Fajr very early in northern cities; the gap between them can be only a few hours.</li>
<li>Check your local mosque's calendar, as many northern mosques publish a yearly timetable that reflects a local council's decision.</li>
<li>If you are travelling to a high-latitude place, the rules for travellers in <a href="/blog/praying-while-traveling-qasr-and-jam/">our travelling guide</a> may also help.</li>
</ul>`
},
{
  slug: 'how-to-find-qibla-direction', date: D,
  title: 'How to Find the Qibla Direction: Compass, Shadow and Phone Methods',
  desc: 'Practical ways to find the direction of the Kaaba from anywhere: the great-circle bearing, a phone compass, and the twice-a-year shadow method.',
  related: ['how-prayer-times-are-calculated', 'praying-while-traveling-qasr-and-jam', 'five-daily-prayers-names-times-rakat'],
  html: `<p>The Qibla is the direction Muslims face when praying, towards the Kaaba in Makkah. Finding it is simple once you know the options. This guide covers the most reliable ways.</p>
<h2>What "direction" means on a round earth</h2>
<p>The shortest path between two places on the globe is a great circle. The Qibla bearing is the starting direction of the great circle that leads from you to the Kaaba (21.4225° N, 39.8262° E), measured clockwise from true north. From London it is about 119° (roughly south-east). From Karachi it is about 268° (almost due west). From New York it is about 58° (north-east), and from Sydney about 277° (west). These can surprise people, because on a flat map the line looks different, but the great circle is the correct shortest direction used by almost every scholar today.</p>
<h2>Method 1: a compass</h2>
<ol>
<li>Look up the Qibla bearing for your city, which is on every city page on prayertim.com under "Qibla direction".</li>
<li>Hold a magnetic compass flat, away from metal, magnets and electronics.</li>
<li>Turn until the needle points to the magnetic north, then rotate to the bearing.</li>
</ol>
<p>A magnetic compass shows magnetic north, which differs from true north by a few degrees (the magnetic declination). In many places the difference is small, but in some it can be 10° or more, so add or subtract the local declination for accuracy.</p>
<h2>Method 2: a phone app or the sun</h2>
<p>Phone compasses use a magnetometer and need calibration, usually by moving the phone in a figure-eight. Keep the phone away from metal, and move a few metres from walls and speakers. As a cross-check you can use the sun: at solar noon in the northern hemisphere in summer the sun is south of you, so a shadow points north; combined with the bearing it gives a quick sanity check.</p>
<h2>Method 3: the Kaaba shadow method</h2>
<p>Twice a year the sun passes directly overhead at the Kaaba, around May 27 or 28 at about 12:18 Makkah time, and July 15 or 16 at about 12:27 Makkah time (9:18 and 9:27 UTC). At that moment, anywhere on earth where the sun is above the horizon, a vertical pole's shadow points exactly away from the Kaaba, so the direction of the pole's base from the shadow tip is the Qibla. This is an excellent way to mark or check the Qibla of a mosque or home, because it does not depend on compasses or calculators. Check the exact date and time for your year, since they shift by a day with leap years.</p>
<h2>Indoors and while travelling</h2>
<ul>
<li>In a mosque, follow the mihrab, which has been set by the community.</li>
<li>In a hotel, many rooms have a Qibla marker on the ceiling or desk; if not, use the bearing and a compass.</li>
<li>On a plane or train, face the best estimate you can and pray; see <a href="/blog/praying-while-traveling-qasr-and-jam/">praying while travelling</a>.</li>
</ul>
<h2>Small errors are acceptable</h2>
<p>Most scholars accept that if you make a sincere effort to face the Qibla and are a few degrees off, your prayer is valid. Where the exact direction cannot be known, you pray to the best of your ability. If you later find that you were mistaken, you do not need to repeat the prayer in the view of many scholars; ask your imam for your school's view.</p>`
},
{
  slug: 'five-daily-prayers-names-times-rakat', date: D,
  title: 'The Five Daily Prayers: Names, Times and Number of Rak\'ahs',
  desc: 'A clear overview of Fajr, Dhuhr, Asr, Maghrib and Isha: when each prayer begins and ends, how many obligatory rak\'ahs each has, plus Jumu\'ah and Witr.',
  related: ['how-prayer-times-are-calculated', 'hanafi-vs-shafii-asr-time', 'praying-while-traveling-qasr-and-jam'],
  html: `<p>Salah, the ritual prayer, is the second pillar of Islam and is prescribed five times a day at fixed times. This overview is for new Muslims, students and anyone who wants a quick reference. For personal rulings, ask a scholar.</p>
<h2>Overview</h2>
<table><thead><tr><th>Prayer</th><th>Begins</th><th>Ends (generally)</th><th>Obligatory rak'ahs</th></tr></thead><tbody>
<tr><td>Fajr (dawn)</td><td>True dawn</td><td>Sunrise</td><td>2</td></tr>
<tr><td>Dhuhr (midday)</td><td>Just after the sun passes its highest point</td><td>When Asr begins</td><td>4</td></tr>
<tr><td>Asr (afternoon)</td><td>Shadow reaches its set length (see <a href="/blog/hanafi-vs-shafii-asr-time/">Hanafi vs Shafi'i</a>)</td><td>Sunset (the preferred time ends earlier)</td><td>4</td></tr>
<tr><td>Maghrib (sunset)</td><td>Sunset</td><td>When twilight disappears</td><td>3</td></tr>
<tr><td>Isha (night)</td><td>When twilight disappears</td><td>Midnight or dawn, depending on the view</td><td>4</td></tr>
</tbody></table>
<h2>Fajr</h2>
<p>Fajr is the dawn prayer with two obligatory rak'ahs. It is prayed before sunrise, and two voluntary rak'ahs just before it are strongly recommended. The Prophet (peace be upon him) said that these two rak'ahs are better than this world and everything in it.</p>
<h2>Dhuhr</h2>
<p>Dhuhr has four obligatory rak'ahs and is followed and preceded by voluntary prayers. On Friday it is replaced by the congregational Jumu'ah prayer, which has two rak'ahs preceded by a sermon (khutbah).</p>
<h2>Asr</h2>
<p>Asr has four obligatory rak'ahs. Scholars teach that it should be prayed while the sun is still bright and high; praying it very late, near sunset, is strongly discouraged without a valid excuse.</p>
<h2>Maghrib</h2>
<p>Maghrib has three obligatory rak'ahs and begins right at sunset. It is the time for breaking the fast in Ramadan, and it is recommended not to delay it needlessly. Its time lasts until the red twilight disappears in the view of many scholars.</p>
<h2>Isha</h2>
<p>Isha has four obligatory rak'ahs. It may be prayed once twilight has ended. Many scholars say the preferred time lasts until about a third or half of the night and the permitted time continues until dawn, though views differ on the end of the time. After Isha comes the Witr prayer, an odd number of rak'ahs. Hanafi scholars treat it as wajib (necessary), and other schools treat it as a strongly emphasised sunnah.</p>
<h2>Prayers in congregation</h2>
<p>Men are encouraged to pray the five prayers in congregation at the mosque, which carries great reward. Women may pray at home or at the mosque. Where there is no mosque, pray with family or alone.</p>
<h2>Making up missed prayers</h2>
<p>If a prayer is missed because of sleep or forgetfulness, the teaching is to pray it as soon as you remember. Scholars have detailed rulings for ongoing missed prayers, so ask a trusted scholar for guidance in your situation.</p>
<h2>Where to find the times</h2>
<p>Use the <a href="/prayer-times/">country list</a> to open your city. Each page shows today's five times with a countdown to the next prayer and a full monthly timetable.</p>`
},
{
  slug: 'hijri-calendar-explained', date: D,
  title: 'The Hijri Calendar Explained: Months, Moon Sighting and Umm al-Qura',
  desc: 'How the Islamic lunar calendar works, why Ramadan moves through the seasons, the twelve months, and why the start of a month can differ by a day between countries.',
  related: ['ramadan-suhoor-iftar-and-prayer-times', 'how-prayer-times-are-calculated', 'why-prayer-times-differ-between-apps-and-mosques'],
  html: `<p>The Hijri (Islamic) calendar is a lunar calendar used to date religious events such as Ramadan, Hajj and the two Eids. It is the calendar behind the Hijri dates that appear on our timetables.</p>
<h2>Counting from the Hijra</h2>
<p>Year 1 of the calendar marks the Prophet's migration (Hijra) from Makkah to Madinah in 622 CE. Years are written with "AH", short for the Latin anno Hegirae, "in the year of the Hijra". In November 2026 the Hijri year is 1448.</p>
<h2>Twelve lunar months</h2>
<ol>
<li>Muharram</li><li>Safar</li><li>Rabi' al-Awwal</li><li>Rabi' al-Thani</li><li>Jumada al-Awwal</li><li>Jumada al-Thani</li><li>Rajab</li><li>Sha'ban</li><li>Ramadan</li><li>Shawwal</li><li>Dhu al-Qi'dah</li><li>Dhu al-Hijjah</li>
</ol>
<p>Each month begins with the new crescent moon and lasts 29 or 30 days, the time the moon takes to go through its phases (about 29.5 days). Twelve months add up to 354 or 355 days, which is about 10 or 11 days shorter than a solar year.</p>
<h2>Why Ramadan moves through the seasons</h2>
<p>Because the lunar year is shorter than the solar year, Hijri months start about 10 to 11 days earlier on the Gregorian calendar each year. Ramadan therefore travels through all seasons over a cycle of about 33 years. Fasting hours are long in summer and short in winter, and over a lifetime a Muslim experiences both.</p>
<h2>When does the day begin?</h2>
<p>In the Islamic reckoning each day begins at sunset (Maghrib), not at midnight. The night of a date comes before its day. For example, the night before Friday is "Friday night" (laylat al-Jumu'ah). Most digital calendars change the date at midnight, so there is an overlap of a few hours between conventions.</p>
<h2>Moon sighting or calculation?</h2>
<p>Two approaches are used to decide the start of a month:</p>
<ul>
<li><strong>Sighting:</strong> Following the teaching to fast and break the fast on seeing the crescent, many countries and communities rely on actual or reported sightings after the 29th day, and complete 30 days when the sky is cloudy.</li>
<li><strong>Calculation:</strong> Other authorities rely on astronomical calculations, either to confirm sighting or to set dates in advance. Saudi Arabia's Umm al-Qura calendar is calculation-based, using criteria tied to the moon's position at Makkah, and is widely used for civil dates. Many software libraries and phones implement it.</li>
</ul>
<h2>Why dates can differ by a day</h2>
<p>The new crescent is visible at different times in different places. Where it is sighted, or what criteria are accepted, can differ, so one country may start Ramadan or Eid a day before or after another. Both follow valid, recognised processes. That is why the Hijri date on our timetables, which is calculated, may not match your country's official date for a month's start. For religious observances, follow your local announcement.</p>
<h2>Using the calendar</h2>
<p>Our monthly timetables show the Hijri date next to each Gregorian date, so you can follow the Islamic date through the month. See also our guide to <a href="/blog/ramadan-suhoor-iftar-and-prayer-times/">Ramadan timings</a>.</p>`
},
{
  slug: 'ramadan-suhoor-iftar-and-prayer-times', date: D,
  title: 'Ramadan Timings: Suhoor, Iftar, Imsak and Prayer Times',
  desc: 'How the fasting day in Ramadan is tied to Fajr and Maghrib, what Imsak means, and how to use a prayer timetable to plan suhoor and iftar.',
  related: ['hijri-calendar-explained', 'five-daily-prayers-names-times-rakat', 'prayer-times-at-high-latitudes'],
  html: `<p>The daily fast of Ramadan is defined by two moments that are also prayer times: the start of Fajr and the start of Maghrib. If you can read a prayer timetable, you can plan suhoor and iftar.</p>
<h2>The fasting day</h2>
<p>The Quran instructs believers to eat and drink "until the white thread of dawn becomes distinct from the black thread" and then to complete the fast "until the night" (Surah al-Baqarah, 2:187). Scholars understand the first as true dawn, the beginning of Fajr, and the second as sunset, the beginning of Maghrib. The fast therefore starts at Fajr and ends at Maghrib.</p>
<h2>Suhoor</h2>
<p>Suhoor is the pre-dawn meal. The Prophet (peace be upon him) said that there is blessing in suhoor and encouraged Muslims to take it, even if just a sip of water or a date. It may be eaten until Fajr begins. Plan to finish a few minutes before the Fajr time shown on the timetable.</p>
<h2>What is Imsak?</h2>
<p>Many Ramadan calendars, especially in South Asia, Southeast Asia and parts of the Middle East, show an extra time called <strong>Imsak</strong>, usually about 10 minutes before Fajr. It is a precaution to stop eating a little early in case the calculated Fajr is slightly early. It is not a separate prayer time and the Quran and the Sunnah do not require it; you may eat until Fajr begins. Follow the practice of your community if it uses Imsak.</p>
<h2>Iftar</h2>
<p>Iftar is the meal that breaks the fast and is taken at Maghrib, as soon as the sun has set. The Prophet (peace be upon him) encouraged hastening the breaking of the fast and often broke it with fresh dates, or water if there were no dates, before praying Maghrib. Do not delay it past the Maghrib time on the timetable, and do not break the fast early.</p>
<h2>Prayer times around Ramadan</h2>
<ul>
<li><strong>Isha and Taraweeh:</strong> Taraweeh, the special night prayer of Ramadan, is prayed after Isha, often in congregation at the mosque.</li>
<li><strong>Tahajjud and the last ten nights:</strong> Many Muslims pray at night, especially in the last ten nights, seeking Laylat al-Qadr.</li>
<li><strong>Fajr:</strong> After suhoor, pray Fajr on time.</li>
</ul>
<h2>Fasting hours around the world</h2>
<p>Because the lunar month drifts through the seasons, the length of the fast varies. In summer at mid-latitudes the fast can be around 16 to 18 hours, while in winter it can be 10 to 12 hours. Near the equator it stays around 12 to 13 hours year-round. In northern Europe in summer, the twilight may never end, so scholars use the rules discussed in <a href="/blog/prayer-times-at-high-latitudes/">our high-latitude guide</a>.</p>
<h2>Tips for planning</h2>
<ul>
<li>Open your city's timetable on <a href="/prayer-times/">prayertim.com</a> and print the month (the "Print timetable" button).</li>
<li>Check which calculation method your mosque uses, as a different Fajr angle can shift suhoor and Isha times.</li>
<li>Confirm the start and end of Ramadan with your local announcement (see <a href="/blog/hijri-calendar-explained/">the Hijri calendar</a>).</li>
</ul>
<p>If you have a medical condition or are travelling, ask a scholar and a doctor about your obligations.</p>`
},
{
  slug: 'why-prayer-times-differ-between-apps-and-mosques', date: D,
  title: 'Why Prayer Times Differ Between Apps and Your Local Mosque',
  desc: 'The real reasons two prayer timetables disagree by a few minutes, from calculation methods and iqamah times to daylight saving and rounding.',
  related: ['prayer-time-calculation-methods-compared', 'hanafi-vs-shafii-asr-time', 'how-prayer-times-are-calculated'],
  html: `<p>A common question: "My app says Fajr is at 5:12 but my mosque says 5:25. Which is right?" Often both are correct. Here are the usual reasons for differences.</p>
<h2>1. Different calculation methods</h2>
<p>The biggest cause is the angle used for Fajr and Isha. A 15° method (ISNA) and an 18° method (Muslim World League) can differ by 15 to 30 minutes at mid-latitudes. See <a href="/blog/prayer-time-calculation-methods-compared/">our comparison of methods</a>.</p>
<h2>2. Hanafi or Standard Asr</h2>
<p>Asr can differ by 30 minutes to over an hour, depending on the setting. Many mosques publish the earlier time for one school and the later time for another. See <a href="/blog/hanafi-vs-shafii-asr-time/">Hanafi vs Shafi'i Asr</a>.</p>
<h2>3. Adhan time versus iqamah time</h2>
<p>The adhan announces that the prayer time has begun. The <strong>iqamah</strong> is the call that starts the congregational prayer, and mosques usually set it 5 to 30 minutes after the adhan to allow people to arrive. A mosque timetable may list only iqamah times, which will be later than the start times in an app.</p>
<h2>4. Safety margins</h2>
<p>Some authorities add a few minutes of caution: for example a few minutes after calculated sunset before Maghrib, or a few minutes after solar noon before Dhuhr, so that the time has certainly begun. Some also place the end of the Fajr period a few minutes before sunrise.</p>
<h2>5. Fixed timetables</h2>
<p>Many mosques use a printed timetable calculated for the first day of each month or week and held for several days at a time, or round times to the nearest 5 minutes. Apps calculate each day separately.</p>
<h2>6. Rounding and location</h2>
<p>Apps round to the minute or truncate; some round up for Fajr and down for Isha as a precaution. Prayer times also depend on your exact location. A city timetable is calculated for a central point, so a town 50 km east may have times that are a couple of minutes earlier. For large countries or cities the difference can be noticeable.</p>
<h2>7. Daylight saving time</h2>
<p>Daylight saving time moves the clock by an hour, and the sun does not follow. If an app or a printed timetable is not updated on the right date, it can be an hour out. Our timetables look up the clock offset for every day, so they follow the local clock automatically.</p>
<h2>8. Altitude and horizon</h2>
<p>Standard calculations assume a flat sea-level horizon. At high altitude or by the sea the sun appears slightly earlier or later; hills can delay sunrise visually. These effects are mostly a minute or less but may matter for fasting accuracy.</p>
<h2>What should you do?</h2>
<ol>
<li>For congregational prayers, follow your mosque's timetable.</li>
<li>For praying alone, use the method and school you follow, and be consistent.</li>
<li>For fasting, if in doubt, stop eating a few minutes before Fajr and wait a minute or two after sunset.</li>
</ol>
<p>On prayertim.com you can change the method and Asr school in the Options box, and our <a href="/methodology/">methodology page</a> shows what each default means.</p>`
},
{
  slug: 'praying-while-traveling-qasr-and-jam', date: D,
  title: 'Praying While Traveling: Shortening (Qasr) and Combining (Jam\') Prayers',
  desc: 'An introduction to the travel concessions in prayer: shortening four-rak\'ah prayers, combining prayers, the distance question and how schools differ.',
  related: ['five-daily-prayers-names-times-rakat', 'how-to-find-qibla-direction', 'prayer-times-at-high-latitudes'],
  html: `<p>Islam makes allowance for travellers. Two concessions are discussed in all schools: <strong>qasr</strong> (shortening) and <strong>jam'</strong> (combining) of prayers. This article is a general introduction; the details vary between schools, so please check your own school's ruling with a scholar.</p>
<h2>Qasr: shortening the prayer</h2>
<p>A traveller may pray the four-rak'ah prayers (Dhuhr, Asr and Isha) as two rak'ahs. Fajr (two) and Maghrib (three) stay unchanged. The Quran mentions this concession in Surah an-Nisa (4:101), and the Prophet (peace be upon him) practised it in his journeys.</p>
<h2>How far is a journey?</h2>
<p>This is the most common question. The majority of scholars (Maliki, Shafi'i and Hanbali) set the minimum at about 80 km (around 50 miles), based on a distance of roughly two days' travel by camel. The Hanafi school defines travel as a journey of three days, which scholars today convert to a distance in the same general range, with some variation in the exact figure. Some scholars say that custom determines what counts as travel, with no fixed distance. Because there are differing opinions, it is best to follow the opinion of the school you follow or your trusted scholar.</p>
<h2>When does the concession start and end?</h2>
<ul>
<li>It generally starts when you leave the built-up area of your town on a qualifying journey.</li>
<li>Scholars differ on how long a stay at the destination allows shortening. Many follow a limit of about four days, after which you are considered resident; the Hanafi view is fifteen days. Others say that you may shorten as long as you intend to leave eventually and have no settled residence there. Ask your scholar if your stay is long.</li>
</ul>
<h2>Jam': combining two prayers</h2>
<p>Combining means praying two prayers one after the other within the time of one of them: Dhuhr with Asr, and Maghrib with Isha. The majority of scholars allow it for travellers, either at the time of the first prayer or the second. The Hanafi school generally does not allow combining within a single time during ordinary travel, except at Arafah and Muzdalifah during Hajj, though a Hanafi traveller can pray each prayer at the end of its own time, close together in practice. Fajr is never combined with another prayer.</p>
<h2>Qibla and times on the road</h2>
<ul>
<li>Pray the obligatory prayers on land facing the Qibla if possible; see <a href="/blog/how-to-find-qibla-direction/">how to find the Qibla</a>.</li>
<li>On a plane, train or bus, scholars allow praying seated if you cannot stand or turn, doing your best to face the Qibla at the start.</li>
<li>Use the prayer times of the place where you are. On prayertim.com, search for the city you are in; times change by a few minutes as you move east or west.</li>
</ul>
<h2>Sunnah prayers while travelling</h2>
<p>The regular sunnah prayers are generally not offered while travelling, except for the two rak'ahs before Fajr and Witr, which the Prophet (peace be upon him) kept up on his journeys.</p>
<p>These are general notes, not a ruling. For your specific journey, consult a qualified scholar or your community's imam.</p>`
}
];
