(() => {
  const KEY='portfolio-environment';
  const old=document.getElementById('environment-selector');
  if(old) old.remove();
  document.body.classList.remove('environment-lock');
  if(sessionStorage.getItem(KEY)) return;

  const mobile=matchMedia('(max-width:700px)').matches || /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  const detected=mobile?'mobile':'desktop';

  const style=document.createElement('style');
  style.id='env-v2-style';
  style.textContent=`
    html.env-v2-active,html.env-v2-active body{overflow:hidden!important}
    #environment-selector-v2{position:fixed;inset:0;z-index:2147483647;display:grid;place-items:center;padding:20px;background:radial-gradient(circle at 50% 18%,rgba(66,199,255,.14),transparent 34%),linear-gradient(180deg,#020911,#06131f);color:#edf7ff;font-family:system-ui,-apple-system,Segoe UI,sans-serif;overflow:auto;touch-action:auto}
    #environment-selector-v2 *{box-sizing:border-box}
    .ev2-shell{width:min(1040px,100%);display:grid;gap:16px;position:relative;z-index:2}
    .ev2-head{text-align:center}.ev2-mark{display:inline-grid;place-items:center;width:50px;height:50px;border:1px solid rgba(66,199,255,.35);border-radius:14px;color:#42c7ff;font:700 13px ui-monospace,monospace;background:rgba(66,199,255,.06)}
    .ev2-kicker{margin:12px 0 5px;color:#42c7ff;font:600 10px ui-monospace,monospace;letter-spacing:.18em}.ev2-name{font-size:22px;font-weight:650}.ev2-role{margin-top:4px;color:#79edbc;font:600 11px ui-monospace,monospace;letter-spacing:.06em}.ev2-loc{margin-top:4px;color:#728b9e;font:500 10px ui-monospace,monospace}.ev2-head h1{margin:14px 0 7px;font-size:clamp(34px,6vw,64px);line-height:.95;letter-spacing:-.055em}.ev2-head p{max-width:660px;margin:0 auto;color:#8ca4b5;font-size:13px;line-height:1.55}.ev2-detect{justify-self:center;margin-top:8px;padding:7px 10px;border:1px solid rgba(121,237,188,.2);border-radius:99px;color:#79edbc;background:rgba(121,237,188,.045);font:600 10px ui-monospace,monospace}
    .ev2-cards{display:grid;grid-template-columns:1fr 1fr;gap:14px}.ev2-card{appearance:none;-webkit-appearance:none;width:100%;border:1px solid rgba(180,215,240,.13);border-radius:18px;padding:20px;background:linear-gradient(145deg,rgba(13,30,46,.96),rgba(5,15,25,.98));color:#edf7ff;text-align:left;cursor:pointer;touch-action:manipulation;user-select:none}.ev2-card:hover,.ev2-card:focus-visible{border-color:rgba(66,199,255,.48);outline:none;box-shadow:0 24px 65px rgba(0,0,0,.28)}.ev2-card.recommended{border-color:rgba(121,237,188,.34)}.ev2-icon{display:grid;place-items:center;width:48px;height:48px;border-radius:13px;border:1px solid rgba(66,199,255,.16);background:rgba(66,199,255,.07);font-size:22px}.ev2-card[data-env=mobile] .ev2-icon{border-color:rgba(121,237,188,.18);background:rgba(121,237,188,.06)}.ev2-card h2{margin:13px 0 5px;font-size:20px}.ev2-card p{margin:0;color:#8da6b8;font-size:12px;line-height:1.55}.ev2-tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:12px}.ev2-tags span{padding:4px 6px;border:1px solid rgba(180,215,240,.1);border-radius:6px;color:#91aabb;font:600 9px ui-monospace,monospace}.ev2-enter{display:block;margin-top:15px;padding-top:11px;border-top:1px solid rgba(180,215,240,.08);color:#42c7ff;text-align:right;font:700 10px ui-monospace,monospace}.ev2-auto{justify-self:center;border:1px solid rgba(180,215,240,.15);border-radius:9px;background:rgba(255,255,255,.025);padding:9px 13px;color:#9bb0be;cursor:pointer;font:600 10px ui-monospace,monospace}.ev2-auto:hover,.ev2-auto:focus-visible{border-color:rgba(66,199,255,.35);color:#42c7ff;outline:none}.ev2-foot{text-align:center;color:#526d80;font:500 9px ui-monospace,monospace}
    @media(max-width:700px){#environment-selector-v2{align-items:start;padding:14px}.ev2-shell{padding:8px 0 18px;gap:11px}.ev2-head h1{font-size:38px}.ev2-head p{font-size:12px}.ev2-cards{grid-template-columns:1fr;gap:10px}.ev2-card{padding:16px;border-radius:15px}.ev2-card h2{font-size:18px}.ev2-card p{font-size:11px}.ev2-enter{margin-top:12px}}
  `;
  document.head.appendChild(style);
  document.documentElement.classList.add('env-v2-active');

  const root=document.createElement('div');
  root.id='environment-selector-v2';
  root.setAttribute('role','dialog');
  root.setAttribute('aria-label','Choose environment');
  root.innerHTML=`
    <div class="ev2-shell">
      <header class="ev2-head">
        <div class="ev2-mark">MA</div>
        <div class="ev2-kicker">IT PORTFOLIO · PERSONAL NETWORK LAB</div>
        <div class="ev2-name">Mohammad Askari Dehestani</div>
        <div class="ev2-role">System Administrator · Network Engineer</div>
        <div class="ev2-loc">Erlangen, Germany</div>
        <h1>Choose your environment</h1>
        <p>Choose the interface that fits your device. Both environments contain the same portfolio and Network Operations Lab.</p>
        <div class="ev2-detect">Detected: ${mobile?'MOBILE DEVICE':'DESKTOP / LAPTOP'}</div>
      </header>
      <div class="ev2-cards">
        <button type="button" class="ev2-card ${detected==='desktop'?'recommended':''}" data-env="desktop"><span class="ev2-icon">🖥</span><h2>Desktop / Laptop</h2><p>Expanded topology, keyboard-friendly terminal and full project layout.</p><div class="ev2-tags"><span>FULL LAB</span><span>WIDE TOPOLOGY</span><span>KEYBOARD</span></div><span class="ev2-enter">ENTER DESKTOP →</span></button>
        <button type="button" class="ev2-card ${detected==='mobile'?'recommended':''}" data-env="mobile"><span class="ev2-icon">📱</span><h2>Mobile</h2><p>Touch-first layout, compact topology and terminal optimized for phone screens.</p><div class="ev2-tags"><span>TOUCH</span><span>COMPACT LAB</span><span>ONE COLUMN</span></div><span class="ev2-enter">ENTER MOBILE →</span></button>
      </div>
      <button type="button" class="ev2-auto" id="ev2-auto">Continue with detected environment</button>
      <div class="ev2-foot">One click · same URL · optimized presentation</div>
    </div>`;
  document.body.appendChild(root);

  let entered=false;
  const enter=(env)=>{
    if(entered)return;
    entered=true;
    try{sessionStorage.setItem(KEY,env)}catch{}
    document.documentElement.classList.remove('env-v2-active');
    root.remove();
    window.dispatchEvent(new CustomEvent('portfolio:environment',{detail:{environment:env}}));
  };
  root.querySelectorAll('[data-env]').forEach(card=>{
    card.onclick=()=>enter(card.getAttribute('data-env'));
    card.ontouchend=e=>{e.preventDefault();enter(card.getAttribute('data-env'))};
  });
  root.querySelector('#ev2-auto').onclick=()=>enter(detected);
})();
