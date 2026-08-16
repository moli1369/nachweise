(() => {
  const init = () => {
    const section = document.querySelector('#network-lab');
    if (!section || section.querySelector('.lab-command-center')) return false;
    const head = section.querySelector('.section-head');
    if (!head) return false;
    head.innerHTML = `
      <div class="lab-command-center">
        <div class="lab-headline">
          <div class="kicker">03 / NETWORK OPERATIONS LAB</div>
          <h2>Think. Route. <span>Operate.</span></h2>
          <p>Ein interaktives Network Operations Lab, in dem Routing, VLAN, Firewall-Policy und CLI-Zugriff nicht nur gezeigt, sondern ausprobiert werden.</p>
          <div class="lab-badges"><span>IPv4</span><span>OSPF</span><span>VLAN</span><span>ACL</span><span>NAT</span><span>CLI</span><span>TROUBLESHOOTING</span></div>
        </div>
        <div class="lab-network" aria-label="Live network operations topology">
          <div class="lab-network-grid"></div>
          <svg viewBox="0 0 700 230" aria-hidden="true">
            <path class="lab-wire flow" d="M92 115H265"/>
            <path class="lab-wire flow" d="M265 115H435" style="animation-delay:.5s"/>
            <path class="lab-wire flow" d="M435 115H608" style="animation-delay:1s"/>
            <g class="lab-node">
              <rect x="25" y="78" width="135" height="74" rx="14"/>
              <text x="92" y="107">MIKROTIK</text><text class="muted" x="92" y="123">EDGE / ROUTEROS</text>
            </g>
            <g class="lab-node core">
              <circle cx="350" cy="115" r="52"/><text x="350" y="109">CISCO CORE</text><text class="muted" x="350" y="125">OSPF / VLAN</text>
            </g>
            <g class="lab-node sec">
              <rect x="540" y="78" width="135" height="74" rx="14"/>
              <text x="607" y="107">FORTIGATE</text><text class="muted" x="607" y="123">SECURITY / POLICY</text>
            </g>
            <circle class="lab-packet" cx="135" cy="115" r="4"/>
          </svg>
          <div class="lab-network-caption"><span>PACKET FLOW / LIVE</span><span>EDGE → CORE → SECURITY</span></div>
        </div>
        <div class="lab-status-grid">
          <div class="lab-status-card"><small>Network state</small><strong>OPERATIONAL</strong><em>● OSPF / LAN / WAN</em></div>
          <div class="lab-status-card"><small>Security state</small><strong>HARDENED</strong><em>● ACL / NAT / POLICY</em></div>
          <div class="lab-status-card"><small>Simulation</small><strong>INTERACTIVE</strong><em>● COMMANDS / SCENARIOS</em></div>
          <div class="lab-status-card"><small>Monitoring</small><strong>HEALTHY</strong><em>● PRTG / ZABBIX</em></div>
          <div class="lab-status-card wide"><div><small>Device sessions</small><strong>Cisco · MikroTik · FortiGate</strong></div><span class="lab-open">CLI READY</span></div>
        </div>
      </div>`;
    return true;
  };
  let tries = 0;
  const timer = setInterval(() => { tries += 1; if (init() || tries > 60) clearInterval(timer); }, 100);
})();