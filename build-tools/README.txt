Optional: rebuild the whole site (needs Node.js 18 or newer, https://nodejs.org).
  cd build-tools
  node src/build.js ../prayertim-site
This regenerates every page (the monthly tables saved inside the pages are refreshed for the current month).
Country/city data: data/world1.txt and data/world2.txt   (format explained at the top of world1.txt)
Site settings (contact email, optional form service): prayertim-site/config.js
