(() => {
  const boot = () => {
    const lab = document.querySelector('#network-game');
    const map = lab?.querySelector('.game-map-body');
    const vendorLab = lab?.querySelector('.vendor-lab');
    if (!lab || !map || !vendorLab) return false;
    if (map.querySelector('.vendor-topology-overlay')) return true;

    const style = document.createElement('style');
    style.textContent = `
      .game-map-body{position:relative}
      .vendor-topology-overlay{position:absolute;inset:0;pointer-events:none;z-index:4}
      .vendor-focus-pill{position:absolute;left:12px;top:12px;display:flex;align-items:center;gap:8px;padding:6px 9px;border:1px solid rgba(66,199,255,.24);border-radius:9px;background:rgba(2,8,14,.82);backdrop-filter:blur(10px);color:#a8bfce;font:600 10px/1 var(--mono);letter-spacing:.06em;text-transform:uppercase;box-shadow:0 10px 30px rgba(0,0,0,.22)}
      .vendor-focus-pill i{width:7px;height:7px;border-radius:50%;background:var(--cyan);box-shadow:0 0 12px rgba(66,199,255,.8)}
      .vendor-focus-pill.config i{background:var(--green);box-shadow:0 0 12px rgba(111,229,174,.9)}
      .vendor-device-strip{position:absolute;right:12px;top:12px;display:flex;gap:6px;pointer-events:auto}
      .vendor-device-dot{border:1px solid rgba(180,215,240,.12);border-radius:8px;padding:5px 7px;background:rgba(2,8,14,.75);color:#6f879a;font:600 9px var(--mono);cursor:pointer}
      .vendor-device-dot.active{color:var(--cyan);border-color:rgba(66,199,255,.38);background:rgba(66,199,255,.08)}
      .vendor-device-dot.configuring{color:var(--green);border-color:rgba(111,229,174,.38);background:rgba(111,229,174,.08)}
      .vendor-focus-label{position:absolute;bottom:12px;left:50%;transform:translateX(-50%);padding:6px 10px;border:1px solid rgba(66,199,255,.18);border-radius:9px;background:rgba(2,8,14,.82);color:#8ea7b7;font:500 9px var(--mono);white-space:nowrap;opacity:0;transition:opacity .2s,transform .2s}
      .vendor-focus-label.show{opacity:1;transform:translateX(-50%) translateY(-2px)}
      .vendor-focus-label b{color:#dceef7}
      .vendor-node-halo{position:absolute;width:72px;height:72px;border-radius:50%;border:1px solid rgba(66,199,255,.3);box-shadow:0 0 0 8px rgba(66,199,255,.04),0 0 26px rgba(66,199,255,.18);opacity:0;transition:opacity .2s;transform:translate(-50%,-50%)}
      .vendor-node-halo.show{opacity:1}.vendor-node-halo.config{border-color:rgba(111,229,174,.6);box-shadow:0 0 0 8px rgba(111,229,174,.05),0 0 30px rgba(111,229,174,.2)}
      @media(max-width:600px){.vendor-focus-pill{font-size:8px;top:8px;left:8px}.vendor-device-strip{top:8px;right:8px}.vendor-device-dot{font-size:8px;padding:4px 5px}.vendor-focus-label{font-size:8px;bottom:8px}}
    `;
    document.head.appendChild(style);

    const overlay = document.createElement('div');
    overlay.className = 'vendor-topology-overlay';
    overlay.innerHTML = `
      <div class="vendor-focus-pill"><i></i><span data-focus-status>ACTIVE DEVICE</span></div>
      <div class="vendor-device-strip">
        <button class="vendor-device-dot active" data-focus="cisco" type="button">CISCO</button>
        <button class="vendor-device-dot" data-focus="mikrotik" type="button">MIKROTIK</button>
        <button class="vendor-device-dot" data-focus="fortigate" type="button">FORTIGATE</button>
      </div>
      <div class="vendor-node-halo" data-halo="cisco"></div>
      <div class="vendor-node-halo" data-halo="mikrotik"></div>
      <div class="vendor-node-halo" data-halo="fortigate"></div>
      <div class="vendor-focus-label" data-focus-label>Session: <b>CORE-R1 · Cisco IOS</b></div>
    `;
    map.appendChild(overlay);

    const mapRect = () => map.getBoundingClientRect();
    const place = () => {
      const r = mapRect();
      const points = {
        mikrotik: { x: r.width * .22, y: r.height * .55 },
        cisco: { x: r.width * .50, y: r.height * .50 },
        fortigate: { x: r.width * .78, y: r.height * .55 }
      };
      Object.entries(points).forEach(([key,p])=>{
        const el = overlay.querySelector(`[data-halo="${key}"]`);
        if (el) { el.style.left = `${p.x}px`; el.style.top = `${p.y}px`; }
      });
    };

    const names = {
      cisco: {active:'CISCO CORE', label:'CORE-R1 · Cisco IOS', config:'CONFIGURING · CISCO CORE'},
      mikrotik: {active:'MIKROTIK EDGE', label:'MT-EDGE · RouterOS', config:'CONFIGURING · MIKROTIK EDGE'},
      fortigate: {active:'FORTIGATE SECURITY', label:'FG-EDGE · FortiOS', config:'CONFIGURING · FORTIGATE SECURITY'}
    };

    const setDevice = (vendor, configuring=false) => {
      overlay.querySelectorAll('.vendor-device-dot').forEach(b=>b.classList.toggle('active',b.dataset.focus===vendor));
      overlay.querySelectorAll('.vendor-node-halo').forEach(h=>{
        h.classList.toggle('show', h.dataset.halo===vendor);
        h.classList.toggle('config', h.dataset.halo===vendor && configuring);
      });
      const pill = overlay.querySelector('.vendor-focus-pill');
      pill.classList.toggle('config', configuring);
      overlay.querySelector('[data-focus-status]').textContent = configuring ? names[vendor].config : names[vendor].active;
      const label = overlay.querySelector('[data-focus-label]');
      label.classList.add('show');
      label.innerHTML = `Session: <b>${configuring ? names[vendor].config : names[vendor].label}</b>`;
    };

    const syncFromTab = (vendor) => setDevice(vendor, false);
    overlay.querySelectorAll('[data-focus]').forEach(btn => btn.addEventListener('click', () => {
      const target = vendorLab.querySelector(`.vendor-tab[data-vendor="${btn.dataset.focus}"]`);
      target?.click();
    }));

    vendorLab.querySelectorAll('.vendor-tab').forEach(btn => btn.addEventListener('click', () => {
      syncFromTab(btn.dataset.vendor);
      overlay.querySelector('[data-focus-label]').classList.add('show');
    }));

    const input = vendorLab.querySelector('#vendor-input');
    const prompt = vendorLab.querySelector('#vendor-prompt');
    let activeVendor = 'cisco';
    const observer = new MutationObserver(() => {
      const p = prompt?.textContent || '';
      if (p.includes('config') || p.includes('(config')) setDevice(activeVendor, true);
      else setDevice(activeVendor, false);
    });
    if (prompt) observer.observe(prompt, {childList:true,subtree:true,characterData:true});

    vendorLab.querySelectorAll('.vendor-tab').forEach(btn => btn.addEventListener('click', () => { activeVendor = btn.dataset.vendor; }));
    window.addEventListener('resize', place);
    place();
    setDevice('cisco', false);
    return true;
  };

  let tries = 0;
  const timer = setInterval(() => { if (boot() || ++tries > 80) clearInterval(timer); }, 150);
})();
