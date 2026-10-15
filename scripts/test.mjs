import fs from 'node:fs'; import assert from 'node:assert';
const pages=JSON.parse(fs.readFileSync('docs/reverse-engineering/pages.json','utf8'));
assert.equal(pages.length,111);
for(const p of [...pages.map(p=>p.route),'/','/credits']){const h=fs.readFileSync(`dist${p}/index.html`.replace('//','/'),'utf8');
 assert(p==='/credits'||!/\bVoid\b(?![^<]*<\/a>)/.test(h.replace(/Structure inspired by <a[^>]*>Void<\/a>|from <a[^>]*>Void<\/a>|DST is not affiliated with Void/g,'')),`Void text leak in ${p}`);
 assert(h.includes('/logo-dst.png'),p); for(const m of h.matchAll(/href="(\/docs[^"]*)"/g)) assert(fs.existsSync(`dist${m[1]}/index.html`),`broken link ${m[1]} in ${p}`);}
assert(!/"account_id"|0x4AAAA|sk-|ghp_/.test(fs.readFileSync('wrangler.jsonc','utf8')));
console.log('ok',pages.length+2,'pages');
