const {load}=require('./loaddata.js'); const PT=require('./prayer.js');
const cs=load(__dirname+'/../data'); let n=0, bad=0; const seen=new Set();
for(const c of cs){
  if(!PT.METHODS[c.method]) console.log('BAD METHOD',c.name,c.method);
  const slugs=new Set();
  for(const ct of c.cities){
    n++;
    if(slugs.has(ct.slug)) {console.log('DUP SLUG',c.name,ct.slug);bad++;}
    slugs.add(ct.slug);
    try{ new Intl.DateTimeFormat('en',{timeZone:ct.tz}); }catch(e){console.log('BAD TZ',c.name,ct.name,ct.tz);bad++;continue;}
    const off=PT.tzOffset(ct.tz,2026,1,15,ct.lng); // winter offset (standard time mostly)
    const diff=Math.abs(off-ct.lng/15);
    if(diff>3.2){console.log('LNG/TZ MISMATCH',c.name,ct.name,'lng',ct.lng,'off',off);bad++;}
    if(Math.abs(ct.lat)>66){console.log('POLAR',ct.name);}
  }
}
console.log('countries',cs.length,'cities',n,'problems',bad);
console.log(cs.map(c=>c.name+':'+c.cities.length).join(' | '));
