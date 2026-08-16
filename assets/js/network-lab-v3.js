(() => {
  const mount = () => {
    const root = document.querySelector('#network-game');
    if (!root || root.dataset.v3Ready === '1') return !!root;
    root.dataset.v3Ready = '1';

    const style = document.createElement('style');
    style.textContent = `
      .nl3{border:1px solid rgba(66,199,255,.16);border-radius:22px;overflow:hidden;background:#02080f;box-shadow:0 28px 90px rgba(0,0,0,.28)}
      .nl3-head{display:flex;justify-content:space-between;align-items:center;gap:14px;padding:16px 18px;border-bottom:1px solid rgba(180,215,240,.08);background:linear-gradient(135deg,#081a2a,#030b13)}
      .nl3-title{display:flex;align-items:center;gap:12px}.nl3-mark{display:grid;place-items:center;width:48px;height:48px;border:1px solid rgba(66,199,255,.28);border-radius:14px;color:#42c7ff;font:700 .75rem var(--mono);background:rgba(66,199,255,.05)}
      .nl3-title strong{display:block;color:#e5f3f9;font-size:1rem}.nl3-title small{display:block;margin-top:4px;color:#688498;font:500 .56rem var(--mono)}
      .nl3-status{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}.nl3-pill{padding:7px 9px;border:1px solid rgba(180,215,240,.1);border-radius:9px;color:#86a3b4;font:600 .52rem var(--mono)}.nl3-pill.live{color:#79edbc;border-color:rgba(121,237,188,.18)}
      .nl3-grid{display:grid;grid-template-columns:1.15fr .85fr;min-height:520px}.nl3-map{position:relative;min-width:0;background:radial-gradient(circle at 45% 45%,rgba(66,199,255,.09),transparent 42%),#020910;overflow:hidden}.nl3-map:before{content:"";position:absolute;inset:0;background-image:linear-gradient(rgba(66,199,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(66,199,255,.035) 1px,transparent 1px);background-size:30px 30px}
      .nl3-map-head,.nl3-term-head{position:relative;display:flex;justify-content:space-between;align-items:center;padding:12px 14px;border-bottom:1px solid rgba(180,215,240,.08);color:#7795a7;font:600 .52rem var(--mono);letter-spacing:.1em}.nl3-map-head span:last-child{color:#79edbc}
      .nl3-svg{position:absolute;inset:40px 0 0;width:100%;height:calc(100% - 40px)}.nl3-link{fill:none;stroke:rgba(66,199,255,.18);stroke-width:2;stroke-dasharray:4 10;animation:nl3flow 2.3s linear infinite}.nl3-link.hot{stroke:#42c7ff;stroke-width:3;filter:drop-shadow(0 0 8px rgba(66,199,255,.55))}.nl3-node{cursor:pointer}.nl3-node rect,.nl3-node circle{fill:#071a29;stroke:rgba(66,199,255,.3);stroke-width:1.5;transition:.2s}.nl3-node.active rect,.nl3-node.active circle,.nl3-node:hover rect,.nl3-node:hover circle{stroke:#42c7ff;filter:drop-shadow(0 0 14px rgba(66,199,255,.4))}.nl3-node text{fill:#e5f4fb;text-anchor:middle;font:700 10px var(--mono);letter-spacing:.08em;pointer-events:none}.nl3-node .sub{fill:#668498;font:500 6px var(--mono);letter-spacing:.04em}.nl3-packet{fill:#fff;filter:drop-shadow(0 0 8px #fff);transition:cx .55s ease,cy .55s ease}.nl3-map-foot{position:absolute;left:14px;right:14px;bottom:14px;display:flex;justify-content:space-between;gap:10px;padding:10px 12px;border:1px solid rgba(180,215,240,.1);border-radius:11px;background:rgba(2,9,15,.8);backdrop-filter:blur(8px);color:#688496;font:500 .51rem var(--mono)}.nl3-map-foot b{color:#dceef6}.nl3-console{border-left:1px solid rgba(180,215,240,.08);background:#02070c;display:flex;flex-direction:column;min-width:0}.nl3-devices{display:flex;gap:6px;padding:10px;border-bottom:1px solid rgba(180,215,240,.08);background:#03101a}.nl3-device{flex:1;border:1px solid rgba(180,215,240,.1);border-radius:9px;padding:8px 6px;background:rgba(255,255,255,.015);color:#7895a7;font:600 .5rem var(--mono);cursor:pointer}.nl3-device.active{color:#42c7ff;border-color:rgba(66,199,255,.38);background:rgba(66,199,255,.06)}
      .nl3-terminal{flex:1;min-height:300px;padding:14px;overflow:auto;color:#b9ced9;font:500 .63rem/1.7 var(--mono);background:radial-gradient(circle at 20% 10%,rgba(66,199,255,.04),transparent 30%)}.nl3-line{margin:2px 0}.nl3-c{color:#42c7ff}.nl3-g{color:#79edbc}.nl3-r{color:#ff8793}.nl3-y{color:#ffb478}.nl3-input{display:flex;align-items:center;gap:8px;padding:10px 12px;border-top:1px solid rgba(180,215,240,.08);background:#03101a}.nl3-prompt{color:#42c7ff;font:700 .62rem var(--mono);white-space:nowrap}.nl3-input input{flex:1;min-width:0;border:0;outline:0;background:transparent;color:#eef8ff;font:500 .63rem var(--mono)}.nl3-run{border:1px solid rgba(66,199,255,.24);border-radius:8px;padding:7px 9px;background:rgba(66,199,255,.06);color:#42c7ff;font:700 .5rem var(--mono);cursor:pointer}.nl3-help{padding:8px 12px;border-top:1px solid rgba(180,215,240,.08);color:#5f788b;font:500 .49rem var(--mono)}
      .nl3-quick{display:grid;grid-template-columns:1fr 1fr;gap:6px;padding:10px;border-top:1px solid rgba(180,215,240,.08)}.nl3-q{padding:7px;border:1px solid rgba(180,215,240,.08);border-radius:8px;background:rgba(255,255,255,.015);color:#86a7b8;text-align:left;font:500 .49rem var(--mono);cursor:pointer}.nl3-q:hover{border-color:rgba(66,199,255,.3);color:#42c7ff}
      @keyframes nl3flow{to{stroke-dashoffset:-56}}@media(max-width:900px){.nl3-grid{grid-template-columns:1fr}.nl3-console{border-left:0;border-top:1px solid rgba(180,215,240,.08);min-height:520px}}@media(max-width:560px){.nl3-head{align-items:flex-start;flex-direction:column}.nl3-status{justify-content:flex-start}.nl3-map{min-height:410px}.nl3-title strong{font-size:.92rem}.nl3-device{font-size:.47rem}.nl3-terminal{font-size:.58rem}.nl3-input input{font-size:.58rem}}
    `;
    document.head.appendChild(style);

    root.innerHTML = `
      <div class="nl3">
        <div class="nl3-head"><div class="nl3-title"><span class="nl3-mark">NOC</span><div><strong>Network Operations Center</strong><small>Multi-vendor infrastructure simulator · routing · security · verification</small></div></div><div class="nl3-status"><span class="nl3-pill live">● SIMULATOR ONLINE</span><span class="nl3-pill">IPv4 / L3</span><span class="nl3-pill">CLI READY</span></div></div>
        <div class="nl3-grid">
          <div class="nl3-map"><div class="nl3-map-head"><span>TOPOLOGY / FORWARDING PLANE</span><span id="nl3-map-state">● READY</span></div><svg class="nl3-svg" viewBox="0 0 760 450" preserveAspectRatio="xMidYMid meet" aria-label="Interactive network topology">
            <g id="nl3-links"></g><g id="nl3-nodes"></g><circle id="nl3-packet" class="nl3-packet" cx="92" cy="332" r="5"/>
          </svg><div class="nl3-map-foot"><span>ACTIVE DEVICE: <b id="nl3-active-device">NONE</b></span><span>PACKET FLOW: <b id="nl3-flow">IDLE</b></span></div></div>
          <div class="nl3-console">
            <div class="nl3-devices"><button class="nl3-device active" data-v="cisco">CISCO</button><button class="nl3-device" data-v="mikrotik">MIKROTIK</button><button class="nl3-device" data-v="fortigate">FORTIGATE</button></div>
            <div class="nl3-term-head"><span id="nl3-session">SESSION / CORE-R1</span><span>EXIT = LOGOUT</span></div>
            <div class="nl3-terminal" id="nl3-terminal"></div>
            <form class="nl3-input" id="nl3-form"><span class="nl3-prompt" id="nl3-prompt">LAB#</span><input id="nl3-input" autocomplete="off" spellcheck="false" placeholder="type cisco, mikrotik, fortigate or help…"><button class="nl3-run">RUN</button></form>
            <div class="nl3-help">Device launcher: <b>cisco</b> · <b>mikrotik</b> · <b>fortigate</b> · <b>help</b> · <b>exit</b> · Tab autocomplete · ↑↓ history</div>
            <div class="nl3-quick" id="nl3-quick"></div>
          </div>
        </div>
      </div>`;

    const nodes = {
      client:{x:92,y:332,w:116,h:60,label:'CLIENT',sub:'VLAN 10 · 10.10.10.25'},
      cisco:{x:300,y:225,r:55,label:'CISCO CORE',sub:'OSPF · L3 · VLAN'},
      fortigate:{x:500,y:125,w:136,h:64,label:'FORTIGATE',sub:'POLICY · NAT · SECURITY'},
      mikrotik:{x:500,y:325,w:136,h:64,label:'MIKROTIK',sub:'EDGE · WAN · ROUTING'},
      server:{x:675,y:225,w:112,h:64,label:'DMZ SERVER',sub:'10.20.20.25'},
      wan:{x:675,y:355,r:34,label:'WAN',sub:'0.0.0.0/0'}
    };
    const edges = [['client','cisco'],['cisco','fortigate'],['cisco','mikrotik'],['fortigate','server'],['fortigate','mikrotik'],['mikrotik','wan']];
    const devices = {
      cisco:{name:'Cisco IOS',prompt:'CORE-R1#',help:['show ip route','show vlan brief','show interfaces','configure terminal','ping 10.20.20.25'],guide:'IOS: show / configure terminal / interface / ip route'},
      mikrotik:{name:'MikroTik RouterOS',prompt:'[admin@MT-EDGE] >',help:['/ip route print','/interface print','/ip address print','/ip firewall filter print','/ping 10.20.20.25'],guide:'RouterOS: slash paths /ip /interface /routing /ip firewall'},
      fortigate:{name:'FortiGate',prompt:'FG-EDGE #',help:['get router info routing-table all','show firewall policy','get system status','execute ping 10.20.20.25','config firewall policy'],guide:'FortiOS: get / show / diagnose / config / edit / next / end'}
    };
    let vendor='cisco', mode='launcher', history=[], historyIndex=0;
    const term = root.querySelector('#nl3-terminal'), input=root.querySelector('#nl3-input'), prompt=root.querySelector('#nl3-prompt'), quick=root.querySelector('#nl3-quick');
    const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const log = (text, cls='') => { const line=document.createElement('div'); line.className='nl3-line '+cls; line.innerHTML=text; term.appendChild(line); term.scrollTop=term.scrollHeight; };
    const echo = cmd => log(`<span class="nl3-c">${esc(prompt.textContent)}</span> ${esc(cmd)}`);
    const setDevice = (v, auto=true) => {
      vendor=v; mode='exec'; history=[]; historyIndex=0; term.innerHTML=''; prompt.textContent=devices[v].prompt; root.querySelector('#nl3-session').textContent='SESSION / '+(v==='cisco'?'CORE-R1':v==='mikrotik'?'MT-EDGE':'FG-EDGE'); root.querySelector('#nl3-active-device').textContent=devices[v].name.toUpperCase(); root.querySelector('#nl3-map-state').textContent='● '+devices[v].name.toUpperCase(); root.querySelector('#nl3-flow').textContent='ACTIVE';
      root.querySelectorAll('.nl3-device').forEach(b=>b.classList.toggle('active',b.dataset.v===v)); quick.innerHTML=devices[v].help.map(c=>`<button type="button" class="nl3-q" data-cmd="${esc(c)}">${esc(c)}</button>`).join(''); quick.querySelectorAll('[data-cmd]').forEach(b=>b.onclick=()=>{input.value=b.dataset.cmd;input.focus()}); highlight(v); log(`Connected to ${esc(devices[v].name)}.` ,'nl3-g'); log(esc(devices[v].guide),''); log('Type help to see commands.',''); input.value=''; input.focus();
      if(auto) window.dispatchEvent(new CustomEvent('portfolio:device',{detail:{device:v}}));
    };
    const logout = () => { vendor=null;mode='launcher';prompt.textContent='LAB#';root.querySelector('#nl3-session').textContent='DEVICE LAUNCHER';root.querySelector('#nl3-active-device').textContent='NONE';root.querySelector('#nl3-flow').textContent='IDLE';root.querySelector('#nl3-map-state').textContent='● READY';term.innerHTML='';quick.innerHTML='';root.querySelectorAll('.nl3-device').forEach(b=>b.classList.remove('active')); highlight(null);log('Network Lab ready.','nl3-g');log('Type cisco, mikrotik or fortigate to start.','');input.value='';input.focus();};
    const highlight = v => root.querySelectorAll('.nl3-node').forEach(n=>n.classList.toggle('active', n.dataset.node===v));
    const movePacket = k => {const p=root.querySelector('#nl3-packet'), n=nodes[k]; if(p&&n){p.setAttribute('cx',n.x);p.setAttribute('cy',n.y)}};
    const renderMap = () => {
      const lg=root.querySelector('#nl3-links'), ng=root.querySelector('#nl3-nodes');
      edges.forEach(([a,b],i)=>{const p1=nodes[a],p2=nodes[b],el=document.createElementNS('http://www.w3.org/2000/svg','path');el.setAttribute('d',`M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`);el.setAttribute('class','nl3-link');el.style.animationDelay=`${i*.2}s`;lg.appendChild(el)});
      Object.entries(nodes).forEach(([k,n])=>{const g=document.createElementNS('http://www.w3.org/2000/svg','g');g.setAttribute('class','nl3-node');g.dataset.node=k;let shape;if(n.r){shape=document.createElementNS('http://www.w3.org/2000/svg','circle');shape.setAttribute('cx',n.x);shape.setAttribute('cy',n.y);shape.setAttribute('r',n.r)}else{shape=document.createElementNS('http://www.w3.org/2000/svg','rect');shape.setAttribute('x',n.x-n.w/2);shape.setAttribute('y',n.y-n.h/2);shape.setAttribute('width',n.w);shape.setAttribute('height',n.h);shape.setAttribute('rx',14)}g.appendChild(shape);const t=document.createElementNS('http://www.w3.org/2000/svg','text');t.setAttribute('x',n.x);t.setAttribute('y',n.y-2);t.textContent=n.label;g.appendChild(t);const s=document.createElementNS('http://www.w3.org/2000/svg','text');s.setAttribute('x',n.x);s.setAttribute('y',n.y+14);s.setAttribute('class','sub');s.textContent=n.sub;g.appendChild(s);g.addEventListener('click',()=>{if(['cisco','mikrotik','fortigate'].includes(k)) setDevice(k)});ng.appendChild(g)});
      movePacket('client');
    };
    const run = cmd => {
      const x=cmd.trim().toLowerCase(); if(!x)return; echo(cmd);
      if(mode==='launcher'){
        if(x==='cisco'||x==='mikrotik'||x==='fortigate'){setDevice(x);return}
        if(x==='help'){log('cisco','nl3-g');log('mikrotik','nl3-g');log('fortigate','nl3-g');log('exit');return}
        if(x==='exit'){log('Already at LAB#.');return}
        log('Unknown device. Type help.','nl3-r');return;
      }
      if(x==='exit'){logout();return}
      if(x==='help'){devices[vendor].help.forEach(c=>log(esc(c),'nl3-g'));return}
      if(vendor==='cisco'){
        if(x==='show ip route'){log('C 10.10.10.0/24 connected, Vlan10');log('C 10.20.20.0/24 connected, Vlan20');log('O 10.30.30.0/24 via 10.10.10.2');log('S* 0.0.0.0/0 via 10.10.10.254');return}
        if(x==='show vlan brief'){log('10 CLIENTS active');log('20 SERVERS active');log('50 MGMT active');return}
        if(x==='show interfaces'){log('Gi0/1 up/up 1G WAN');log('Gi0/2 up/up access vlan 10');log('Gi0/24 up/up trunk');return}
        if(x==='configure terminal'||x==='conf t'){mode='config';prompt.textContent='CORE-R1(config)#';log('Enter configuration mode.','nl3-y');return}
        if(mode==='config'&&(x.startsWith('interface ')||x.startsWith('ip route ')||x.startsWith('vlan ')||x==='shutdown'||x==='no shutdown')){log('Command accepted in simulated state.','nl3-g');return}
        if(x.startsWith('ping ')){log('64 bytes from 10.20.20.25: icmp_seq=1 ttl=63 time=0.7 ms','nl3-g');log('1 packets transmitted, 1 received, 0% packet loss','nl3-g');return}
      }
      if(vendor==='mikrotik'){
        if(x==='/ip route print'){log('DAC 10.10.10.0/24 vlan10');log('DAC 10.20.20.0/24 vlan20');log('DAo 10.30.30.0/24 via 10.10.10.2');log('DA 0.0.0.0/0 via 10.10.10.254');return}
        if(x==='/interface print'){log('0 R ether1 WAN');log('1 R ether2 LAN');log('2 R ether3 SERVER');return}
        if(x==='/ip address print'){log('10.10.10.1/24 vlan10');log('10.20.20.1/24 vlan20');log('10.50.50.1/24 vlan50');return}
        if(x==='/ip firewall filter print'){log('0 accept established,related');log('1 accept tcp dst-port=443');log('2 drop src-address-list=blocked');return}
        if(x.startsWith('/ip route add ')){log('route added to simulated routing table.','nl3-g');return}
        if(x.startsWith('/ping ')){log('10.20.20.25 reply: time=0.8ms ttl=63','nl3-g');return}
      }
      if(vendor==='fortigate'){
        if(x==='get router info routing-table all'){log('C 10.10.10.0/24 port3');log('C 10.20.20.0/24 port4');log('S* 0.0.0.0/0 10.10.10.254');return}
        if(x==='show firewall policy'){log('edit 10');log('set name "LAN-to-DMZ"');log('set action accept');log('next');return}
        if(x==='get system status'){log('FortiGate-VM v7.4');log('Hostname: FG-EDGE');log('Operation mode: NAT');return}
        if(x.startsWith('config ')){mode='config';prompt.textContent='FG-EDGE (config) #';log('Entering configuration context.','nl3-y');return}
        if(x==='end' || x==='exit'){logout();return}
        if(x.startsWith('execute ping ')){log('64 bytes from 10.20.20.25: icmp_seq=1 ttl=63 time=0.7 ms','nl3-g');return}
      }
      log('% Unknown command. Type help.','nl3-r');
    };
    root.querySelectorAll('.nl3-device').forEach(b=>b.addEventListener('click',()=>setDevice(b.dataset.v)));
    root.querySelector('#nl3-form').addEventListener('submit',e=>{e.preventDefault();const cmd=input.value.trim();if(!cmd)return;history.push(cmd);historyIndex=history.length;run(cmd);input.value=''});
    input.addEventListener('keydown',e=>{if(e.key==='ArrowUp'){e.preventDefault();if(historyIndex>0){historyIndex--;input.value=history[historyIndex]}}else if(e.key==='ArrowDown'){e.preventDefault();if(historyIndex<history.length-1){historyIndex++;input.value=history[historyIndex]}else{historyIndex=history.length;input.value=''}}else if(e.key==='Tab'){e.preventDefault();const pref=input.value.trim().toLowerCase();const hit=(vendor?devices[vendor].help:['cisco','mikrotik','fortigate','help']).find(c=>c.toLowerCase().startsWith(pref)&&c.toLowerCase()!==pref);if(hit)input.value=hit}});
    renderMap(); logout();
    return true;
  };
  let tries=0; const timer=setInterval(()=>{tries++; if(mount()||tries>100) clearInterval(timer)},100);
})();
