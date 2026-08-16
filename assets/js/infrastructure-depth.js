(() => {
  const boot=()=>{
    if(document.querySelector('.infra-depth')) return;
    const anchor=document.querySelector('.recruiter-scan') || document.querySelector('#profile');
    const projects=document.querySelector('#projects');
    if(!anchor) return;
    const section=document.createElement('section');
    section.className='infra-depth wrap';
    section.setAttribute('aria-label','Infrastructure depth');
    section.innerHTML=`
      <div class="infra-depth-shell">
        <div class="infra-depth-head">
          <div><div class="infra-depth-kicker">ENGINEERING DEPTH / PRODUCTION SKILLS</div><h2 class="infra-depth-title">Beyond configuration. I build, automate and operate infrastructure.</h2><p class="infra-depth-copy">Network scripting, routing automation and production virtualization — including Proxmox clusters with Ceph and HA.</p></div>
          <div class="infra-depth-status">● HANDS-ON</div>
        </div>
        <div class="infra-depth-grid">
          <article class="infra-skill"><span class="infra-skill-badge">01</span><h3>Network Automation</h3><p>Automation for repetitive network operations, monitoring and incident remediation.</p><div class="infra-chips"><span>Python</span><span>SSH</span><span>APIs</span><span>Bulk Ops</span></div></article>
          <article class="infra-skill"><span class="infra-skill-badge">02</span><h3>Cisco / MikroTik Scripting</h3><p>Scripted configuration, diagnostics and device maintenance across vendor CLI environments.</p><div class="infra-chips"><span>Cisco IOS</span><span>RouterOS</span><span>Routing</span><span>Firewall</span></div></article>
          <article class="infra-skill"><span class="infra-skill-badge">03</span><h3>Proxmox · Ceph · HA</h3><p>Clustered virtualization with distributed storage and high-availability service design.</p><div class="infra-chips"><span>Proxmox VE</span><span>Ceph</span><span>HA</span><span>Cluster</span></div></article>
          <article class="infra-skill"><span class="infra-skill-badge">04</span><h3>Python Engineering</h3><p>Practical automation and backend tooling for infrastructure, APIs and operational workflows.</p><div class="infra-chips"><span>Python</span><span>FastAPI</span><span>Django</span><span>REST</span></div></article>
        </div>
        <div class="infra-depth-bottom">
          <div class="infra-flow"><div class="infra-flow-head"><span>AUTOMATION / DEVICE CONTROL</span><span>SSH · API · CLI</span></div><svg class="infra-flow-svg" viewBox="0 0 700 150" aria-hidden="true"><path class="infra-line" d="M80 75H250M250 75H430M430 75H620"/><path class="infra-line flow" d="M80 75H250M250 75H430M430 75H620"/><g class="infra-node"><rect x="30" y="48" width="105" height="54" rx="12"/><text x="82" y="70">PYTHON</text><text x="82" y="85" class="sub">AUTOMATION</text></g><g class="infra-node"><circle cx="340" cy="75" r="29"/><text x="340" y="72">CONTROL</text><text x="340" y="85" class="sub">ORCHESTRATION</text></g><g class="infra-node"><rect x="560" y="48" width="105" height="54" rx="12"/><text x="612" y="70">NETWORK</text><text x="612" y="85" class="sub">CISCO · MTK · FGT</text></g><circle cx="125" cy="75" r="4" fill="#fff" style="filter:drop-shadow(0 0 6px rgba(255,255,255,.9));animation:infraPacket 3.5s linear infinite"/></svg></div>
          <div class="infra-cluster"><div class="infra-cluster-head"><span>PROXMOX / STORAGE FABRIC</span><span>HA READY</span></div><div class="cluster-grid"><div class="cluster-node"><strong>PVE-01</strong><span>Compute · VM / CT</span></div><div class="cluster-node"><strong>PVE-02</strong><span>Compute · HA member</span></div><div class="cluster-node"><strong>PVE-03</strong><span>Compute · HA member</span></div></div><div class="cluster-bar"><i></i></div><div class="cluster-note">Ceph distributed storage · quorum-aware cluster · service failover</div></div>
        </div>
      </div>`;
    if(projects) projects.insertAdjacentElement('beforebegin',section); else anchor.insertAdjacentElement('afterend',section);
    const style=document.createElement('style'); style.textContent='@keyframes infraPacket{0%{transform:translateX(0)}45%{transform:translateX(215px)}100%{transform:translateX(490px)}}'; document.head.appendChild(style);
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true}); else boot();
})();
