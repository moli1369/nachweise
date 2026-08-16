(() => {
  const load = (url, id) => {
    if (document.getElementById(id)) return;
    const s=document.createElement('script'); s.id=id; s.src=url+(url.includes('?')?'&':'?')+'v=4'; s.defer=true; document.body.appendChild(s);
  };
  const loadCss = (href, id) => {
    if (document.getElementById(id)) return;
    const l=document.createElement('link'); l.id=id; l.rel='stylesheet'; l.href=href+'?v=4'; document.head.appendChild(l);
  };
  loadCss('assets/css/lab-command-center.css','lab-command-center-css');
  load('assets/js/lab-command-center.js','lab-command-center-js');

  const storageKey='portfolio-environment';
  if(sessionStorage.getItem(storageKey)) return;

  const style=document.createElement('style');
  style.textContent=`
    body.environment-lock>*:not(#environment-selector){visibility:hidden}
    #environment-selector{position:fixed;inset:0;z-index:9999;display:grid;place-items:center;overflow:auto;padding:22px;background:radial-gradient(circle at 50% 25%,rgba(66,199,255,.13),transparent 33%),linear-gradient(180deg,#030a12,#06111c);color:#edf7ff;font-family:var(--sans,system-ui,sans-serif);-webkit-tap-highlight-color:transparent;touch-action:manipulation}
    .env-grid{position:absolute;inset:0;opacity:.25;background-image:linear-gradient(rgba(120,200,240,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(120,200,240,.035) 1px,transparent 1px);background-size:42px 42px}
    .env-shell{position:relative;width:min(1040px,100%);display:grid;gap:18px}
    .env-head{text-align:center}.env-mark{display:inline-grid;place-items:center;width:54px;height:54px;border:1px solid rgba(66,199,255,.35);border-radius:16px;background:rgba(66,199,255,.06);color:#42c7ff;font:600 .8rem var(--mono,monospace);box-shadow:0 0 28px rgba(66,199,255,.14)}
    .env-kicker{margin:13px 0 7px;color:#42c7ff;font:500 .58rem var(--mono,monospace);letter-spacing:.18em;text-transform:uppercase}.env-name{margin:0;color:#d8eaf3;font-size:clamp(1.1rem,2.6vw,1.55rem);font-weight:600}.env-role{margin:5px 0 0;color:#79edbc;font:500 clamp(.66rem,1.4vw,.8rem) var(--mono,monospace);letter-spacing:.08em;text-transform:uppercase}.env-location{margin:6px 0 0;color:#718a9b;font:500 .55rem var(--mono,monospace)}
    .env-focus{display:flex;justify-content:center;flex-wrap:wrap;gap:6px;margin:10px auto 0}.env-focus span{padding:5px 7px;border:1px solid rgba(180,215,240,.1);border-radius:7px;color:#8da7b8;font:500 .49rem var(--mono,monospace)}
    .env-head h1{margin:15px 0 0;font-size:clamp(2rem,5vw,4.2rem);line-height:.96;letter-spacing:-.055em}.env-head p{max-width:680px;margin:10px auto 0;color:#8ba4b5;font-size:.84rem;line-height:1.5}.env-recommend{justify-self:center;margin-top:9px;padding:7px 10px;border:1px solid rgba(111,229,174,.18);border-radius:999px;background:rgba(111,229,174,.045);color:#79edbc;font:500 .55rem var(--mono,monospace)}
    .env-cards{display:grid;grid-template-columns:1fr 1fr;gap:14px}.env-card{display:flex;flex-direction:column;align-items:flex-start;min-width:0;min-height:0;padding:21px;border:1px solid rgba(180,215,240,.12);border-radius:20px;background:linear-gradient(145deg,rgba(13,30,46,.92),rgba(6,17,28,.97));color:inherit;text-align:left;cursor:pointer;transition:transform .22s,border-color .22s,box-shadow .22s;-webkit-tap-highlight-color:transparent;touch-action:manipulation;user-select:none}.env-card:hover{transform:translateY(-4px);border-color:rgba(66,199,255,.4);box-shadow:0 26px 70px rgba(0,0,0,.28)}.env-card.recommended{border-color:rgba(111,229,174,.3)}
    .env-icon{display:grid;place-items:center;width:52px;height:52px;border-radius:14px;background:rgba(66,199,255,.07);border:1px solid rgba(66,199,255,.15);font-size:1.3rem}.env-card[data-env="mobile"] .env-icon{background:rgba(121,237,188,.065);border-color:rgba(121,237,188,.16)}.env-card h2{margin:15px 0 6px;font-size:1.32rem;letter-spacing:-.025em}.env-card p{margin:0;max-width:460px;color:#8fa7b7;font-size:.76rem;line-height:1.52}.env-tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:14px}.env-tags span{padding:4px 6px;border:1px solid rgba(180,215,240,.1);border-radius:7px;color:#8da7b8;font:500 .49rem var(--mono,monospace)}
    .env-enter{position:static;display:block;width:100%;margin-top:18px;padding-top:13px;border-top:1px solid rgba(180,215,240,.08);color:#42c7ff;font:600 .59rem var(--mono,monospace);text-align:right}
    .env-auto{justify-self:center;border:1px solid rgba(180,215,240,.14);border-radius:10px;background:rgba(255,255,255,.02);color:#9db2c0;padding:8px 12px;font:500 .53rem var(--mono,monospace);cursor:pointer}.env-auto:hover{border-color:rgba(66,199,255,.32);color:#42c7ff}.env-foot{text-align:center;color:#536d80;font:500 .48rem var(--mono,monospace)}
    @media(max-width:700px){#environment-selector{padding:15px;align-items:start}.env-shell{gap:13px;padding:10px 0 18px}.env-head h1{font-size:2.1rem}.env-head p{font-size:.78rem}.env-focus{max-width:360px}.env-cards{grid-template-columns:1fr;gap:10px}.env-card{padding:17px;border-radius:16px}.env-card h2{font-size:1.16rem;margin-top:12px}.env-card p{font-size:.71rem}.env-tags{margin-top:11px}.env-enter{margin-top:14px;padding-top:10px}}
    @media(prefers-reduced-motion:reduce){.env-card{transition:none}}
  `;
  document.head.appendChild(style);
  document.body.classList.add('environment-lock');

  const root=document.createElement('div');
  root.id='environment-selector';
  root.innerHTML=`<div class="env-grid" aria-hidden="true"></div><div class="env-shell"><header class="env-head"><div class="env-mark">MA</div><div class="env-kicker">IT PORTFOLIO · PERSONAL NETWORK LAB</div><div class="env-name">Mohammad Askari Dehestani</div><div class="env-role">System Administrator · Network Engineer</div><div class="env-location">Erlangen, Germany</div><div class="env-focus"><span>NETWORK ENGINEERING</span><span>VIRTUALIZATION</span><span>SECURITY</span><span>AUTOMATION</span><span>SERVER INFRASTRUCTURE</span></div><h1>Choose your environment</h1><p>Explore the same technical portfolio through an interface optimized for your device. The Network Operations Lab is available in both environments.</p><div class="env-recommend" id="env-recommend">Detecting device…</div></header><div class="env-cards"><button class="env-card" type="button" data-env="desktop"><div class="env-icon" aria-hidden="true">🖥</div><h2>Desktop / Laptop</h2><p>Full-width command center, expanded topology, multi-column case studies and keyboard-friendly network simulation.</p><div class="env-tags"><span>FULL LAB</span><span>WIDE TOPOLOGY</span><span>KEYBOARD</span><span>CASE STUDIES</span></div><span class="env-enter">ENTER DESKTOP →</span></button><button class="env-card" type="button" data-env="mobile"><div class="env-icon" aria-hidden="true">📱</div><h2>Mobile</h2><p>Touch-first layout, compact topology, readable projects and a terminal optimized for phone screens.</p><div class="env-tags"><span>TOUCH FIRST</span><span>COMPACT LAB</span><span>ONE COLUMN</span><span>PHONE</span></div><span class="env-enter">ENTER MOBILE →</span></button></div><button class="env-auto" id="env-auto" type="button">Continue with detected environment</button><div class="env-foot">The choice is remembered for this browser session.</div></div>`;
  document.body.appendChild(root);
  const detected=matchMedia('(max-width:700px)').matches||/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)?'mobile':'desktop';
  root.querySelector('#env-recommend').textContent=detected==='mobile'?'Detected: MOBILE DEVICE':'Detected: DESKTOP / LAPTOP';
  root.querySelector(`[data-env="${detected}"]`)?.classList.add('recommended');
  let entering=false;
  const enter=env=>{if(entering)return; entering=true; sessionStorage.setItem(storageKey,env); root.querySelectorAll('.env-card,.env-auto').forEach(el=>{el.disabled=true;el.style.pointerEvents='none'}); root.style.opacity='0';root.style.transition='opacity .18s ease';setTimeout(()=>{document.body.classList.remove('environment-lock');root.remove();window.dispatchEvent(new CustomEvent('portfolio:environment',{detail:{environment:env}}))},180)};
  const activate = el => { const env=el?.dataset?.env; if(env) enter(env); };
  root.querySelectorAll('.env-card').forEach(card=>{
    card.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();activate(card);},{capture:true});
    card.addEventListener('pointerup',e=>{if(e.pointerType!=='mouse'){e.preventDefault();e.stopPropagation();activate(card);}},{capture:true});
  });
  root.querySelector('#env-auto').addEventListener('click',e=>{e.preventDefault();e.stopPropagation();enter(detected)},{capture:true});
  root.addEventListener('click',e=>e.stopPropagation(),true);
})();
