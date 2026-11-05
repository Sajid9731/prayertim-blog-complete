const fs=require('fs');
function slugify(s){
  return s.normalize('NFKD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/&/g,' and ').replace(/['’.,()]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
}
function load(dir){
  const lines=[...fs.readFileSync(dir+'/world1.txt','utf8').split('\n'),...fs.readFileSync(dir+'/world2.txt','utf8').split('\n')];
  const countries=[]; let cur=null;
  for(const raw of lines){
    const line=raw.trim(); if(!line||line[0]==='#')continue;
    if(line[0]==='@'){
      const [name,method,school,tz]=line.slice(1).split('|');
      cur={name,slug:slugify(name),method,school:school==='H'?1:0,tz,cities:[]}; countries.push(cur);
    } else {
      const [nm,lat,lng,tz]=line.split('|');
      const [name,alias]=nm.split('~');
      cur.cities.push({name,alias:alias||'',slug:slugify(name),lat:+lat,lng:+lng,tz:tz||cur.tz,country:cur});
    }
  }
  countries.sort((a,b)=>a.name.localeCompare(b.name,'en'));
  return countries;
}
module.exports={load,slugify};
