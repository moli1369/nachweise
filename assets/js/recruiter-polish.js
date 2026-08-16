(() => {
  const boot = () => {
    if (document.querySelector('.recruiter-scan')) return;
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const style = document.createElement('style');
    style.textContent = `
      .recruiter-scan{position:relative;margin:8px auto 0;display:grid;grid-template-columns:1.15fr 2.4fr 1fr;gap:10px;align-items:stretch;max-width:1180px;}
      .recruiter-intro,.recruiter-card,.recruiter-cta{border:1px solid rgba(180,215,240,.11);background:linear-gradient(145deg,rgba(9,24,38,.88),rgba(4,12,20,.94));border-radius:16px;box-shadow:0 18px 55px rgba(0,0,0,.18);}
      .recruiter-intro{padding:16px 17px;display:flex;flex-direction:column;justify-content:center;}
      .recruiter-kicker{color:#42c7ff;font:600 .5rem var(--mono);letter-spacing:.16em;text-transform:uppercase;}
      .recruiter-intro strong{margin-top:6px;color:#e7f4fb;font-size:1rem;letter-spacing:-.02em;}
      .recruiter-intro p{margin:5px 0 0;color:#718b9d;font-size:.64rem;line-height:1.45;}
      .recruiter-metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;}
      .recruiter-card{padding:13px 14px;min-width:0;transition:transform .2s,border-color .2s,background .2s;}
      .recruiter-card:hover{transform:translateY(-3px);border-color:rgba(66,199,255,.28);background:linear-gradient(145deg,rgba(12,31,47,.95),rgba(5,14,23,.95));}
      .recruiter-card .num{display:block;color:#eefaff;font:700 1.2rem/1 var(--mono);letter-spacing:-.03em;}
      .recruiter-card .label{display:block;margin-top:5px;color:#91abba;font:600 .51rem var(--mono);letter-spacing:.08em;text-transform:uppercase;}
      .recruiter-card .proof{display:block;margin-top:5px;color:#5f788a;font:500 .46rem/1.35 var(--mono);}
      .recruiter-cta{padding:12px;display:flex;flex-direction:column;justify-content:center;gap:8px;}
      .recruiter-cta .title{color:#dcecf4;font:600 .62rem var(--mono);letter-spacing:.05em;text-transform:uppercase;}
      .recruiter-cta .buttons{display:flex;gap:7px;flex-wrap:wrap;}
      .recruiter-cta a{display:inline-flex;align-items:center;justify-content:center;padding:7px 9px;border-radius:8px;border:1px solid rgba(66,199,255,.18);background:rgba(66,199,255,.05);color:#8ed9f5;font:600 .51rem var(--mono);text-decoration:none;}
      .recruiter-cta a:hover{border-color:rgba(66,199,255,.4);background:rgba(66,199,255,.09);}
      .recruiter-cta a.primary{color:#79edbc;border-color:rgba(121,237,188,.2);background:rgba(121,237,188,.045);}
      .recruiter-note{display:flex;align-items:center;gap:7px;margin-top:7px;color:#60798b;font:500 .47rem var(--mono);}
      .recruiter-note i{width:6px;height:6px;border-radius:50%;background:#79edbc;box-shadow:0 0 8px #79edbc;display:inline-block;}
      @media(max-width:1050px){.recruiter-scan{grid-template-columns:1fr 1fr}.recruiter-intro{grid-column:1/-1}.recruiter-cta{grid-column:1/-1}.recruiter-metrics{grid-template-columns:repeat(4,1fr)}}
      @media(max-width:700px){.recruiter-scan{grid-template-columns:1fr;margin-top:10px}.recruiter-metrics{grid-template-columns:1fr 1fr}.recruiter-intro,.recruiter-card,.recruiter-cta{border-radius:14px}.recruiter-card .num{font-size:1.05rem}.recruiter-cta{padding:14px}.recruiter-cta .buttons{display:grid;grid-template-columns:1fr 1fr}.recruiter-cta a{width:100%;box-sizing:border-box}.recruiter-note{font-size:.46rem;line-height:1.4}}
    `;
    document.head.appendChild(style);

    const section = document.createElement('section');
    section.className = 'recruiter-scan';
    section.setAttribute('aria-label','Recruiter quick scan');
    section.innerHTML = `
      <div class="recruiter-intro">
        <span class="recruiter-kicker">RECRUITER / 30-SECOND SCAN</span>
        <strong>Infrastructure that works in production.</strong>
        <p>Network · Servers · Virtualization · Security · Automation — backed by real operating experience.</p>
      </div>
      <div class="recruiter-metrics">
        <div class="recruiter-card"><span class="num">10+</span><span class="label">Years</span><span class="proof">network &amp; infrastructure operations</span></div>
        <div class="recruiter-card"><span class="num">~300</span><span class="label">Devices</span><span class="proof">Python-based incident remediation</span></div>
        <div class="recruiter-card"><span class="num">180 km</span><span class="label">Microwave</span><span class="proof">point-to-point production link</span></div>
        <div class="recruiter-card"><span class="num">3</span><span class="label">Hypervisors</span><span class="proof">Proxmox · VMware · Hyper-V</span></div>
      </div>
      <div class="recruiter-cta">
        <span class="title">Hiring signal</span>
        <div class="buttons">
          <a class="primary" href="assets/docs/Lebenslauf_Mohammad_Askari_Dehestani.pdf" download>DOWNLOAD CV ↘</a>
          <a href="#network-lab">OPEN NETWORK LAB ↗</a>
        </div>
        <div class="recruiter-note"><i></i><span>Open to IT Infrastructure / System Administration roles · Erlangen</span></div>
      </div>`;

    hero.insertAdjacentElement('afterend', section);

    document.querySelectorAll('.hero a[href="#projects"], .recruiter-cta a[href="#network-lab"]').forEach(a => {
      a.addEventListener('click', () => {
        const el = document.querySelector(a.getAttribute('href'));
        if (el) setTimeout(() => el.scrollIntoView({behavior:'smooth',block:'start'}), 20);
      });
    });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, {once:true});
  else boot();
})();
