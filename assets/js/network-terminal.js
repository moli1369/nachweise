(() => {
  const lab = document.querySelector('#network-game');
  if (!lab || document.querySelector('#router-cli')) return;

  const style = document.createElement('style');
  style.textContent = `
    .router-console{margin-top:.85rem;border:1px solid rgba(66,199,255,.16);border-radius:16px;overflow:hidden;background:#02070c;box-shadow:inset 0 1px rgba(255,255,255,.03),0 20px 70px rgba(0,0,0,.22)}
    .vendor-bar{display:flex;gap:.45rem;flex-wrap:wrap;padding:.7rem .8rem;border-bottom:1px solid var(--line);background:rgba(255,255,255,.018)}
    .vendor-btn{border:1px solid var(--line);border-radius:8px;background:rgba(255,255,255,.02);color:#7f98aa;padding:.45rem .6rem;font:600 .58rem var(--mono);cursor:pointer;transition:.18s}
    .vendor-btn:hover{color:var(--cyan);border-color:rgba(66,199,255,.32);transform:translateY(-1px)}
    .vendor-btn.active{color:#06101b;background:linear-gradient(135deg,#45c9ff,#70e9b5);border-color:transparent}
    .router-console-head{display:flex;justify-content:space-between;gap:1rem;align-items:center;padding:.78rem .9rem;border-bottom:1px solid var(--line);background:linear-gradient(90deg,rgba(66,199,255,.07),transparent);font:500 .58rem var(--mono);color:#7e96a8}
    .router-console-head>div:first-child{display:grid;grid-template-columns:auto 1fr;column-gap:.55rem;align-items:center}.router-console-head strong{color:#b8cad8;letter-spacing:.1em}.router-console-head small{grid-column:2;color:#587387;font-size:.5rem;margin-top:.12rem}.cli-dot{width:8px;height:8px;border-radius:50%;background:var(--green);box-shadow:0 0 12px rgba(111,229,174,.65)}.cli-device{display:flex;gap:.45rem;align-items:center}.cli-device span{padding:.28rem .45rem;border:1px solid var(--line);border-radius:6px}.cli-device .device-active{color:var(--cyan);border-color:rgba(66,199,255,.18)}
    .router-cli-screen{height:270px;overflow:auto;padding:1rem;background:radial-gradient(circle at 25% 10%,rgba(66,199,255,.045),transparent 30%),#02070c;color:#bacbd8;font:500 .68rem/1.65 var(--mono);white-space:pre-wrap}.cli-line{margin:.08rem 0}.cli-cmd{color:#c8e9fb}.cli-prompt{color:var(--cyan)}.cli-output{color:#91a6b6}.cli-ok{color:#79edbc}.cli-warn{color:#ffb37b}.cli-error{color:#ff8894}.cli-info{color:#82bfe0}
    .router-cli-form{display:flex;align-items:center;gap:.55rem;border-top:1px solid var(--line);padding:.65rem .75rem;background:#03090f}.router-prompt{color:var(--cyan);font:600 .68rem var(--mono);white-space:nowrap}.router-cli-form input{min-width:0;flex:1;border:0;outline:0;background:transparent;color:#ecf7ff;font:500 .68rem var(--mono)}.router-cli-form input::placeholder{color:#405869}.router-cli-form button{border:1px solid rgba(66,199,255,.22);border-radius:7px;padding:.38rem .58rem;background:rgba(66,199,255,.06);color:var(--cyan);font:600 .58rem var(--mono);cursor:pointer}
    .router-cli-help{display:flex;gap:.35rem;flex-wrap:wrap;align-items:center;padding:.55rem .75rem;border-top:1px solid var(--line);color:#587184;font:500 .52rem var(--mono)}.router-cli-help button{border:1px solid var(--line);border-radius:6px;background:rgba(255,255,255,.02);color:#8ba4b5;padding:.28rem .4rem;font:500 .52rem var(--mono);cursor:pointer}.router-cli-help button:hover{border-color:rgba(66,199,255,.3);color:var(--cyan)}.router-cli-help .tip{opacity:.7;margin-left:.15rem}
    .hero-command{position:relative;display:block;width:100%;height:100%}.hero-command .hc-frame{fill:rgba(8,20,33,.95);stroke:rgba(150,205,240,.14);stroke-width:1}.hero-command .hc-panel{fill:#07121e;stroke:rgba(66,199,255,.15);stroke-width:1}.hero-command .hc-line{stroke:rgba(66,199,255,.15);stroke-width:1;fill:none}.hero-command .hc-line.active{stroke:rgba(66,199,255,.7);stroke-width:1.4;stroke-dasharray:2 7;animation:hc-flow 2.4s linear infinite}.hero-command .hc-node{fill:#0b1a29;stroke:rgba(66,199,255,.3);stroke-width:1}.hero-command .hc-node.core{fill:#10263a;stroke:rgba(66,199,255,.7)}.hero-command text{font-family:var(--mono);fill:#d9edf8}.hero-command .muted{fill:#668195}.hero-command .small{font-size:8px}.hero-command .label{font-size:10px;font-weight:600;letter-spacing:.08em}.hero-command .packet{fill:#fff;filter:drop-shadow(0 0 4px rgba(255,255,255,.9));animation:hc-pulse 1.4s ease-in-out infinite}@keyframes hc-flow{to{stroke-dashoffset:-54}}@keyframes hc-pulse{50%{r:2.6}}
    @media(max-width:600px){.router-console-head{align-items:flex-start;flex-direction:column}.cli-device{align-self:flex-start}.router-cli-screen{height:235px;font-size:.61rem}.router-prompt{font-size:.61rem}.router-cli-form input{font-size:.61rem}.hero-command{height:300px}}
  `;
  document.head.appendChild(style);

  // Replace the busy hero graphic with a compact command-center visualization.
  const heroVisual = document.querySelector('.hero-visual');
  if (heroVisual) {
    heroVisual.innerHTML = `
      <div class="visual-head"><span><i></i><i></i><i></i></span><b>NOC / COMMAND CENTER</b><em>ONLINE</em></div>
      <div class="hero-command">
        <svg viewBox="0 0 760 430" role="img" aria-label="Minimal network operations command center">
          <rect class="hc-frame" x="0" y="0" width="760" height="430" rx="0"/>
          <rect class="hc-panel" x="24" y="24" width="712" height="382" rx="18"/>
          <path class="hc-line" d="M126 118 L300 214 L126 310 M634 118 L460 214 L634 310"/>
          <path class="hc-line active" d="M126 118 L300 214 L126 310"/>
          <path class="hc-line active" d="M634 310 L460 214 L634 118" style="animation-delay:.8s"/>
          <circle class="hc-node" cx="126" cy="118" r="38"/><text x="126" y="116" text-anchor="middle" class="label">EDGE</text><text x="126" y="132" text-anchor="middle" class="small muted">MIKROTIK</text>
          <circle class="hc-node" cx="126" cy="310" r="38"/><text x="126" y="308" text-anchor="middle" class="label">CORE</text><text x="126" y="324" text-anchor="middle" class="small muted">CISCO</text>
          <circle class="hc-node core" cx="380" cy="214" r="58"/><circle cx="380" cy="214" r="74" fill="none" stroke="rgba(66,199,255,.1)" stroke-width="8"/><text x="380" y="210" text-anchor="middle" class="label">NETWORK</text><text x="380" y="228" text-anchor="middle" class="small muted">OSPF · VLAN · VPN</text>
          <circle class="hc-node" cx="634" cy="118" r="38"/><text x="634" y="116" text-anchor="middle" class="label">SEC</text><text x="634" y="132" text-anchor="middle" class="small muted">FORTIGATE</text>
          <circle class="hc-node" cx="634" cy="310" r="38"/><text x="634" y="308" text-anchor="middle" class="label">VIRT</text><text x="634" y="324" text-anchor="middle" class="small muted">PROXMOX</text>
          <circle class="packet" cx="195" cy="157" r="2.2"/><circle class="packet" cx="565" cy="270" r="2.2" style="animation-delay:.35s"/>
          <g transform="translate(54 45)"><rect x="0" y="0" width="120" height="30" rx="8" fill="rgba(255,255,255,.03)" stroke="rgba(255,255,255,.08)"/><text x="12" y="19" class="small muted">PACKET FLOW</text><circle cx="103" cy="15" r="4" fill="#6fe5ae"/></g>
          <g transform="translate(500 355)"><text x="0" y="0" class="small muted">LATENCY</text><text x="56" y="0" class="small">1.8 ms</text><text x="128" y="0" class="small muted">UPTIME</text><text x="174" y="0" class="small">99.98%</text></g>
        </svg>
      </div>`;
  }

  const wrap = document.createElement('section');
  wrap.className='router-console'; wrap.id='router-cli';
  wrap.innerHTML=`<div class="vendor-bar"><button class="vendor-btn active" type="button" data-vendor="cisco">Cisco IOS</button><button class="vendor-btn" type="button" data-vendor="mikrotik">MikroTik RouterOS</button><button class="vendor-btn" type="button" data-vendor="fortigate">FortiGate CLI</button></div>
    <div class="router-console-head"><div><span class="cli-dot"></span><strong id="cli-title">CISCO IOS LAB</strong><small id="cli-subtitle">Routing · VLAN · OSPF · ACL · troubleshooting</small></div><div class="cli-device"><span class="device-active" id="cli-device-name">CORE-R1</span><span id="cli-device-ip">10.10.10.1</span></div></div>
    <div class="router-cli-screen" id="router-cli-screen" role="log" aria-live="polite"></div>
    <form class="router-cli-form" id="router-cli-form"><span class="router-prompt" id="router-prompt">CORE-R1#</span><input id="router-cli-input" autocomplete="off" autocapitalize="none" spellcheck="false" aria-label="Network CLI command" placeholder="Type a command … e.g. show ip route"><button type="submit">RUN</button></form>
    <div class="router-cli-help"><button type="button" data-cli-help="1">help</button><button type="button" data-cli-sample="0"></button><button type="button" data-cli-sample="1"></button><button type="button" data-cli-sample="2"></button><span class="tip">Tab = autocomplete · ↑↓ = history · switch vendor above</span></div>`;
  const footer=lab.querySelector('.game-footer'); footer?lab.insertBefore(wrap,footer):lab.appendChild(wrap);

  const out=wrap.querySelector('#router-cli-screen'), input=wrap.querySelector('#router-cli-input'), prompt=wrap.querySelector('#router-prompt');
  let mode='exec', history=[], historyIndex=-1, vendor='cisco';
  const state={
    cisco:{routes:new Map([['10.10.10.0/24','connected, Vlan10'],['10.20.20.0/24','connected, Vlan20'],['10.30.30.0/24','OSPF via 10.10.10.2'],['0.0.0.0/0','static via 10.10.10.254']]),vlans:new Map([['10','CLIENTS'],['20','SERVERS'],['50','MANAGEMENT']])},
    mikrotik:{routes:new Map([['10.10.10.0/24','connected ether2'],['10.20.20.0/24','connected vlan20'],['0.0.0.0/0','10.10.10.254']]),interfaces:new Map([['ether1','up'],['ether2','up'],['bridge-vlan20','up']])},
    fortigate:{routes:new Map([['10.10.10.0/24','port2'],['10.20.20.0/24','port3'],['0.0.0.0/0','10.10.10.254']]),policies:[['10','LAN-to-SERVERS','accept'],['20','LAN-to-WAN','accept'],['30','DMZ-to-LAN','deny']]}
  };
  const profiles={cisco:{title:'CISCO IOS LAB',sub:'Routing · VLAN · OSPF · ACL · troubleshooting',name:'CORE-R1',ip:'10.10.10.1',prompt:'CORE-R1#',samples:['show ip route','show vlan brief','show interfaces']},mikrotik:{title:'MIKROTIK ROUTEROS LAB',sub:'IP routing · bridge VLAN · firewall · diagnostics',name:'MT-EDGE',ip:'10.10.10.2',prompt:'[admin@MT-EDGE] >',samples:['/ip route print','/interface print','/ip firewall filter print']},fortigate:{title:'FORTIGATE CLI LAB',sub:'Routing · policy · NAT · sessions · diagnostics',name:'FG-EDGE',ip:'10.10.10.254',prompt:'FG-EDGE #',samples:['get router info routing-table all','get system interface','show firewall policy']}};
  const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const write=(html='')=>{const line=document.createElement('div');line.className='cli-line';line.innerHTML=html;out.appendChild(line);out.scrollTop=out.scrollHeight};
  const show=(s,cls='cli-output')=>`<span class="${cls}">${esc(s)}</span>`;
  const promptText=()=>mode==='config' ? (vendor==='cisco'?'CORE-R1(config)#':vendor==='mikrotik'?'[admin@MT-EDGE] /ip>':'FG-EDGE #') : profiles[vendor].prompt;
  const sync=()=>{prompt.textContent=promptText();wrap.querySelector('#cli-title').textContent=profiles[vendor].title;wrap.querySelector('#cli-subtitle').textContent=profiles[vendor].sub;wrap.querySelector('#cli-device-name').textContent=profiles[vendor].name;wrap.querySelector('#cli-device-ip').textContent=profiles[vendor].ip;wrap.querySelectorAll('[data-cli-sample]').forEach((b,i)=>b.textContent=profiles[vendor].samples[i]||'');input.placeholder=vendor==='cisco'?'Try: show ip route':vendor==='mikrotik'?'Try: /ip route print':'Try: get router info routing-table all'};
  const echo=s=>write(`<span class="cli-prompt">${esc(promptText())}</span> <span class="cli-cmd">${esc(s)}</span>`);

  function printCisco(){const s=state.cisco;write(show('Codes: C - connected, O - OSPF, S* - static','cli-info'));s.routes.forEach((v,k)=>write(show(`${k.padEnd(18)} ${v}`)));}
  function printMikro(){const s=state.mikrotik;write(show('Flags: X disabled, A active, C connected','cli-info'));let i=0;s.routes.forEach((v,k)=>write(show(`${i++} AS  dst-address=${k} gateway=${v}`)));}
  function printForti(){const s=state.fortigate;write(show('Routing table for VRF=0','cli-info'));s.routes.forEach((v,k)=>write(show(`${k.padEnd(18)} [10/0] via ${v}`)));}

  function run(raw){const c=raw.trim().toLowerCase().replace(/\s+/g,' ');echo(raw);if(!c)return;
    if(c==='help'||c==='?'){const common=['help','clear','exit','ping <ip>'];const cmds=vendor==='cisco'?['show ip route','show vlan brief','show interfaces','show access-lists','configure terminal','interface <name>','ip route <net> <gw>','no ip route <net>']:vendor==='mikrotik'?['/ip route print','/interface print','/ip firewall filter print','/interface bridge vlan print','/ip route add dst-address=<net> gateway=<gw>','/ip route remove [find dst-address=<net>]','/ping <ip>']:['get router info routing-table all','get system interface','show firewall policy','diagnose firewall iprope show 100','config router static','set dst <net>','set gateway <gw>','next','end','execute ping <ip>'];[...common,...cmds].forEach(x=>write(show(x,'cli-info')));return;}
    if(c==='clear'){out.innerHTML='';return;}
    if(vendor==='cisco'){
      if(c==='show ip route'){printCisco();return}
      if(c==='show vlan brief'){write(show('VLAN  Name                 Status    Ports','cli-info'));state.cisco.vlans.forEach((n,id)=>write(show(`${id.padEnd(4)} ${n.padEnd(20)} active    ${id==='10'?'Gi0/2-8':id==='20'?'Gi0/9-16':'Gi0/24'}`)));return}
      if(c==='show interfaces'){['Gi0/1 up/up 1G access vlan 1','Gi0/2 up/up 1G access vlan 10','Gi0/9 up/up 1G access vlan 20','Gi0/24 up/up 1G trunk native vlan 50'].forEach(x=>write(show(x)));return}
      if(c==='show access-lists'){['10 permit tcp 10.10.10.0/24 10.20.20.0/24 eq 443','20 permit icmp 10.10.10.0/24 any','30 deny ip any 10.20.20.0/24 log'].forEach(x=>write(show(x,'cli-ok')));return}
      if(c==='configure terminal'||c==='conf t'){mode='config';sync();write(show('Enter configuration commands. Type exit to return to exec mode.','cli-info'));return}
      if(mode==='config'&&/^ip route\s+/.test(c)){const p=c.split(/\s+/);if(p.length>=4){state.cisco.routes.set(p[2],`static via ${p[3]}`);write(show(`% Route ${p[2]} installed.`,'cli-ok'));}else write(show('% Invalid input.','cli-error'));return}
      if(mode==='config'&&/^no ip route\s+/.test(c)){const n=c.split(/\s+/)[3];write(state.cisco.routes.delete(n)?show(`% Route ${n} removed.`,'cli-ok'):show(`% Route ${n} not found.`,'cli-warn'));return}
    }
    if(vendor==='mikrotik'){
      if(c==='/ip route print'){printMikro();return}
      if(c==='/interface print'){state.mikrotik.interfaces.forEach((v,k)=>write(show(`0 RS name=${k} status=${v}`)));return}
      if(c==='/ip firewall filter print'){['0 chain=forward action=accept src-address=10.10.10.0/24 dst-address=10.20.20.0/24','1 chain=forward action=accept connection-state=established,related','2 chain=forward action=drop in-interface=WAN'].forEach(x=>write(show(x)));return}
      if(c==='/interface bridge vlan print'){['0 bridge=bridge vlan-ids=10 tagged=bridge untagged=ether2-ether5','1 bridge=bridge vlan-ids=20 tagged=bridge untagged=ether6-ether8'].forEach(x=>write(show(x)));return}
      if(c.startsWith('/ip route add ')){const m=c.match(/dst-address=([^\s]+)\s+gateway=([^\s]+)/);if(m){state.mikrotik.routes.set(m[1],m[2]);write(show(`added ${m[1]} via ${m[2]}`,'cli-ok'));return}}
      if(c.startsWith('/ping ')){write(show(`  SEQ HOST                                     SIZE TTL TIME STATUS`,'cli-info'));write(show(`    0 10.20.20.25                               56  63 1ms`,'cli-ok'));write(show('    1 10.20.20.25                               56  63 1ms','cli-ok'));return}
    }
    if(vendor==='fortigate'){
      if(c==='get router info routing-table all'){printForti();return}
      if(c==='get system interface'){['===[ port2 ]','ip=10.10.10.254/24 status=up','===[ port3 ]','ip=10.20.20.1/24 status=up','===[ wan1 ]','ip=192.0.2.10/30 status=up'].forEach(x=>write(show(x)));return}
      if(c==='show firewall policy'){state.fortigate.policies.forEach(p=>write(show(`${p[0]} ${p[1].padEnd(18)} action=${p[2]}`,p[2]==='deny'?'cli-warn':'cli-ok')));return}
      if(c==='diagnose firewall iprope show 100'){['policy 10 hitcount=124','policy 20 hitcount=587','policy 30 hitcount=0'].forEach(x=>write(show(x)));return}
      if(c.startsWith('execute ping ')){const ip=c.slice(13);write(show(`PING ${ip}: 56 data bytes`));write(show(`64 bytes from ${ip}: icmp_seq=1 ttl=63 time=1.1 ms`,'cli-ok'));return}
    }
    if(c==='exit'){if(mode==='config'){mode='exec';sync();write(show('Leaving configuration mode.','cli-info'));}else write(show('Already at top level.','cli-warn'));return}
    if(c.startsWith('ping ')){const ip=c.slice(5);write(show(`PING ${ip} — 56 bytes`));write(show(`64 bytes from ${ip}: reply time=1.2 ms`,'cli-ok'));return}
    write(show(`% Unknown command: ${raw}. Type help for commands supported by ${profiles[vendor].name}.`,'cli-error'));
  }

  function setVendor(next){vendor=next;mode='exec';history=[];historyIndex=-1;out.innerHTML='';wrap.querySelectorAll('.vendor-btn').forEach(b=>b.classList.toggle('active',b.dataset.vendor===vendor));sync();write(show(`${profiles[vendor].name} · ${profiles[vendor].title}`,'cli-info'));write(show('Learning simulator — commands change only the local lab state. Type help to start.'));write('');write(show(`Try: ${profiles[vendor].samples[0]}`,'cli-ok'));input.focus();}
  wrap.querySelectorAll('.vendor-btn').forEach(b=>b.addEventListener('click',()=>setVendor(b.dataset.vendor)));
  wrap.querySelector('#router-cli-form').addEventListener('submit',e=>{e.preventDefault();const v=input.value.trim();if(!v)return;history.push(v);historyIndex=history.length;run(v);input.value='';});
  input.addEventListener('keydown',e=>{if(e.key==='ArrowUp'){e.preventDefault();if(historyIndex>0){historyIndex--;input.value=history[historyIndex]}}else if(e.key==='ArrowDown'){e.preventDefault();if(historyIndex<history.length-1){historyIndex++;input.value=history[historyIndex]}else{historyIndex=history.length;input.value=''}}else if(e.key==='Tab'){e.preventDefault();const v=input.value.trim().toLowerCase();const list=profiles[vendor].samples.concat(['help','clear','exit','ping 10.20.20.25']);const hit=list.find(x=>x.startsWith(v)&&x!==v);if(hit)input.value=hit;}});
  wrap.querySelector('[data-cli-help]').addEventListener('click',()=>{input.value='help';input.focus()});
  wrap.querySelectorAll('[data-cli-sample]').forEach(b=>b.addEventListener('click',()=>{input.value=profiles[vendor].samples[Number(b.dataset.cliSample)]||'';input.focus()}));
  setVendor('cisco');
})();
