/* CMS core helper shared by login/dashboard/upload/library/approvals (demo prototype). Needs data.js + app.js first. */
(function(){
  const A=window.ADG, D=A.D, S=A.store, esc=A.esc;
  const css=`
.btn[disabled],.btn[aria-disabled=true]{opacity:.45;cursor:not-allowed;filter:none}
.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.tbl-wrap{overflow-x:auto;border:1px solid var(--line);border-radius:var(--radius)}
.tbl-wrap table.t{min-width:760px}
.ferr{color:var(--red);font-size:.8rem;font-weight:600;margin-top:3px;min-height:1px}
.invalid{border-color:var(--red)!important}
.mact{display:flex;gap:8px;justify-content:flex-end;margin-top:16px;flex-wrap:wrap}
.modal h2{font-size:1.3rem}
.note{background:#FCE9D2;border:1px solid #f3cf9f;color:#6b3a05;border-radius:8px;padding:9px 12px;font-size:.88rem}
body.hc .note{background:#000;color:#fff;border-color:#fff}
.chk{display:flex;align-items:center;gap:8px;font-weight:600;font-size:.9rem;margin:10px 0}
.chk input{width:18px;height:18px}
`;
  const st=document.createElement("style"); st.textContent=css; document.head.appendChild(st);

  const MON=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const p2=n=>(n<10?"0":"")+n;
  const DEF={5:"Unpublished",13:"Draft",21:"Draft",24:"Unpublished"};
  const SEEDS=[
    {key:"S-1",id:"S-1",title:"Women's self-help groups: loan success stories",cat:"women",lang:"Hindi",status:"Pending approval",by:"Vikram Singh",date:"2026-11-13",size:412e6,dur:"09:20",desc:"Four short field stories showing how self-help groups used micro-loans to start small businesses. Sample content for demonstration only.",tags:["women","hindi","loans"],comment:""},
    {key:"S-2",id:"S-2",title:"Kharif crop advisory: monsoon update",cat:"agri",lang:"Marathi",status:"Approved",by:"Vikram Singh",date:"2026-11-11",size:238e6,dur:"06:05",desc:"Seasonal advisory for farmers covering sowing windows and soil moisture checks. Sample content for demonstration only.",tags:["agriculture","marathi","advisory"],comment:""},
    {key:"S-3",id:"S-3",title:"Swachh campus drive: highlights",cat:"env",lang:"English",status:"Returned",by:"Vikram Singh",date:"2026-11-09",size:176e6,dur:"04:48",desc:"Highlights from a cleanliness drive across partner campuses. Sample content for demonstration only.",tags:["environment","english","campus"],comment:"Audio level is low in the second half; please re-export with normalised audio and resubmit."}
  ];
  const SEED_AUDIT=[
    {at:"14 Nov 2026, 17:05",actor:"Meera Joshi",role:"Approver",action:"Approved",item:"Kharif crop advisory: monsoon update",note:""},
    {at:"13 Nov 2026, 11:42",actor:"Vikram Singh",role:"Inputter",action:"Submitted for approval",item:"Women's self-help groups: loan success stories",note:""},
    {at:"11 Nov 2026, 15:20",actor:"Meera Joshi",role:"Approver",action:"Returned",item:"Swachh campus drive: highlights",note:"Audio level is low in the second half; please re-export."},
    {at:"10 Nov 2026, 10:12",actor:"Anita Rao",role:"Super Admin",action:"Promoted to live",item:"Staging snapshot (5 changes)",note:""},
    {at:"08 Nov 2026, 09:30",actor:"Anita Rao",role:"Super Admin",action:"Published",item:"UPI explained for first-time users",note:""}
  ];
  const catOf=id=>D.cats.find(c=>c.id===id)||D.cats[0];

  const CORE={
    DEF, SEEDS,
    now(){ const d=new Date(); return d.getDate()+" "+MON[d.getMonth()]+" "+d.getFullYear()+", "+p2(d.getHours())+":"+p2(d.getMinutes()); },
    isoDate(){ const d=new Date(); return d.getFullYear()+"-"+p2(d.getMonth()+1)+"-"+p2(d.getDate()); },
    user(){ return A.user()||{name:"Guest",role:"Inputter"}; },
    can:A.can, canApprove(){ return A.can("content.review"); },
    bytes(n){ n=+n||0; return n>=1e9?(n/1e9).toFixed(2)+" GB":n>=1e6?(n/1e6).toFixed(1)+" MB":n>=1e3?Math.round(n/1e3)+" KB":n+" B"; },
    uploads(){ const u=S.get("uploads",[]); return Array.isArray(u)?u:[]; },
    items(){
      const ov=S.get("lib_over",{}), del=S.get("lib_del",[]);
      const base=D.videos.filter(v=>del.indexOf("v"+v.id)<0).map(v=>{
        const o=ov["v"+v.id]||{}; const cid=o.cat||v.cat; const c=catOf(cid);
        return Object.assign({key:"v"+v.id,id:v.id,title:v.title,lang:v.lang,dur:v.dur,views:v.views,date:v.date,desc:v.desc,tags:v.tags.slice(),status:DEF[v.id]||"Published",by:"NMW Editorial",source:"data"},o,{cat:cid,catName:c.name,color:c.color,icon:c.icon});
      });
      const ups=CORE.uploads().map(u=>{ const c=catOf(u.cat); return Object.assign({views:0,dur:"—",tags:[],desc:"",by:"—",source:"upload"},u,{key:u.id,catName:c.name,color:c.color,icon:c.icon}); });
      return ups.concat(base);
    },
    update(key,patch){
      if(String(key).charAt(0)==="v"){ const ov=S.get("lib_over",{}); ov[key]=Object.assign(ov[key]||{},patch); S.set("lib_over",ov); }
      else { const u=CORE.uploads().map(x=>x.id===key?Object.assign({},x,patch):x); S.set("uploads",u); }
    },
    remove(key){
      if(String(key).charAt(0)==="v"){ const d=S.get("lib_del",[]); if(d.indexOf(key)<0) d.push(key); S.set("lib_del",d); }
      else S.set("uploads",CORE.uploads().filter(x=>x.id!==key));
    },
    /* approvals: uploads + 3 seeded items */
    apprItems(){
      const so=S.get("appr_seed",{});
      const seeds=SEEDS.map(s=>{ const c=catOf(s.cat); return Object.assign({views:0,source:"seed"},s,so[s.key]||{},{catName:c.name,color:c.color,icon:c.icon}); });
      const ups=CORE.items().filter(i=>i.source==="upload");
      return ups.concat(seeds);
    },
    apprUpdate(key,patch){
      if(String(key).indexOf("S-")===0){ const so=S.get("appr_seed",{}); so[key]=Object.assign(so[key]||{},patch); S.set("appr_seed",so); }
      else CORE.update(key,patch);
    },
    pendingCount(){ return CORE.apprItems().filter(i=>i.status==="Pending approval").length; },
    staged(){ return S.get("staged",[]); },
    audit(action,item,note){
      const u=CORE.user(); const l=S.get("audit",[]);
      l.unshift({at:CORE.now(),actor:u.name,role:u.role,action:action,item:item,note:note||""});
      S.set("audit",l.slice(0,200));
    },
    auditList(){ return S.get("audit",[]).concat(SEED_AUDIT); },
    statusChip(s){ const c={"Published":"g","Approved":"g","Unpublished":"","Draft":"","Pending approval":"o","Returned":"r"}[s]; return '<span class="chip '+(c||"")+'">'+esc(s)+'</span>'; },
    modal(html,onMount){
      const prev=document.activeElement;
      const bg=A.modal(html,onMount);
      const dlg=bg.firstElementChild; const h=dlg.querySelector("h2");
      if(h){ h.id=h.id||("mt"+Date.now()); dlg.setAttribute("aria-labelledby",h.id); }
      const f=dlg.querySelector("input:not([type=hidden]),textarea,select")||dlg.querySelector("button");
      if(f) f.focus();
      const key=e=>{
        if(!bg.isConnected){ document.removeEventListener("keydown",key); return; }
        if(e.key==="Escape"){ bg.remove(); }
        else if(e.key==="Tab"){
          const els=[...dlg.querySelectorAll("a[href],button:not([disabled]),input:not([disabled]),select,textarea,video")];
          if(!els.length) return; const first=els[0],last=els[els.length-1];
          if(e.shiftKey&&document.activeElement===first){ e.preventDefault(); last.focus(); }
          else if(!e.shiftKey&&document.activeElement===last){ e.preventDefault(); first.focus(); }
        }
      };
      document.addEventListener("keydown",key);
      const mo=new MutationObserver(()=>{ if(!bg.isConnected){ mo.disconnect(); document.removeEventListener("keydown",key); if(prev&&prev.focus&&prev.isConnected) try{prev.focus();}catch(e){} } });
      mo.observe(document.body,{childList:true});
      return bg;
    },
    confirm(o){
      const bg=CORE.modal('<h2>'+esc(o.title)+'</h2><p>'+o.msg+'</p><div class="mact"><button class="btn sec" data-close>Cancel</button><button class="btn '+(o.cls||"")+'" id="cfOk">'+esc(o.ok||"Confirm")+'</button></div>');
      bg.querySelector("#cfOk").onclick=function(){ bg.remove(); o.onOk(); };
      return bg;
    },
    download(name,text,type){
      const b=new Blob([text],{type:type||"text/plain"}); const a=document.createElement("a");
      a.href=URL.createObjectURL(b); a.download=name; document.body.appendChild(a); a.click();
      setTimeout(()=>{ URL.revokeObjectURL(a.href); a.remove(); },500);
    },
    catOf
  };
  window.CORE=CORE;
})();
