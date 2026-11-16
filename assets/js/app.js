/* NaViGate Bharat 2.0 demo prototype: shared shell and helpers. Usage: ADG.page({nav:"home"}) or ADG.admin({active:"dashboard"}) */
(function(){
  const D = window.DATA;
  const $ = (s,r=document)=>r.querySelector(s), $$ = (s,r=document)=>[...r.querySelectorAll(s)];
  const store = {
    get(k,d){ try{ const v=localStorage.getItem("adg_"+k); return v===null?d:JSON.parse(v);}catch(e){return d;} },
    set(k,v){ try{ localStorage.setItem("adg_"+k,JSON.stringify(v)); }catch(e){} }
  };
  const I18N = {
    hi:{Home:"मुख्य पृष्ठ",Videos:"वीडियो",Categories:"श्रेणियां","Community Radio":"सामुदायिक रेडियो",PSA:"जन सेवा घोषणाएं",Analytics:"विश्लेषण","Search videos, topics, schemes":"वीडियो, विषय, योजनाएं खोजें",Search:"खोजें","Skip to main content":"मुख्य सामग्री पर जाएं","Featured videos":"चुनिंदा वीडियो","Browse by category":"श्रेणी के अनुसार देखें","Latest videos":"नवीनतम वीडियो","Watch now":"अभी देखें","View all":"सभी देखें","Quick links":"त्वरित लिंक",Contact:"संपर्क","Staff login":"स्टाफ लॉगिन"}
  };
  let lang = store.get("lang","en");
  const tr = s => (lang==="hi" && I18N.hi[s]) || s;

  function fmt(n){ return n>=1e7?(n/1e7).toFixed(2)+" Cr":n>=1e5?(n/1e5).toFixed(1)+" L":n>=1e3?(n/1e3).toFixed(1)+"K":""+n; }
  function toast(msg){ let box=document.getElementById("toastBox"); if(!box){ box=document.createElement("div"); box.id="toastBox"; box.style.cssText="position:fixed;right:20px;bottom:20px;display:flex;flex-direction:column;gap:8px;z-index:99;align-items:flex-end"; document.body.appendChild(box); } const t=document.createElement("div"); t.className="toast"; t.style.position="static"; t.setAttribute("role","status"); t.textContent=msg; box.appendChild(t); setTimeout(()=>t.remove(),2800); }
  function modal(html,onMount){ const bg=document.createElement("div"); bg.className="modal-bg"; bg.innerHTML='<div class="modal" role="dialog" aria-modal="true">'+html+'</div>'; document.body.appendChild(bg); bg.addEventListener("click",e=>{if(e.target===bg)bg.remove();}); $$("[data-close]",bg).forEach(b=>b.onclick=()=>bg.remove()); if(onMount) onMount(bg); return bg; }
  function tabs(root){ root=root||document; $$(".tabs",root).forEach(tb=>{ const btns=$$("button",tb); btns.forEach(b=>b.addEventListener("click",()=>{ btns.forEach(x=>x.classList.remove("on")); b.classList.add("on"); const scope=tb.parentElement; $$(":scope > .pane",scope).forEach(p=>p.classList.toggle("on",p.id===b.dataset.pane)); })); }); }
  function vcard(v,base){ base=base||""; return '<a class="vcard" href="'+base+'video.html?id='+v.id+'"><div class="thumb" style="background:linear-gradient(135deg,'+v.color+',#0B1F3A)"><span class="play" aria-hidden="true">▶</span><span class="dur">'+v.dur+'</span></div><div class="bd"><span class="chip b">'+v.catName+'</span> <span class="chip">'+v.lang+'</span><h3>'+v.title+'</h3><div class="meta">'+fmt(v.views)+' views · '+v.date+'</div></div></a>'; }
  function esc(s){ return String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])); }
  function qs(k){ return new URLSearchParams(location.search).get(k); }

  /* ---------- tiny SVG charts ---------- */
  function line(el,labels,series,opt){ opt=opt||{}; const W=640,H=opt.h||240,p={l:46,r:14,t:14,b:28}; const all=series.flatMap(s=>s.values); let mx=Math.max(...all),mn=opt.min!=null?opt.min:0; if(opt.max!=null)mx=opt.max; const x=i=>p.l+i*(W-p.l-p.r)/(labels.length-1), y=v=>H-p.b-(v-mn)/(mx-mn||1)*(H-p.t-p.b);
    let g='';for(let i=0;i<=4;i++){const v=mn+(mx-mn)*i/4;g+='<line x1="'+p.l+'" x2="'+(W-p.r)+'" y1="'+y(v)+'" y2="'+y(v)+'" stroke="var(--line)"/><text x="'+(p.l-6)+'" y="'+(y(v)+4)+'" font-size="11" text-anchor="end" fill="var(--muted)">'+(opt.yfmt?opt.yfmt(v):fmt(v))+'</text>';}
    labels.forEach((l,i)=>{g+='<text x="'+x(i)+'" y="'+(H-8)+'" font-size="11" text-anchor="middle" fill="var(--muted)">'+l+'</text>';});
    series.forEach(s=>{const d=s.values.map((v,i)=>(i?'L':'M')+x(i)+','+y(v)).join(' ');g+='<path d="'+d+'" fill="none" stroke="'+s.color+'" stroke-width="2.6"/>'+s.values.map((v,i)=>'<circle cx="'+x(i)+'" cy="'+y(v)+'" r="3.4" fill="'+s.color+'"><title>'+s.name+' '+labels[i]+': '+(opt.yfmt?opt.yfmt(v):fmt(v))+'</title></circle>').join('');});
    const lg=series.length>1?'<div style="display:flex;gap:14px;font-size:.8rem;margin-top:4px">'+series.map(s=>'<span><i style="display:inline-block;width:10px;height:10px;border-radius:2px;background:'+s.color+';margin-right:5px"></i>'+s.name+'</span>').join('')+'</div>':'';
    el.innerHTML='<svg viewBox="0 0 '+W+' '+H+'" width="100%" role="img" aria-label="'+(opt.label||'Line chart')+'">'+g+'</svg>'+lg; }
  function bars(el,labels,values,opt){ opt=opt||{}; const W=640,H=opt.h||240,p={l:46,r:14,t:14,b:28}; const mx=opt.max||Math.max(...values)*1.1,mn=opt.min||0; const bw=(W-p.l-p.r)/labels.length; const y=v=>H-p.b-(v-mn)/(mx-mn||1)*(H-p.t-p.b);
    let g='';for(let i=0;i<=4;i++){const v=mn+(mx-mn)*i/4;g+='<line x1="'+p.l+'" x2="'+(W-p.r)+'" y1="'+y(v)+'" y2="'+y(v)+'" stroke="var(--line)"/><text x="'+(p.l-6)+'" y="'+(y(v)+4)+'" font-size="11" text-anchor="end" fill="var(--muted)">'+(opt.yfmt?opt.yfmt(v):fmt(v))+'</text>';}
    values.forEach((v,i)=>{const c=Array.isArray(opt.colors)?opt.colors[i]:(opt.color||'#2F6DB5');g+='<rect x="'+(p.l+i*bw+bw*.18)+'" y="'+y(v)+'" width="'+bw*.64+'" height="'+(H-p.b-y(v))+'" rx="4" fill="'+c+'"><title>'+labels[i]+': '+(opt.yfmt?opt.yfmt(v):fmt(v))+'</title></rect><text x="'+(p.l+i*bw+bw/2)+'" y="'+(H-8)+'" font-size="11" text-anchor="middle" fill="var(--muted)">'+labels[i]+'</text>';});
    el.innerHTML='<svg viewBox="0 0 '+W+' '+H+'" width="100%" role="img" aria-label="'+(opt.label||'Bar chart')+'">'+g+'</svg>'; }
  function donut(el,items,opt){ opt=opt||{}; const cols=opt.colors||['#12355B','#E8871E','#1F8A70','#2F6DB5','#6B7A90','#C0392B']; const tot=items.reduce((a,b)=>a+b[1],0); let a0=-Math.PI/2,paths='';
    items.forEach((it,i)=>{const a1=a0+it[1]/tot*2*Math.PI,r=70,ri=44,c=100,lg=(a1-a0)>Math.PI?1:0;const P=(r_,a)=>(c+r_*Math.cos(a))+','+(c+r_*Math.sin(a));paths+='<path d="M'+P(r,a0)+' A'+r+','+r+' 0 '+lg+' 1 '+P(r,a1)+' L'+P(ri,a1)+' A'+ri+','+ri+' 0 '+lg+' 0 '+P(ri,a0)+'Z" fill="'+cols[i%cols.length]+'"><title>'+it[0]+': '+it[1]+'%</title></path>';a0=a1;});
    el.innerHTML='<div style="display:flex;gap:18px;align-items:center;flex-wrap:wrap"><svg viewBox="0 0 200 200" width="170" role="img" aria-label="'+(opt.label||'Donut chart')+'">'+paths+'</svg><div style="font-size:.85rem">'+items.map((it,i)=>'<div><i style="display:inline-block;width:10px;height:10px;border-radius:2px;background:'+cols[i%cols.length]+';margin-right:6px"></i>'+it[0]+' <b>'+it[1]+'%</b></div>').join('')+'</div></div>'; }

  /* ---------- accessibility + language ---------- */
  function applyA11y(){ const fs=store.get("fs",16); document.documentElement.style.setProperty("--fs",fs+"px"); document.body.classList.toggle("hc",!!store.get("hc",false)); }
  function utilBar(base){ return '<div class="util"><div class="wrap"><div class="grp"><a href="#main" class="skipl">'+tr("Skip to main content")+'</a><a href="'+base+'cms/login.html">'+tr("Staff login")+'</a></div><div class="grp" role="group" aria-label="Accessibility and language"><button data-fs="-1" aria-label="Decrease text size">A-</button><button data-fs="0" aria-label="Normal text size">A</button><button data-fs="1" aria-label="Increase text size">A+</button><button data-hc aria-label="Toggle high contrast">◐ Contrast</button><select id="langSel" aria-label="Language"><option value="en">English</option><option value="hi">हिन्दी</option></select></div></div></div>'; }
  function wireUtil(){ $$("[data-fs]").forEach(b=>b.onclick=()=>{ let fs=store.get("fs",16); const d=+b.dataset.fs; fs=d===0?16:Math.min(22,Math.max(13,fs+d*2)); store.set("fs",fs); applyA11y(); }); const hc=$("[data-hc]"); if(hc) hc.onclick=()=>{ store.set("hc",!store.get("hc",false)); applyA11y(); }; const ls=$("#langSel"); if(ls){ ls.value=lang; ls.onchange=()=>{ store.set("lang",ls.value); location.reload(); }; } }
  function voice(input,form){ const SR=window.SpeechRecognition||window.webkitSpeechRecognition; if(SR){ const r=new SR(); r.lang=lang==="hi"?"hi-IN":"en-IN"; r.onresult=e=>{ input.value=e.results[0][0].transcript; form.requestSubmit?form.requestSubmit():form.submit(); }; r.onerror=()=>toast("Voice input not available"); try{ r.start(); toast("Listening..."); }catch(e){ toast("Voice input not available"); } } else { toast("Listening... (demo: heard 'digital literacy')"); setTimeout(()=>{ input.value="digital literacy"; form.requestSubmit?form.requestSubmit():form.submit(); },1100); } }


  /* ---------- RBAC: three roles (Super Admin, Inputter, Approver), maker-checker separation ---------- */
  const PERMS={
    "Super Admin":["dashboard.view","library.view","content.edit","content.unpublish","content.delete","users.manage","audit.view","settings.manage","master.edit","master.delete","reports.view"],
    "Inputter":["dashboard.view","library.view","content.create","content.edit.own","content.submit","master.edit","bulk.import","reports.view"],
    "Approver":["dashboard.view","library.view","content.review","content.publish","content.unpublish","staging.promote","master.decide","audit.view","reports.view"]
  };
  const PERM_LABELS=[
    ["content.create","Upload and create content"],["content.edit.own","Edit own drafts and returned items"],["content.edit","Edit any content metadata"],
    ["content.submit","Submit content for approval"],["content.review","Approve or return submissions"],["content.publish","Publish approved content"],
    ["content.unpublish","Unpublish content"],["content.delete","Delete content"],["staging.promote","Promote staging to live"],
    ["master.edit","Create and edit stations, PSA films, bulk imports"],["master.decide","Decide award nominations, approve PSA films"],["master.delete","Delete stations and PSA films"],
    ["users.manage","Manage users, roles and passwords"],["audit.view","View the audit log"],["settings.manage","Change system settings"],["reports.view","View dashboards, analytics and SLA reports"]
  ];
  function role(){ const u=store.get("user",null); return u&&u.role||""; }
  function can(p){ const r=PERMS[role()]||[]; return r.indexOf(p)>=0 || (p==="content.edit.own" && r.indexOf("content.edit")>=0); }

  /* ---------- public shell ---------- */
  function page(o){ o=o||{}; const base=o.base||""; applyA11y();
    const nav=[["home","Home","index.html"],["videos","Videos","search.html"],["cats","Categories","categories.html"],["crs","Community Radio","crs.html"],["psa","PSA","psa.html"],["analytics","Analytics","analytics.html"]];
    const h='<a class="skip" href="#main">'+tr("Skip to main content")+'</a><div class="demo-banner">DEMONSTRATION PROTOTYPE by ADG Online Solutions Pvt. Ltd. · Sample content only · Not the official NaViGate Bharat portal</div>'+utilBar(base)+
      '<header class="hdr"><div class="wrap"><a class="brand" href="'+base+'index.html"><span class="logo" aria-hidden="true"></span><span><b>NaViGate Bharat <span style="color:var(--saffron)">2.0</span></b><small>National Video Gateway · demo</small></span></a><nav class="nav" aria-label="Main">'+nav.map(n=>'<a href="'+base+n[2]+'" class="'+(o.nav===n[0]?'on':'')+'">'+tr(n[1])+'</a>').join('')+'</nav><form class="hsearch" id="hsearch" action="'+base+'search.html" role="search"><input name="q" type="search" placeholder="'+tr("Search videos, topics, schemes")+'" aria-label="Search"><button type="button" class="mic" id="micBtn" aria-label="Voice search">🎤</button><button type="submit" aria-label="'+tr("Search")+'">🔍</button></form></div></header>';
    const f='<footer class="ftr"><div class="wrap"><div class="grid g4"><div><h4>NaViGate Bharat 2.0</h4><div>Demonstration prototype built by ADG Online Solutions Pvt. Ltd. to illustrate how the portal would be maintained and enhanced.</div></div><div><h4>'+tr("Quick links")+'</h4><a href="'+base+'search.html">'+tr("Videos")+'</a><a href="'+base+'categories.html">'+tr("Categories")+'</a><a href="'+base+'crs.html">'+tr("Community Radio")+'</a><a href="'+base+'psa.html">'+tr("PSA")+'</a></div><div><h4>Compliance</h4><div>GIGW 3.0 aligned · WCAG 2.1 AA · Responsive · Bilingual</div></div><div><h4>'+tr("Contact")+'</h4><div>ADG Online Solutions Pvt. Ltd.<br>Faridabad, Haryana</div><a href="'+base+'sla.html">Service status</a></div></div><div class="cp">All videos, names and figures are fictional sample data. Last updated: 15 Nov 2026.</div></div></footer>';
    const d=document.createElement("div"); d.innerHTML=h; document.body.prepend(...d.childNodes); const fd=document.createElement("div"); fd.innerHTML=f; document.body.append(...fd.childNodes);
    const m=$("main")||$(".main-content"); if(m&&!m.id) m.id="main";
    wireUtil(); const hs=$("#hsearch"); $("#micBtn").onclick=()=>voice($("input",hs),hs); }

  /* ---------- admin shell (CMS, analytics, SLA internal views) ---------- */
  function admin(o){ o=o||{}; const base=o.base||"../"; applyA11y();
    const L=[["LABEL","CONTENT"],["dashboard","Dashboard","dashboard.html"],["upload","Upload video","upload.html","content.create"],["library","Content library","library.html"],["approvals","Approvals","approvals.html"],["LABEL","MODULES"],["crsadm","Community Radio","crs-admin.html"],["psaadm","PSA compliance","psa-admin.html"],["LABEL","OPERATIONS"],["sla","SLA & incidents","../sla.html"],["an","Analytics","../analytics.html"],["LABEL","ADMINISTRATION"],["users","User management","users.html","users.manage"],["audit","Audit log","audit.html","audit.view"],["pub","View public portal","../index.html"]];
    const side='<aside class="side"><a class="brand" href="dashboard.html"><span class="logo"></span><span><b style="font-size:1.05rem">NaViGate CMS</b><small>ADG demo</small></span></a>'+L.filter(x=>x[0]==='LABEL'||!x[3]||can(x[3])).filter((x,i,a)=>!(x[0]==='LABEL'&&(i===a.length-1||a[i+1][0]==='LABEL'))).map(x=>x[0]==="LABEL"?'<div class="lbl">'+x[1]+'</div>':'<a href="'+(x[2].startsWith("../")?x[2]:x[2])+'" class="'+(o.active===x[0]?'on':'')+'">'+x[1]+'</a>').join('')+'<div class="lbl">SESSION</div><a href="login.html" id="logout">Sign out</a></aside>';
    const wrapEl=document.createElement("div"); wrapEl.innerHTML='<div class="demo-banner">DEMONSTRATION PROTOTYPE · Sample data · Role-based CMS preview</div><div class="adm">'+side+'<div class="main" id="main"></div></div>';
    const content=[...document.body.childNodes]; document.body.innerHTML=""; document.body.append(...wrapEl.childNodes); const mainEl=$("#main"); content.forEach(n=>mainEl.appendChild(n));
    const u=store.get("user",null); if(!u && !o.public){ location.href="login.html"; } }
  function user(){ return store.get("user",{name:"Guest",role:""}); }
  function topbar(title,sub){ const u=user(); return '<div class="topbar"><div><h1 style="margin:0;font-size:1.6rem">'+title+'</h1>'+(sub?'<div class="muted">'+sub+'</div>':'')+'</div><div class="chip g" title="Signed-in role">👤 '+esc(u.name)+' · '+esc(u.role)+'</div></div>'; }

  window.ADG = {PERMS,PERM_LABELS,can,role,D,$,$$,store,fmt,toast,modal,tabs,vcard,esc,qs,line,bars,donut,page,admin,user,topbar,tr,lang:()=>lang};
})();
