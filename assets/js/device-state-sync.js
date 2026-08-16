(() => {
  const start = () => {
    const lab = document.querySelector('#network-game');
    const visual = document.querySelector('.hero-visual');
    if (!lab || !visual) return false;

    const getTabs = () => [...lab.querySelectorAll('.vendor-tab')];
    if (!getTabs().length) return false;

    if (!visual.querySelector('.device-state-strip')) {
      const strip = document.createElement('div');
      strip.className = 'device-state-strip';
      strip.innerHTML = `
        <div class="device-state-head"><span>ACTIVE DEVICE</span><strong id="active-device-name">Cisco IOS · CORE-R1</strong><em id="active-device-mode">READY</em></div>
        <div class="device-state-nodes" role="tablist" aria-label="Network devices">
          <button type="button" data-device="cisco" role="tab"><span class="device-led"></span><b>CISCO</b><small>CORE-R1 · IOS</small></button>
          <button type="button" data-device="mikrotik" role="tab"><span class="device-led"></span><b>MIKROTIK</b><small>MT-EDGE · RouterOS</small></button>
          <button type="button" data-device="fortigate" role="tab"><span class="device-led"></span><b>FORTIGATE</b><small>FG-EDGE · FortiOS</small></button>
        </div>`;
      const tags = visual.querySelector('.visual-tags');
      tags ? visual.appendChild(strip) : visual.appendChild(strip);

      const style = document.createElement('style');
      style.textContent = `
        .device-state-strip{padding:.7rem .8rem;border-top:1px solid var(--line);background:rgba(2,9,15,.9)}
        .device-state-head{display:flex;align-items:center;gap:.55rem;color:#5f788a;font:500 .52rem var(--mono);letter-spacing:.08em;text-transform:uppercase}
        .device-state-head strong{color:#d9edf7;letter-spacing:0;text-transform:none;font-size:.62rem}
        .device-state-head em{margin-left:auto;color:var(--green);font-style:normal;font-size:.5rem}
        .device-state-nodes{display:grid;grid-template-columns:repeat(3,1fr);gap:.4rem;margin-top:.5rem}
        .device-state-nodes button{display:grid;grid-template-columns:auto 1fr;grid-template-rows:auto auto;column-gap:.4rem;align-items:center;text-align:left;padding:.42rem .48rem;border:1px solid var(--line);border-radius:8px;background:rgba(255,255,255,.015);color:#94aab9;cursor:pointer}
        .device-state-nodes button:hover{border-color:rgba(66,199,255,.3)}
        .device-state-nodes button.active{border-color:rgba(66,199,255,.58);background:rgba(66,199,255,.08);box-shadow:0 0 20px rgba(66,199,255,.08)}
        .device-state-nodes b{font:600 .52rem var(--mono);color:#d7e8f1;letter-spacing:.06em}
        .device-state-nodes small{grid-column:2;color:#5f788a;font:500 .46rem var(--mono)}
        .device-led{grid-row:1/3;width:6px;height:6px;border-radius:50%;background:#456071;box-shadow:none}
        .device-state-nodes button.active .device-led{background:var(--green);box-shadow:0 0 10px rgba(111,229,174,.8)}
        .device-state-strip.configuring #active-device-mode{color:#ffb478;animation:devicePulse 1s ease-in-out infinite}
        @keyframes devicePulse{50%{opacity:.45}}
        .hero-device-focus{outline:1px solid rgba(66,199,255,.2);outline-offset:3px;filter:drop-shadow(0 0 14px rgba(66,199,255,.15))}
        @media(max-width:600px){.device-state-head{flex-wrap:wrap}.device-state-head em{margin-left:0}.device-state-nodes{grid-template-columns:1fr}.device-state-nodes button{grid-template-columns:auto 1fr}}
      `;
      document.head.appendChild(style);
    }

    const strip = visual.querySelector('.device-state-strip');
    const name = strip.querySelector('#active-device-name');
    const mode = strip.querySelector('#active-device-mode');
    const nodeButtons = [...strip.querySelectorAll('[data-device]')];
    const deviceInfo = {
      cisco: { name:'Cisco IOS · CORE-R1', focus:'core', label:'CORE / OSPF' },
      mikrotik: { name:'MikroTik RouterOS · MT-EDGE', focus:'edge', label:'EDGE / WAN' },
      fortigate: { name:'FortiGate · FG-EDGE', focus:'security', label:'SECURITY / POLICY' }
    };

    const heroNodes = {
      core: visual.querySelector('.noc-core'),
      edge: visual.querySelectorAll('.noc-node')[0],
      security: visual.querySelectorAll('.noc-node')[1]
    };

    const setActive = vendor => {
      const info = deviceInfo[vendor] || deviceInfo.cisco;
      name.textContent = info.name;
      mode.textContent = 'READY';
      strip.classList.remove('configuring');
      nodeButtons.forEach(btn => {
        const active = btn.dataset.device === vendor;
        btn.classList.toggle('active', active);
        btn.setAttribute('aria-selected', String(active));
      });
      Object.values(heroNodes).forEach(node => node?.classList.remove('hero-device-focus'));
      heroNodes[info.focus]?.classList.add('hero-device-focus');
    };

    const activateTab = vendor => {
      const btn = lab.querySelector(`.vendor-tab[data-vendor="${vendor}"]`);
      if (btn) btn.click();
      setActive(vendor);
      requestAnimationFrame(() => lab.querySelector('#vendor-input')?.focus());
    };

    nodeButtons.forEach(btn => btn.addEventListener('click', () => activateTab(btn.dataset.device)));
    getTabs().forEach(tab => tab.addEventListener('click', () => setActive(tab.dataset.vendor)));

    const input = lab.querySelector('#vendor-input');
    const prompt = lab.querySelector('#vendor-prompt');
    if (input) {
      input.addEventListener('input', () => {
        const value = input.value.trim().toLowerCase();
        const vendor = lab.querySelector('.vendor-tab.active')?.dataset.vendor || 'cisco';
        const configuring = value === 'configure terminal' || value === 'conf t' || value.startsWith('config ') || value.startsWith('interface ') || value.startsWith('vlan ') || value.startsWith('/interface ') || value.startsWith('/ip route add ') || value.startsWith('set ') || value.startsWith('edit ');
        strip.classList.toggle('configuring', configuring);
        mode.textContent = configuring ? `CONFIGURING · ${deviceInfo[vendor].label}` : 'READY';
      });
    }

    if (prompt) {
      const observer = new MutationObserver(() => {
        const vendor = lab.querySelector('.vendor-tab.active')?.dataset.vendor || 'cisco';
        const p = prompt.textContent || '';
        const configuring = /config|\(config\)|\(global\)|\(.*\)#/i.test(p) || /\[.*@.*\].*=/i.test(p) && !/>\s*$/.test(p);
        strip.classList.toggle('configuring', configuring);
        mode.textContent = configuring ? `CONFIGURING · ${deviceInfo[vendor].label}` : 'READY';
      });
      observer.observe(prompt, { childList:true, characterData:true, subtree:true });
    }

    setActive(lab.querySelector('.vendor-tab.active')?.dataset.vendor || 'cisco');
    return true;
  };

  let tries = 0;
  const timer = setInterval(() => {
    tries++;
    if (start() || tries > 80) clearInterval(timer);
  }, 150);
})();
