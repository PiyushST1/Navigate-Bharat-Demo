/* Demo-only staff login: adds a "Staff login" button next to the High contrast control. No real authentication. */
(function(){
  var css=document.createElement('style');
  css.textContent='.sl-btn{display:inline-flex;align-items:center;gap:.4rem;margin-left:.5rem;padding:.25rem .8rem;border-radius:6px;border:1px solid currentColor;background:#F5A524;color:#1A1100;font:700 .85rem/1.2 inherit;cursor:pointer;white-space:nowrap}'
  +'.sl-btn:hover{filter:brightness(1.08)}'
  +'dialog.sl{border:0;border-radius:14px;padding:0;max-width:92vw;width:380px;box-shadow:0 24px 60px rgba(2,6,16,.45);color:#0B1F3A;background:#fff;font:15px/1.45 Calibri,"Segoe UI",system-ui,sans-serif}'
  +'dialog.sl::backdrop{background:rgba(2,6,16,.6)}'
  +'.sl form{padding:1.4rem}.sl h2{margin:0 0 .2rem;font:700 1.25rem Cambria,Georgia,serif}.sl p{margin:0 0 1rem;color:#4A5B73;font-size:.85rem}'
  +'.sl label{display:block;font-weight:700;font-size:.85rem;margin:.7rem 0 .25rem}.sl select,.sl input{width:100%;padding:.55rem .6rem;border:1px solid #9FB0C6;border-radius:8px;font:inherit;box-sizing:border-box;background:#fff;color:#0B1F3A}'
  +'.sl .row{display:flex;gap:.6rem;margin-top:1.1rem;justify-content:flex-end}.sl .row button{padding:.55rem 1.1rem;border-radius:8px;border:1px solid #12355B;font:700 .9rem inherit;cursor:pointer;background:#fff;color:#12355B}.sl .row .go{background:#12355B;color:#fff}'
  +'.sl .msg{margin-top:.8rem;font-weight:700;color:#0A7A70;min-height:1.2rem}';
  document.head.appendChild(css);
  var d=document.createElement('dialog');d.className='sl';d.setAttribute('aria-labelledby','slh');
  d.innerHTML='<form method="dialog"><h2 id="slh">Staff login</h2><p>Demonstration only. Opens the demo CMS in a new tab; any password works.</p>'
  +'<label for="slr">Demo account</label><select id="slr"><option>Superadmin</option><option>Admin</option><option>Content Editor</option><option>Approver</option></select>'
  +'<label for="slp">Password</label><input id="slp" type="password" autocomplete="off" placeholder="any value">'
  +'<div class="msg" role="status" id="slm"></div><div class="row"><button type="button" id="slx">Cancel</button><button type="button" class="go" id="slg">Sign in</button></div></form>';
  document.body.appendChild(d);
  var b=document.createElement('button');b.type='button';b.className='sl-btn';b.id='staffLogin';
  b.innerHTML='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"/></svg>Staff login';
  var anchor=document.getElementById('hc')||document.getElementById('contrast')||[].slice.call(document.querySelectorAll('button')).filter(function(x){return /contrast/i.test(x.textContent)})[0];
  if(anchor)anchor.insertAdjacentElement('afterend',b);else{b.style.cssText='position:fixed;top:8px;right:8px;z-index:999';document.body.appendChild(b)}
  var m=d.querySelector('#slm');
  b.onclick=function(){m.textContent='';d.showModal()};
  d.querySelector('#slx').onclick=function(){d.close()};
  d.querySelector('#slg').onclick=function(){try{localStorage.setItem('nb_cms_prefill',d.querySelector('#slr').value);localStorage.removeItem('nb_cms_session')}catch(e){}m.textContent='Opening CMS...';window.open('cms.html','_blank');setTimeout(function(){d.close()},600)};
})();
