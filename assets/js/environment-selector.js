(() => {
  const storageKey = 'portfolio-environment';
  if (sessionStorage.getItem(storageKey)) return;

  const style = document.createElement('style');
  style.textContent = `
    body.environment-lock > *:not(#environment-selector){visibility:hidden}
    #environment-selector{position:fixed;inset:0;z-index:9999;display:grid;place-items:center;overflow:auto;padding:24px;background:radial-gradient(circle at 50% 35%,rgba(66,199,255,.12),transparent 34%),linear-gradient(180deg,#030a12,#06111c);color:#edf7ff;font-family:var(--sans,system-ui,sans-serif)}
    .env-grid{position:absolute;inset:0;opacity:.28;background-image:linear-gradient(rgba(120,200,240,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(120,200,240,.035) 1px,transparent 1px);background-size:44px 44px}
    .env-shell{position:relative;width:min(980px,100%);display:grid;gap:22px}
    .env-head{text-align:center}.env-mark{display:inline-grid;place-items:center;width:52px;height:52px;border:1px solid rgba(66,199,255,.32);border-radius:15px;background:rgba(66,199,255,.06);color:#42c7ff;font:600 .8rem var(--mono,monospace);box-shadow:0 0 28px rgba(66,199,255,.12)}
    .env-kicker{margin:18px 0 8px;color:#42c7ff;font:500 .64rem var(--mono,monospace);letter-spacing:.18em;text-transform:uppercase}.env-head h1{margin:0;font-size:clamp(2rem,5vw,4.6rem);line-height:.96;letter-spacing:-.055em}.env-head p{max-width:650px;margin:14px auto 0;color:#8fa7bb;font-size:.95rem}
    .env-recommend{justify-self:center;padding:7px 11px;border:1px solid rgba(111,229,174,.18);border-radius:999px;background:rgba(111,229,174,.045);color:#79edbc;font:500 .58rem var(--mono,monospace)}
    .env-cards{display:grid;grid-template-columns:1fr 1fr;gap:14px}.env-card{position:relative;min-height:290px;padding:24px;border:1px solid rgba(180,215,240,.12);border-radius:22px;background:linear-gradient(145deg,rgba(13,30,46,.9),rgba(6,17,28,.95));cursor:pointer;transition:transform .25s,border-color .25s,box-shadow .25s}.env-card:hover{transform:translateY(-5px);border-color:rgba(66,199,255,.42);box-shadow:0 30px 90px rgba(0,0,0,.28)}.env-card.recommended{border-color:rgba(111,229,174,.28)}
    .env-icon{display:grid;place-items:center;width:58px;height:58px;border-radius:16px;background:rgba(66,199,255,.07);border:1px solid rgba(66,199,255,.15);font-size:1.5rem}.env-card h2{margin:20px 0 7px;font-size:1.45rem;letter-spacing:-.025em}.env-card p{margin:0;color:#8fa7bb;font-size:.82rem;line-height:1.55}.env-tags{display:flex;flex-wrap:wrap;gap:7px;margin-top:18px}.env-tags span{padding:5px 7px;border:1px solid rgba(180,215,240,.1);border-radius:7px;color:#91afc1;font:500 .54rem var(--mono,monospace)}.env-enter{position:absolute;right:22px;bottom:22px;color:#42c7ff;font:600 .65rem var(--mono,monospace)}.env-auto{margin-top:4px;justify-self:center;border:1px solid rgba(180,215,240,.14);border-radius:12px;background:rgba(255,255,255,.02);color:#9db2c0;padding:9px 13px;font:500 .56rem var(--mono,monospace);cursor:pointer}.env-auto:hover{border-color:rgba(66,199,255,.32);color:#42c7ff}.env-foot{text-align:center;color:#536d80;font:500 .52rem var(--mono,monospace)}
    .env-card[data-env="mobile"] .env-icon{background:rgba(121,237,188,.065);border-color:rgba(121,237,188,.16)}
    @media(max-width:700px){#environment-selector{padding:18px}.env-cards{grid-template-columns:1fr}.env-card{min-height:220px;padding:20px}.env-card h2{margin-top:16px}.env-head p{font-size:.86rem}.env-shell{gap:16px}}
    @media(prefers-reduced-motion:reduce){.env-card{transition:none}}
  `;
  document.head.appendChild(style);
  document.body.classList.add('environment-lock');

  const root = document.createElement('div');
  root.id = 'environment-selector';
  root.innerHTML = `
    <div class="env-grid" aria-hidden="true"></div>
    <div class="env-shell">
      <header class="env-head">
        <div class="env-mark">MA</div>
        <div class="env-kicker">SYSTEM INITIALIZATION</div>
        <h1>Choose your environment</h1>
        <p>Select the interface that matches your device. Both environments lead to the same IT portfolio and Network Operations Lab.</p>
        <div class="env-recommend" id="env-recommend">Detecting device…</div>
      </header>
      <div class="env-cards">
        <button class="env-card" type="button" data-env="desktop">
          <div class="env-icon" aria-hidden="true">🖥</div>
          <h2>Desktop / Laptop</h2>
          <p>Full-width command center, expanded Network Lab, richer topology and comfortable multi-column browsing.</p>
          <div class="env-tags"><span>FULL LAB</span><span>WIDE TOPOLOGY</span><span>MULTI-COLUMN</span><span>KEYBOARD</span></div>
          <span class="env-enter">ENTER DESKTOP →</span>
        </button>
        <button class="env-card" type="button" data-env="mobile">
          <div class="env-icon" aria-hidden="true">📱</div>
          <h2>Mobile</h2>
          <p>Touch-first layout, compact topology, focused projects and a terminal sized for phone screens.</p>
          <div class="env-tags"><span>TOUCH FIRST</span><span>COMPACT LAB</span><span>ONE COLUMN</span><span>PHONE</span></div>
          <span class="env-enter">ENTER MOBILE →</span>
        </button>
      </div>
      <button class="env-auto" id="env-auto" type="button">Continue with detected environment</button>
      <div class="env-foot">The selected environment is remembered for this browser session.</div>
    </div>
  `;
  document.body.appendChild(root);

  const detected = matchMedia('(max-width: 700px)').matches || /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) ? 'mobile' : 'desktop';
  const recommend = root.querySelector('#env-recommend');
  recommend.textContent = detected === 'mobile' ? 'Detected: MOBILE DEVICE' : 'Detected: DESKTOP / LAPTOP';
  root.querySelector(`[data-env="${detected}"]`)?.classList.add('recommended');

  const enter = env => {
    sessionStorage.setItem(storageKey, env);
    root.style.opacity = '0';
    root.style.transition = 'opacity .28s ease';
    setTimeout(() => { document.body.classList.remove('environment-lock'); root.remove(); window.dispatchEvent(new CustomEvent('portfolio:environment', {detail:{environment:env}})); }, 280);
  };
  root.querySelectorAll('[data-env]').forEach(card => card.addEventListener('click', () => enter(card.dataset.env)));
  root.querySelector('#env-auto').addEventListener('click', () => enter(detected));
})();
