(() => {
  const init = () => {
    const section = document.querySelector('#network-lab');
    if (!section || section.querySelector('.network-lab-visual')) return !!section;
    const head = section.querySelector('.section-head');
    if (!head) return false;
    const visual = document.createElement('div');
    visual.className = 'network-lab-visual';
    visual.innerHTML = `
      <div class="nlv-top"><span>NETWORK OPERATIONS / CONTROL ROOM</span><span class="nlv-live">● LIVE · SIMULATOR ONLINE</span></div>
      <div class="nlv-body">
        <svg viewBox="0 0 700 280" role="img" aria-label="Interactive network operations topology">
          <path class="nlv-link" d="M85 140 H265"/><path class="nlv-link" d="M265 140 H435"/><path class="nlv-link" d="M435 140 H615"/><path class="nlv-link" d="M265 140 V65 H435"/>
          <rect class="nlv-node" x="35" y="105" width="100" height="70" rx="15" data-device-node="mikrotik"/><text class="nlv-label" x="85" y="132">MIKROTIK</text><text class="nlv-sub" x="85" y="151">EDGE / WAN</text>
          <circle class="nlv-core" cx="350" cy="140" r="52" data-device-node="cisco"/><text class="nlv-label" x="350" y="136">CISCO CORE</text><text class="nlv-sub" x="350" y="155">OSPF · VLAN</text>
          <rect class="nlv-node" x="565" y="105" width="100" height="70" rx="15" data-device-node="fortigate"/><text class="nlv-label" x="615" y="132">FORTIGATE</text><text class="nlv-sub" x="615" y="151">POLICY / NAT</text>
          <rect class="nlv-node" x="290" y="28" width="120" height="52" rx="12"/><text class="nlv-label" x="350" y="50">DMZ / SERVER</text><text class="nlv-sub" x="350" y="66">10.20.20.0/24</text>
          <circle class="nlv-packet" cx="85" cy="140" r="4"/>
        </svg>
        <div class="nlv-side">
          <div class="nlv-card"><small>Forwarding</small><strong>OSPF / VLAN</strong><em>● Routing plane healthy</em></div>
          <div class="nlv-card"><small>Security</small><strong>Firewall / NAT</strong><em>● Policy engine ready</em></div>
          <div class="nlv-card"><small>Simulation</small><strong>Multi-Vendor CLI</strong><em>● Cisco · MikroTik · FortiGate</em></div>
          <div class="nlv-card"><small>Interaction</small><strong>Packet Routing</strong><em>● Choose · Configure · Verify</em></div>
        </div>
      </div>
      <div class="nlv-bottom"><span class="nlv-chip">IPv4</span><span class="nlv-chip">OSPF</span><span class="nlv-chip">VLAN</span><span class="nlv-chip">ACL</span><span class="nlv-chip">NAT</span><span class="nlv-chip">ROUTING</span><span class="nlv-chip">TROUBLESHOOTING</span><span class="nlv-chip">CLI</span></div>`;
    head.insertAdjacentElement('afterend', visual);

    const mapDevice = device => {
      visual.querySelectorAll('[data-device-node]').forEach(node => node.classList.toggle('active', node.dataset.deviceNode === device));
    };
    document.addEventListener('portfolio:device', e => mapDevice(e.detail?.device || null));
    return true;
  };
  let tries = 0;
  const timer = setInterval(() => { tries++; if (init() || tries > 80) clearInterval(timer); }, 120);
})();
