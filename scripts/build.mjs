// Static site generator for agents-sdk.space.developer/bugbot/cursur
// Page map is derived from the structure of voidzero-dev/void (MIT); all copy here is original.
import fs from 'node:fs'; import path from 'node:path';
const SITE='agents-sdk.space.developer/bugbot/cursur';
const out='dist'; fs.rmSync(out,{recursive:true,force:true}); fs.mkdirSync(out);
fs.cpSync('public',out,{recursive:true});
const clean=t=>t.replace(/\s*\{#.*\}/,'').replace(/Void Platform/g,'Control Plane').replace(/Void/g,'DST').trim();
const sectionOf=f=>{
 if(f.startsWith('./reference/cli'))return['cli','CLI'];
 if(f.startsWith('./guide/platform')||/guide\/(platform-|self-hosted)/.test(f))return['control','Control Plane'];
 if(f.startsWith('./guide'))return['build','Build'];
 if(f.startsWith('./integrations'))return['connect','Connect'];
 if(f.startsWith('./reference/cli'))return['cli','CLI'];
 if(f.startsWith('./reference/api'))return['api','SDK API'];
 return['ref','Reference'];};
const pages=fs.readFileSync('scripts/void-pages.txt','utf8').trim().split('\n').map(l=>{let[f,t]=l.split('|');if(!f.startsWith('./'))f='./'+f;return{f,t}}).filter(p=>p.f!=='./index.md').map(({f,t})=>{
 const[sec,label]=sectionOf(f);
 let slug=f.replace(/^\.\/(guide\/platform\/|guide\/|integrations\/|reference\/cli\/?|reference\/api\/?|reference\/)/,'').replace(/\.md$/,'').replace(/\/?index$/,'')||'overview';
 const title=clean(t)||'Overview';
 return{void:f.replace(/^\.\//,'/').replace(/\.md$/,'').replace(/\/index$/,'/'),route:`/docs/${sec}/${slug}`,sec,label,title};});
const blurb={build:'How to use %s in a DST app on Cloudflare Workers: when to reach for it, the smallest working setup, and what changes when you deploy.',
control:'Operating the DST control plane: %s. Steps for the person who runs the shared workspace for a team.',
connect:'Wiring DST together with %s. What works out of the box and which settings you set yourself.',
cli:'The `dst` command group for %s. Each command prints a plan first and only changes remote resources after you confirm.',
api:'SDK surface for %s: exported helpers, their inputs and outputs, with a short TypeScript example.',
ref:'Reference for %s in a DST project.'};
const cliName=t=>t.toLowerCase().replace(/[^a-z]+/g,' ').trim().split(' ')[0];
const nav={};pages.forEach(p=>(nav[p.label]??=[]).push(p));
const esc=s=>s.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const css=`:root{--bg:#fff;--fg:#000;--mut:#666;--line:#eaeaea;--acc:#fb0fab}
@media(prefers-color-scheme:dark){:root{--bg:#000;--fg:#ededed;--mut:#a1a1a1;--line:#222;--acc:#ededed}}
:root[data-theme=light]{--bg:#fff;--fg:#000;--mut:#666;--line:#eaeaea;--acc:#fb0fab}:root[data-theme=dark]{--bg:#000;--fg:#ededed;--mut:#a1a1a1;--line:#222;--acc:#ededed}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:15px/1.6 ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif}
a{color:inherit}header{position:sticky;top:0;display:flex;align-items:center;gap:20px;padding:12px 24px;border-bottom:1px solid var(--line);background:var(--bg);z-index:2}
header img{height:28px;border-radius:4px}header .name{font-weight:600;font-size:13px}header nav{margin-left:auto;display:flex;gap:16px;font-size:13px}header nav a{text-decoration:none;color:var(--mut)}
button.t{border:1px solid var(--line);background:none;color:var(--fg);border-radius:6px;padding:4px 8px;cursor:pointer}
.hero{max-width:960px;margin:0 auto;padding:96px 24px 48px;text-align:center}.hero h1{font-size:56px;letter-spacing:-.04em;line-height:1.05;margin:0 0 16px}
.hero p{color:var(--mut);font-size:18px;max-width:620px;margin:0 auto 28px}.btn{display:inline-block;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:500;margin:4px;border:1px solid var(--line)}.btn.p{background:var(--fg);color:var(--bg)}
pre{background:transparent;border:1px solid var(--line);border-radius:8px;padding:16px;overflow:auto;font:13px ui-monospace,Menlo,monospace;text-align:left}
.grid{max-width:1100px;margin:0 auto;padding:24px;display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:1px;background:var(--line);border:1px solid var(--line)}
.grid>div{background:var(--bg);padding:24px}.grid h3{margin:0 0 8px;font-size:15px}.grid p{margin:0;color:var(--mut);font-size:14px}
.doc{display:grid;grid-template-columns:260px 1fr;max-width:1200px;margin:0 auto}aside{border-right:1px solid var(--line);padding:24px;font-size:13px;height:calc(100vh - 53px);overflow:auto;position:sticky;top:53px}
aside h4{margin:16px 0 6px;font-size:12px;text-transform:uppercase;color:var(--mut)}aside a{display:block;text-decoration:none;color:var(--mut);padding:2px 0}aside a.on{color:var(--fg);font-weight:600}
main.c{padding:40px 48px;max-width:780px}main.c h1{letter-spacing:-.03em}.mut{color:var(--mut)}footer{border-top:1px solid var(--line);padding:24px;font-size:12px;color:var(--mut);text-align:center}
@media(max-width:800px){.doc{grid-template-columns:1fr}aside{display:none}.hero h1{font-size:36px}}`;
const shell=(title,body)=>`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} — ${SITE}</title><link rel="icon" href="/favicon.png"><link rel="apple-touch-icon" href="/apple-touch-icon.png"><style>${css}</style>
<script>try{const t=localStorage.theme;if(t)document.documentElement.dataset.theme=t}catch{}</script></head><body>
<header><a href="/"><img src="/logo-dst.png" alt="DST"></a><span class="name">${SITE}</span><nav><a href="/docs/build/overview">Docs</a><a href="/docs/cli/overview">CLI</a><a href="/docs/control/self-hosted-platform">Control Plane</a><a href="/credits">Credits</a></nav>
<button class="t" onclick="const d=document.documentElement,n=(d.dataset.theme||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'))==='dark'?'light':'dark';d.dataset.theme=n;localStorage.theme=n" aria-label="Toggle theme">◐</button></header>
${body}<footer>© 2026 agents-sdk.space · DST · Structure inspired by <a href="https://github.com/voidzero-dev/void">Void</a> (MIT, © Cloudflare, Inc.) — <a href="/credits">credits</a></footer></body></html>`;
const write=(r,h)=>{const d=path.join(out,r);fs.mkdirSync(d,{recursive:true});fs.writeFileSync(path.join(d,'index.html'),h)};
const feats=[['One import, real resources','Pull in a database, a bucket or a queue from the SDK and DST provisions it on Cloudflare when you ship.'],['Types end to end','Schema, server loaders and UI share one set of types, so mistakes show up in your editor, not production.'],['Bring any framework','Keep Astro, Nuxt, SvelteKit, React Router or plain Hono. DST sits underneath.'],['Shared workspace for teams','Let teammates and agents ship previews safely, with access rules you control.'],['Your own control plane','Run the project dashboard on your Cloudflare account. Nothing leaves it.'],['Agent-ready docs','Every page is plain HTML with predictable routes so coding agents can read it.']];
write('/',shell('Home',`<section class="hero"><img src="/logo-dst.png" alt="DST" style="height:96px;border-radius:12px"><h1>Ship agents and apps<br>from one terminal.</h1><p>DST is a CLI and SDK for building full-stack apps on Cloudflare Workers, plus a control plane your team can run themselves.</p>
<a class="btn p" href="/docs/build/quickstart">Start building</a><a class="btn" href="/docs/cli/overview">CLI reference</a><a class="btn" href="https://devstack.bid">devstack.bid</a>
<pre>$ npm create dst@latest my-app
$ cd my-app && dst dev        # local, with real bindings
$ dst ship --preview          # preview URL, nothing public yet
$ dst ship                    # production, after you confirm</pre></section>
<div class="grid">${feats.map(([a,b])=>`<div><h3>${a}</h3><p>${b}</p></div>`).join('')}</div><div style="height:64px"></div>`));
const side=cur=>Object.entries(nav).map(([l,ps])=>`<h4>${l}</h4>`+ps.map(p=>`<a ${p===cur?'class="on"':''} href="${p.route}">${esc(p.title)}</a>`).join('')).join('');
for(const p of pages){const ex=p.sec==='cli'?`<pre>$ dst ${p.title.match(/CLI Reference/)?'--help':cliName(p.title)} --help</pre>`:p.sec==='api'?`<pre>import { ${cliName(p.title)||'env'} } from 'dst-sdk'</pre>`:'';
 write(p.route,shell(p.title,`<div class="doc"><aside>${side(p)}</aside><main class="c"><p class="mut">${p.label}</p><h1>${esc(p.title)}</h1><p>${esc(blurb[p.sec].replace('%s',p.title))}</p>${ex}<p class="mut">This page is a draft outline. Detailed content will be written for DST.</p></main></div>`));}
write('/credits',shell('Credits',`<main class="c" style="margin:0 auto"><h1>Credits</h1><p>The information architecture of these docs (page map and section layout) was used as a guide from <a href="https://github.com/voidzero-dev/void">Void</a> by VoidZero / Cloudflare, Inc., licensed under the MIT License. No Void code, text, logo or images are used. DST is not affiliated with Void.</p><pre>MIT License — Copyright (c) 2026-present, Cloudflare, Inc.</pre><p>Design references (reference only, not copied): nextjs.org, 21st.dev, CodeSandbox. See docs/design/references.md in the repo.</p></main>`));
fs.writeFileSync(path.join(out,'404.html'),shell('Not found','<section class="hero"><h1>404</h1><p>Page not found.</p><a class="btn p" href="/">Home</a></section>'));
fs.writeFileSync('docs/reverse-engineering/pages.json',JSON.stringify(pages,null,1));
console.log('built',pages.length+2,'pages');
{let s='# Void → DST page map\n\nSource: examplessdk-lgtm/void (fork of voidzero-dev/void, MIT License, © Cloudflare, Inc.). Only the large-scale structure (page list, section grouping) is reused; all copy, naming, logo and design are original.\n\nCLI rename: `void` → `dst`. Sections: Guide → Build, Guide/Platform → Control Plane, Integrations → Connect, Reference/CLI → CLI, Reference/API → SDK API, Reference → Reference.\n\nThe main page the user referenced (ai.studio app cb2b41ff…) requires Google login and could not be read; the homepage was designed from scratch.\n\n| # | Void route | Our route | Our title |\n|---|---|---|---|\n| 0 | / | / | Home (new hero, DST logo, original copy) |\n';
pages.forEach((x,i)=>s+=`| ${i+1} | ${x.void} | ${x.route} | ${x.title} |\n`);s+='| + | — | /credits | Credits & MIT attribution |\n| + | — | /404 | Not found |\n';fs.writeFileSync('docs/reverse-engineering/void-page-map.md',s);}
