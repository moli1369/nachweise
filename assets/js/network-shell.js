(() => {
  const lab = document.querySelector('#network-game');
  if (!lab) return;

  const removeOldShells = () => {
    lab.querySelectorAll('.vendor-lab, #router-cli, .router-console').forEach(el => el.remove());
  };
  removeOldShells();

  const style = document.createElement('style');
  style.textContent = `
    .network-shell{margin-top:.85rem;border:1px solid rgba(66,199,255,.18);border-radius:16px;overflow:hidden;background:#02080e;box-shadow:0 20px 70px rgba(0,0,0,.22)}
    .network-shell-head{display:flex;align-items:center;justify-content:space-between;gap:.8rem;padding:.72rem .85rem;border-bottom:1px solid var(--line);background:linear-gradient(90deg,rgba(66,199,255,.07),transparent)}
    .shell-title{display:flex;align-items:center;gap:.5rem;font:600 .58rem var(--mono);letter-spacing:.08em;color:#d5e8f2}.shell-led{width:7px;height:7px;border-radius:50%;background:var(--green);box-shadow:0 0 12px rgba(111,229,174,.8)}
    .shell-state{color:#6c8496;font:500 .52rem var(--mono)}.shell-state b{color:var(--cyan);font-weight:600}
    .network-shell-screen{height:290px;overflow:auto;padding:1rem;background:radial-gradient(circle at 20% 10%,rgba(66,199,255,.05),transparent 28%),#02070c;color:#b8cad5;font:500 .67rem/1.65 var(--mono);white-space:pre-wrap}
    .shell-line{margin:.08rem 0}.shell-prompt{color:var(--cyan)}.shell-cmd{color:#d8edf8}.shell-info{color:#80bbdb}.shell-ok{color:#79edbc}.shell-warn{color:#ffb478}.shell-error{color:#ff8793}.shell-dim{color:#5d7587}
    .network-shell-form{display:flex;align-items:center;gap:.5rem;padding:.65rem .75rem;border-top:1px solid var(--line);background:#030a11}.network-shell-prompt{color:var(--cyan);font:600 .67rem var(--mono);white-space:nowrap}.network-shell-form input{flex:1;min-width:0;border:0;outline:0;background:transparent;color:#eef8ff;font:500 .67rem var(--mono)}.network-shell-form input::placeholder{color:#41596a}.network-shell-form button{border:1px solid rgba(66,199,255,.22);border-radius:7px;padding:.4rem .58rem;background:rgba(66,199,255,.06);color:var(--cyan);font:600 .56rem var(--mono);cursor:pointer}
    .network-shell-guide{display:flex;align-items:center;gap:.35rem;flex-wrap:wrap;padding:.55rem .75rem;border-top:1px solid var(--line);background:rgba(255,255,255,.015);color:#607a8c;font:500 .51rem var(--mono)}.network-shell-guide button{border:1px solid var(--line);border-radius:6px;background:rgba(255,255,255,.02);color:#91aabb;padding:.28rem .42rem;font:500 .52rem var(--mono);cursor:pointer}.network-shell-guide button:hover{border-color:rgba(66,199,255,.3);color:var(--cyan)}.network-shell-guide .guide-label{color:#9db3c1}
    .shell-session{padding:.5rem .75rem;border-top:1px solid var(--line);display:none;background:rgba(66,199,255,.025);color:#7d97a7;font:500 .5rem var(--mono)}.shell-session.show{display:block}.shell-session b{color:#d6eaf4}
    @media(max-width:600px){.network-shell-screen{height:250px;font-size:.61rem}.network-shell-prompt,.network-shell-form input{font-size:.61rem}.shell-state{display:none}}
  `;
  document.head.appendChild(style);

  const shell = document.createElement('section');
  shell.className = 'network-shell';
  shell.innerHTML = `
    <div class="network-shell-head">
      <div class="shell-title"><span class="shell-led"></span><span>NETWORK DEVICE CONSOLE</span></div>
      <div class="shell-state">SESSION: <b id="shell-device">LAB</b></div>
    </div>
    <div class="network-shell-screen" id="network-shell-screen" role="log" aria-live="polite"></div>
    <form class="network-shell-form" id="network-shell-form">
      <span class="network-shell-prompt" id="network-shell-prompt">LAB#</span>
      <input id="network-shell-input" autocomplete="off" autocapitalize="none" spellcheck="false" placeholder="Type cisco, mikrotik or fortigate…" aria-label="Network device command line">
      <button type="submit">RUN</button>
    </form>
    <div class="network-shell-guide"><span class="guide-label">Quick start:</span><button type="button" data-shell="cisco">cisco</button><button type="button" data-shell="mikrotik">mikrotik</button><button type="button" data-shell="fortigate">fortigate</button><button type="button" data-shell="help">help</button><span>·</span><span>Tab = autocomplete · ↑↓ = history · exit = logout</span></div>
    <div class="shell-session" id="shell-session">Connected to <b id="shell-session-name">LAB</b></div>
  `;
  const footer = lab.querySelector('.game-footer');
  footer ? lab.insertBefore(shell, footer) : lab.appendChild(shell);

  const screen = shell.querySelector('#network-shell-screen');
  const input = shell.querySelector('#network-shell-input');
  const prompt = shell.querySelector('#network-shell-prompt');
  const deviceLabel = shell.querySelector('#shell-device');
  const sessionStrip = shell.querySelector('#shell-session');
  const sessionName = shell.querySelector('#shell-session-name');

  const profiles = {
    cisco: {
      prompt: 'CORE-R1#', label: 'CISCO / CORE-R1',
      help: ['show ip route','show vlan brief','show interfaces','show access-lists','ping 10.20.20.25','traceroute 10.20.20.25','configure terminal','show running-config'],
      enter: ['configure terminal','conf t'],
      exitConfig: ['end'],
      routes: ['C 10.10.10.0/24  directly connected, Vlan10','C 10.20.20.0/24  directly connected, Vlan20','O 10.30.30.0/24  [110/20] via 10.10.10.2','S* 0.0.0.0/0      via 10.10.10.254']
    },
    mikrotik: {
      prompt: '[admin@MT-EDGE] >', label: 'MIKROTIK / MT-EDGE',
      help: ['/ip route print','/interface print','/ip address print','/ip firewall filter print','/ping 10.20.20.25','/tool traceroute 10.20.20.25','/ip route add dst-address=10.40.40.0/24 gateway=10.10.10.254'],
      enter: ['/system console','/ip route','/interface','/ip firewall filter'],
      exitConfig: ['/quit'],
      routes: ['DAC 10.10.10.0/24  vlan10','DAC 10.20.20.0/24  vlan20','DAo 10.30.30.0/24 via 10.10.10.2','DA 0.0.0.0/0      via 10.10.10.254']
    },
    fortigate: {
      prompt: 'FG-EDGE #', label: 'FORTIGATE / FG-EDGE',
      help: ['get router info routing-table all','get system status','get system interface','show firewall policy','execute ping 10.20.20.25','execute traceroute 10.20.20.25','config firewall policy','config router static'],
      enter: ['config firewall policy','config router static','config system interface'],
      exitConfig: ['end'],
      routes: ['C 10.10.10.0/24  port2','C 10.20.20.0/24  port3','S 10.30.30.0/24  10.10.10.2','S* 0.0.0.0/0      10.10.10.254']
    }
  };

  let mode = 'lab';
  let device = null;
  let history = [];
  let historyIndex = -1;
  let selectedConfig = null;
  const state = {
    cisco: { routes: new Map([['10.10.10.0/24','connected Vlan10'],['10.20.20.0/24','connected Vlan20']]) },
    mikrotik: { routes: new Map([['10.10.10.0/24','gateway vlan10'],['10.20.20.0/24','gateway vlan20']]) },
    fortigate: { routes: new Map([['10.10.10.0/24','port2'],['10.20.20.0/24','port3']]) }
  };

  const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const write = (text, cls='') => { const d=document.createElement('div'); d.className=`shell-line ${cls}`; d.innerHTML=text; screen.appendChild(d); screen.scrollTop=screen.scrollHeight; };
  const show = (text, cls='') => `<span class="${cls}">${esc(text)}</span>`;
  const currentPrompt = () => mode==='lab' ? 'LAB#' : (mode==='config' ? (device==='cisco' ? 'CORE-R1(config)#' : device==='mikrotik' ? '[admin@MT-EDGE] /ip>': 'FG-EDGE #') : profiles[device].prompt);
  const syncUI = () => { prompt.textContent=currentPrompt(); deviceLabel.textContent=mode==='lab'?'LAB':profiles[device].label; sessionStrip.classList.toggle('show',mode!=='lab'); sessionName.textContent=mode==='lab'?'LAB':profiles[device].label; input.placeholder=mode==='lab'?'Type cisco, mikrotik or fortigate…':`Type a ${device} command…`; };
  const echo = cmd => write(`<span class="shell-prompt">${esc(currentPrompt())}</span> <span class="shell-cmd">${esc(cmd)}</span>`);

  function enterDevice(name){
    device=name; mode='exec'; selectedConfig=null; history=[]; historyIndex=-1; screen.innerHTML=''; syncUI();
    write(show(`Connected to ${profiles[name].label}`,'shell-info'));
    write(show('Type help for supported commands. Type exit to leave the device session.','shell-dim'));
    updateTopology(name,false);
  }

  function leaveDevice(){
    if(mode==='lab') return;
    const leaving=profiles[device].label; device=null; mode='lab'; selectedConfig=null; history=[]; historyIndex=-1; syncUI();
    write(show(`Session closed: ${leaving}`,'shell-info'));
    write(show('Available devices: cisco · mikrotik · fortigate','shell-dim'));
    updateTopology(null,false);
  }

  function enterConfig(command){
    mode='config'; selectedConfig=command; syncUI();
    write(show(`Entering configuration context: ${command}`,'shell-info'));
    updateTopology(device,true);
  }

  function runDeviceCommand(raw){
    const c=raw.trim().toLowerCase().replace(/\s+/g,' '); echo(raw); if(!c)return;
    if(c==='exit'){ leaveDevice(); return; }
    if(c==='help'||c==='?'){ profiles[device].help.forEach(x=>write(show(x,'shell-info'))); write(show('exit  → leave this device session','shell-dim')); return; }
    if(c==='clear'){screen.innerHTML='';return;}
    if(device==='cisco') runCisco(c,raw);
    else if(device==='mikrotik') runMikro(c,raw);
    else runForti(c,raw);
  }

  function runCisco(c,raw){
    if(c==='show ip route'){profiles.cisco.routes.forEach(x=>write(show(x)));return;}
    if(c==='show vlan brief'){['10 CLIENTS active','20 SERVERS active','50 MANAGEMENT active'].forEach(x=>write(show(x)));return;}
    if(c==='show interfaces'){['Gi0/1 up/up 1G WAN','Gi0/2 up/up access vlan 10','Gi0/9 up/up access vlan 20','Gi0/24 up/up trunk'].forEach(x=>write(show(x)));return;}
    if(c==='show access-lists'){['10 permit tcp 10.10.10.0/24 10.20.20.0/24 eq 443','20 permit icmp 10.10.10.0/24 any','30 deny ip any 10.20.20.0/24 log'].forEach((x,i)=>write(show(x,i===2?'shell-warn':'shell-ok')));return;}
    if(c==='show running-config'){write(show('! running-config (simulated)','shell-info'));write(show('router ospf 1'));write(show(' ip route 10.30.30.0/24 10.10.10.2'));return;}
    if(profiles.cisco.enter.includes(c)){enterConfig('global configuration');return;}
    if(mode==='config'&&/^ip route\s+/.test(c)){const p=c.split(' ');if(p.length>=4){state.cisco.routes.set(p[2],`static via ${p[3]}`);write(show('% route installed in simulator state','shell-ok'));}return;}
    if(mode==='config'&&/^vlan\s+\d+/.test(c)){write(show('VLAN created in simulator state.','shell-ok'));return;}
    if(mode==='config'&&(c.startsWith('interface ')||c==='shutdown'||c==='no shutdown')){write(show(`${raw} accepted in simulator state.`,'shell-ok'));return;}
    if(c==='end'&&mode==='config'){mode='exec';syncUI();write(show('Leaving configuration mode.','shell-info'));return;}
    if(c.startsWith('ping ')){write(show(`64 bytes from ${c.slice(5)}: icmp_seq=1 ttl=63 time=0.7 ms`,'shell-ok'));write(show('1 packets transmitted, 1 received, 0% packet loss','shell-ok'));return;}
    if(c.startsWith('traceroute ')){['1  10.10.10.1  0.7 ms','2  10.10.10.2  1.3 ms','3  10.20.20.1  1.8 ms','4  10.20.20.25  2.1 ms'].forEach(x=>write(show(x)));return;}
    write(show(`% Unknown command: ${raw}`,'shell-error'));
  }

  function runMikro(c,raw){
    if(c==='/ip route print'){profiles.mikrotik.routes.forEach(x=>write(show(x)));return;}
    if(c==='/interface print'){['0 R ether1 WAN','1 R ether2 LAN','2 R ether3 SERVER','3 R bridge-vlan20'].forEach(x=>write(show(x)));return;}
    if(c==='/ip address print'){['10.10.10.2/24 ether1','10.20.20.1/24 vlan20','10.50.50.1/24 vlan50'].forEach(x=>write(show(x)));return;}
    if(c==='/ip firewall filter print'){['0 accept established,related','1 accept tcp dst-port=443','2 drop invalid','3 drop src-address-list=blocked'].forEach((x,i)=>write(show(x,i>1?'shell-warn':'shell-ok')));return;}
    if(c.startsWith('/ip route add ')){const m=raw.match(/dst-address=([^ ]+) gateway=([^ ]+)/i);if(m){state.mikrotik.routes.set(m[1],`via ${m[2]}`);write(show(`route ${m[1]} added via ${m[2]} (simulated)`,'shell-ok'));}else write(show('Use: /ip route add dst-address=<network> gateway=<gateway>','shell-error'));return;}
    if(c.startsWith('/ping ')){write(show(`64 bytes from ${raw.split(' ')[1]}: ttl=63 time=0.6 ms`,'shell-ok'));return;}
    if(c.startsWith('/tool traceroute ')){['1  10.10.10.2  0.6ms','2  10.10.10.254  1.1ms','3  10.20.20.25  2.0ms'].forEach(x=>write(show(x)));return;}
    if(c.startsWith('/interface ')||c.startsWith('/ip firewall filter')||c.startsWith('/system ')){enterConfig(raw);return;}
    write(show(`failure: unknown command (${raw})`,'shell-error'));
  }

  function runForti(c,raw){
    if(c==='get router info routing-table all'){profiles.fortigate.routes.forEach(x=>write(show(x)));return;}
    if(c==='get system status'){['Version: FortiGate-VM v7.4','Hostname: FG-EDGE','Operation mode: NAT'].forEach(x=>write(show(x)));return;}
    if(c==='get system interface'){['port2 10.10.10.254/24 up','port3 10.20.20.1/24 up','port4 10.50.50.1/24 up'].forEach(x=>write(show(x)));return;}
    if(c==='show firewall policy'){['edit 10','set name "LAN-to-SERVERS"','set action accept','next','edit 20','set name "LAN-to-WAN"','set action accept','next','edit 30','set name "DMZ-to-LAN"','set action deny','next'].forEach((x,i)=>write(show(x,i%4===0?'shell-info':x.includes('deny')?'shell-warn':'shell-output')));return;}
    if(c.startsWith('config ')){enterConfig(raw);return;}
    if(c==='end'&&mode==='config'){mode='exec';syncUI();write(show('End configuration session.','shell-info'));updateTopology(device,false);return;}
    if(c.startsWith('execute ping ')){write(show('64 bytes from 10.20.20.25: icmp_seq=1 ttl=63 time=0.7 ms','shell-ok'));return;}
    if(c.startsWith('execute traceroute ')){['1 10.10.10.254 0.7 ms','2 10.10.10.1 1.2 ms','3 10.20.20.25 2.0 ms'].forEach(x=>write(show(x)));return;}
    write(show(`Command fail. Return code -61: ${raw}`,'shell-error'));
  }

  function updateTopology(active, configuring){
    const svg=lab.querySelector('.game-topology'); if(!svg) return;
    svg.querySelectorAll('[data-shell-device],.shell-focus-label').forEach(n=>n.remove());
    const label = document.createElementNS('http://www.w3.org/2000/svg','text');
    label.classList.add('shell-focus-label'); label.setAttribute('x','50'); label.setAttribute('y','8'); label.setAttribute('text-anchor','middle'); label.setAttribute('fill', configuring ? '#ffb478' : '#79edbc'); label.setAttribute('font-size','3.2'); label.setAttribute('font-family','monospace'); label.textContent=active?`${configuring?'CONFIGURING · ':'SESSION · '}${profiles[active].label}`:'SELECT DEVICE · TYPE cisco / mikrotik / fortigate'; svg.appendChild(label);
  }

  function complete(){
    const v=input.value.trim().toLowerCase();
    const candidates = mode==='lab' ? ['cisco','mikrotik','fortigate','help'] : profiles[device].help.concat(['exit','clear']);
    const hit=candidates.find(x=>x.toLowerCase().startsWith(v)&&x.toLowerCase()!==v); if(hit) input.value=hit;
  }

  function submit(cmd){
    const raw=cmd.trim(); if(!raw)return;
    history.push(raw); historyIndex=history.length;
    const c=raw.toLowerCase();
    if(mode==='lab'){
      if(['cisco','mikrotik','fortigate'].includes(c)){enterDevice(c);input.value='';return;}
      if(c==='help'||c==='?'){write(show('cisco     → enter Cisco IOS session','shell-info'));write(show('mikrotik  → enter MikroTik RouterOS session','shell-info'));write(show('fortigate → enter FortiGate CLI session','shell-info'));write(show('exit      → stay at LAB launcher','shell-dim'));input.value='';return;}
      if(c==='clear'){screen.innerHTML='';input.value='';return;}
      write(`<span class="shell-prompt">LAB#</span> ${show('Unknown command. Type help.','shell-error')}`); input.value=''; return;
    }
    runDeviceCommand(raw); input.value='';
  }

  write(show('Network Operations Lab launcher','shell-info'));
  write(show('Type cisco, mikrotik or fortigate to open a device session.','shell-dim'));
  write(show('Example: mikrotik → /ip route print → exit','shell-dim'));
  syncUI(); updateTopology(null,false); input.focus();

  shell.querySelector('#network-shell-form').addEventListener('submit',e=>{e.preventDefault();submit(input.value);});
  input.addEventListener('keydown',e=>{
    if(e.key==='Tab'){e.preventDefault();complete();}
    else if(e.key==='ArrowUp'){e.preventDefault();if(historyIndex>0){historyIndex--;input.value=history[historyIndex]}}
    else if(e.key==='ArrowDown'){e.preventDefault();if(historyIndex<history.length-1){historyIndex++;input.value=history[historyIndex]}else{historyIndex=history.length;input.value=''}}
  });
  shell.querySelectorAll('[data-shell]').forEach(b=>b.addEventListener('click',()=>{input.value=b.dataset.shell;input.focus();}));
})();
