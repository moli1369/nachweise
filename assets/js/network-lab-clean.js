(() => {
  const boot = () => {
    const host = document.querySelector('#network-game');
    if (!host || host.dataset.cleanLab === '1') return;
    host.dataset.cleanLab = '1';

    host.innerHTML = `
      <div class="clean-lab-shell">
        <div class="clean-lab-head">
          <div>
            <div class="clean-eyebrow">NETWORK OPERATIONS / MULTI-VENDOR LAB</div>
            <h3>Infrastructure Command Center</h3>
            <p>Explore a simulated enterprise network and operate Cisco IOS, MikroTik RouterOS or FortiGate from one terminal.</p>
          </div>
          <div class="clean-state"><span></span> SIMULATOR ONLINE</div>
        </div>

        <div class="clean-topology">
          <div class="clean-topology-head"><span>TOPOLOGY / FORWARDING PLANE</span><span>IPv4 · OSPF · VLAN · ACL · NAT</span></div>
          <svg viewBox="0 0 900 340" class="clean-svg" role="img" aria-label="Network topology with MikroTik, Cisco and FortiGate">
            <defs>
              <filter id="cleanGlow"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            </defs>
            <g class="clean-links">
              <path d="M100 170 H290"/><path d="M290 170 H450"/><path d="M450 170 H635"/><path d="M450 170 V75 H650"/><path d="M635 170 H800"/>
              <path class="flow" d="M100 170 H290"/><path class="flow" d="M290 170 H450"/><path class="flow" d="M450 170 H635"/>
            </g>
            <g class="clean-node" data-device="mikrotik" tabindex="0"><rect x="25" y="135" width="150" height="70" rx="16"/><text x="100" y="162">MIKROTIK</text><text x="100" y="182" class="sub">EDGE · ROUTEROS</text></g>
            <g class="clean-node" data-device="cisco" tabindex="0"><circle cx="370" cy="170" r="58"/><text x="370" y="166">CISCO CORE</text><text x="370" y="186" class="sub">IOS · OSPF · VLAN</text></g>
            <g class="clean-node" data-device="fortigate" tabindex="0"><rect x="545" y="135" width="180" height="70" rx="16"/><text x="635" y="162">FORTIGATE</text><text x="635" y="182" class="sub">SECURITY · NAT · POLICY</text></g>
            <g class="clean-node"><rect x="575" y="45" width="150" height="55" rx="14"/><text x="650" y="69">DMZ / SERVER</text><text x="650" y="86" class="sub">10.20.20.25</text></g>
            <g class="clean-node"><rect x="760" y="135" width="105" height="70" rx="16"/><text x="812" y="162">WAN</text><text x="812" y="182" class="sub">8.8.8.8</text></g>
            <circle class="clean-packet" cx="120" cy="170" r="5" filter="url(#cleanGlow)"/>
          </svg>
          <div class="clean-topology-foot"><span>● Packet flow active</span><span id="clean-active-device">No device session</span><span>Click a device or type its name below</span></div>
        </div>

        <div class="clean-terminal">
          <div class="clean-terminal-head">
            <div class="clean-dots"><i></i><i></i><i></i></div>
            <strong id="clean-terminal-title">NETWORK SHELL</strong>
            <span id="clean-terminal-status">LAB SESSION</span>
          </div>
          <div class="clean-terminal-body" id="clean-terminal-output"></div>
          <form id="clean-terminal-form" class="clean-command">
            <span id="clean-prompt">LAB#</span>
            <input id="clean-input" autocomplete="off" spellcheck="false" placeholder="Type cisco, mikrotik, fortigate or help …">
            <button type="submit">ENTER</button>
          </form>
          <div class="clean-terminal-help">Type <b>cisco</b>, <b>mikrotik</b> or <b>fortigate</b> → enter the device session · <b>exit</b> → return to LAB# · <b>help</b> → commands · <b>Tab</b> → autocomplete</div>
        </div>
      </div>`;

    const style = document.createElement('style');
    style.textContent = `
      .clean-lab-shell{border:1px solid rgba(66,199,255,.14);border-radius:22px;background:#02080e;overflow:hidden;box-shadow:0 30px 100px rgba(0,0,0,.28)}
      .clean-lab-head{display:flex;justify-content:space-between;gap:20px;align-items:center;padding:22px 24px;background:linear-gradient(145deg,#081b2a,#04101a);border-bottom:1px solid rgba(180,215,240,.09)}
      .clean-eyebrow{color:#42c7ff;font:600 .55rem var(--mono);letter-spacing:.16em}.clean-lab-head h3{margin:7px 0 4px;font-size:1.55rem}.clean-lab-head p{margin:0;color:#7891a2;max-width:720px;font-size:.78rem;line-height:1.5}.clean-state{white-space:nowrap;color:#79edbc;font:600 .55rem var(--mono);padding:9px 11px;border:1px solid rgba(121,237,188,.18);border-radius:999px;background:rgba(121,237,188,.04)}.clean-state span{display:inline-block;width:6px;height:6px;border-radius:50%;background:#79edbc;box-shadow:0 0 10px #79edbc;margin-right:6px}
      .clean-topology{position:relative;background:radial-gradient(circle at 50% 50%,rgba(66,199,255,.08),transparent 44%),#030b13}.clean-topology-head{display:flex;justify-content:space-between;gap:10px;padding:10px 15px;border-bottom:1px solid rgba(180,215,240,.07);color:#718a9c;font:600 .51rem var(--mono);letter-spacing:.1em}.clean-svg{display:block;width:100%;height:auto;min-height:330px;background-image:linear-gradient(rgba(66,199,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(66,199,255,.025) 1px,transparent 1px);background-size:32px 32px}.clean-links path{fill:none;stroke:rgba(66,199,255,.16);stroke-width:2}.clean-links .flow{stroke:#42c7ff;stroke-width:2.4;stroke-dasharray:3 15;animation:cleanFlow 2s linear infinite}.clean-node{cursor:pointer;outline:none}.clean-node rect,.clean-node circle{fill:#071522;stroke:rgba(66,199,255,.3);stroke-width:1.5;transition:.2s}.clean-node:hover rect,.clean-node:hover circle,.clean-node.active rect,.clean-node.active circle{stroke:#42c7ff;filter:drop-shadow(0 0 12px rgba(66,199,255,.35))}.clean-node text{fill:#e7f6fc;text-anchor:middle;font:600 10px var(--mono);letter-spacing:.08em}.clean-node .sub{fill:#668597;font:500 6.5px var(--mono);letter-spacing:.03em}.clean-packet{fill:#fff;filter:drop-shadow(0 0 8px rgba(255,255,255,.9));animation:cleanPacket 4.5s linear infinite}.clean-topology-foot{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;padding:10px 14px;border-top:1px solid rgba(180,215,240,.07);color:#607b8d;font:500 .5rem var(--mono)}.clean-topology-foot span:first-child{color:#79edbc}
      .clean-terminal{border-top:1px solid rgba(66,199,255,.12);background:#010508}.clean-terminal-head{display:flex;align-items:center;gap:10px;padding:9px 12px;background:#050d13;border-bottom:1px solid rgba(180,215,240,.07);font:600 .52rem var(--mono)}.clean-dots{display:flex;gap:5px;margin-right:5px}.clean-dots i{width:7px;height:7px;border-radius:50%;background:#39515e}.clean-terminal-head strong{color:#bcd2de}.clean-terminal-head span:last-child{margin-left:auto;color:#79edbc}.clean-terminal-body{min-height:245px;max-height:340px;overflow:auto;padding:14px 15px;color:#a9c0cd;font:500 .65rem/1.7 var(--mono)}.clean-line{margin:2px 0;white-space:pre-wrap}.clean-line.prompt{color:#42c7ff}.clean-line.ok{color:#79edbc}.clean-line.warn{color:#ffb478}.clean-line.err{color:#ff8793}.clean-command{display:flex;align-items:center;gap:8px;padding:10px 12px;border-top:1px solid rgba(180,215,240,.07);background:#030a10}.clean-command span{color:#42c7ff;font:600 .67rem var(--mono);white-space:nowrap}.clean-command input{flex:1;min-width:0;border:0;outline:0;background:transparent;color:#eef9ff;font:500 .67rem var(--mono)}.clean-command button{border:1px solid rgba(66,199,255,.24);border-radius:7px;padding:7px 10px;background:rgba(66,199,255,.06);color:#42c7ff;font:600 .55rem var(--mono);cursor:pointer}.clean-terminal-help{padding:9px 12px;border-top:1px solid rgba(180,215,240,.07);color:#526c7c;font:500 .49rem/1.5 var(--mono)}.clean-terminal-help b{color:#8db9ca}
      @keyframes cleanFlow{to{stroke-dashoffset:-72}}@keyframes cleanPacket{0%{cx:120px;cy:170px}28%{cx:370px;cy:170px}55%{cx:635px;cy:170px}78%{cx:812px;cy:170px}100%{cx:120px;cy:170px}}
      @media(max-width:700px){.clean-lab-head{flex-direction:column;align-items:flex-start;padding:18px}.clean-lab-head h3{font-size:1.25rem}.clean-state{font-size:.5rem}.clean-topology-head{font-size:.46rem}.clean-svg{min-height:250px}.clean-topology-foot{font-size:.45rem}.clean-terminal-body{min-height:220px;font-size:.58rem}.clean-command input,.clean-command span{font-size:.59rem}.clean-terminal-help{font-size:.45rem}}
    `;
    document.head.appendChild(style);

    const out = host.querySelector('#clean-terminal-output');
    const input = host.querySelector('#clean-input');
    const form = host.querySelector('#clean-terminal-form');
    const prompt = host.querySelector('#clean-prompt');
    const title = host.querySelector('#clean-terminal-title');
    const status = host.querySelector('#clean-terminal-status');
    const active = host.querySelector('#clean-active-device');
    const nodes = [...host.querySelectorAll('.clean-node[data-device]')];
    let device = null; let history=[]; let historyIndex=0; let mode='exec';

    const devices={
      cisco:{name:'Cisco IOS',prompt:'CORE-R1#',commands:['show ip route','show vlan brief','show interfaces','show access-lists','show ip ospf neighbor','ping 10.20.20.25','configure terminal']},
      mikrotik:{name:'MikroTik RouterOS',prompt:'[admin@MT-EDGE] >',commands:['/ip route print','/interface print','/ip address print','/ip firewall filter print','/interface bridge print','/ping 10.20.20.25']},
      fortigate:{name:'FortiGate',prompt:'FG-EDGE #',commands:['get system status','get router info routing-table all','show firewall policy','diagnose ip address list','execute ping 10.20.20.25','config firewall policy']}
    };
    const log=(text,cls='')=>{const d=document.createElement('div');d.className='clean-line '+cls;d.textContent=text;out.appendChild(d);out.scrollTop=out.scrollHeight};
    const echo=(cmd)=>log((prompt.textContent+' '+cmd),'prompt');
    const setDevice=(name)=>{
      device=name; mode='exec'; history=[]; historyIndex=0; const d=devices[name]; prompt.textContent=d.prompt; title.textContent=d.name.toUpperCase(); status.textContent='SESSION ACTIVE'; active.textContent=d.name+' · SESSION ACTIVE'; nodes.forEach(n=>n.classList.toggle('active',n.dataset.device===name)); log('Connected to '+d.name+'.','ok'); log('Type help for commands or exit to return to LAB#.',''); input.placeholder='Type a command…'; input.focus();
    };
    const exit=()=>{device=null;mode='exec';prompt.textContent='LAB#';title.textContent='NETWORK SHELL';status.textContent='LAB SESSION';active.textContent='No device session';nodes.forEach(n=>n.classList.remove('active'));log('Session closed. Returned to LAB#.','ok');input.placeholder='Type cisco, mikrotik, fortigate or help …';input.focus();};
    const help=()=>{
      if(!device){['cisco','mikrotik','fortigate','help','exit'].forEach(x=>log(x));return}
      devices[device].commands.forEach(x=>log(x)); log('exit');
    };
    const run=(raw)=>{
      const cmd=raw.trim(); if(!cmd)return; echo(cmd); const x=cmd.toLowerCase();
      if(!device){ if(['cisco','mikrotik','fortigate'].includes(x)){setDevice(x);return} if(x==='help'||x==='?'){help();return} if(x==='exit'){log('Already at LAB#.','warn');return} log('Unknown lab command. Type help.','err'); return; }
      if(x==='exit'){exit();return} if(x==='help'||x==='?'){help();return}
      if(device==='cisco'){
        if(x==='show ip route'){['C 10.10.10.0/24 connected, Vlan10','C 10.20.20.0/24 connected, Vlan20','O 10.30.30.0/24 via 10.10.10.2','S* 0.0.0.0/0 via 10.10.10.254'].forEach(v=>log(v));return}
        if(x==='show vlan brief'){['10  USERS       active','20  SERVERS     active','50  MANAGEMENT  active'].forEach(v=>log(v));return}
        if(x==='show interfaces'){['Gi0/1  up  up  1G  WAN','Gi0/2  up  up  access vlan 10','Gi0/9  up  up  access vlan 20','Gi0/24 up  up  trunk'].forEach(v=>log(v));return}
        if(x==='show access-lists'){['ACL-WEB permit tcp 10.10.10.0/24 host 10.20.20.25 eq 443','ACL-MGMT permit tcp 10.50.50.0/24 any eq 22'].forEach(v=>log(v));return}
        if(x==='show ip ospf neighbor'){log('10.10.10.2  FULL/ -  00:00:34  10.10.10.2  Gi0/1');return}
        if(x==='configure terminal'||x==='conf t'){mode='config';prompt.textContent='CORE-R1(config)#';log('Enter configuration commands, one per line.','ok');return}
        if(mode==='config' && (x.startsWith('ip route ')||x.startsWith('vlan ')||x.startsWith('interface ')||x==='shutdown'||x==='no shutdown')){log('Command accepted — simulated running configuration updated.','ok');return}
        if(x.startsWith('ping ')){log('Reply from 10.20.20.25: bytes=32 time<1ms TTL=63','ok');log('Success rate is 100 percent (1/1)','ok');return}
      }
      if(device==='mikrotik'){
        if(x==='/ip route print'){['DAC 10.10.10.0/24 vlan10','DAC 10.20.20.0/24 vlan20','DAo 10.30.30.0/24 10.10.10.2','DA 0.0.0.0/0 10.10.10.254'].forEach(v=>log(v));return}
        if(x==='/interface print'){['0 R ether1 WAN','1 R ether2 LAN','2 R ether3 SERVER','3 R bridge-lan'].forEach(v=>log(v));return}
        if(x==='/ip address print'){['10.10.10.1/24 vlan10','10.20.20.1/24 vlan20','10.50.50.1/24 vlan50'].forEach(v=>log(v));return}
        if(x==='/ip firewall filter print'){['0 accept established,related','1 accept tcp dst-port=443','2 drop src-address-list=blocked','3 drop invalid'].forEach(v=>log(v));return}
        if(x==='/interface bridge print'){['0 R name=bridge-lan protocol-mode=rstp vlan-filtering=yes'].forEach(v=>log(v));return}
        if(x.startsWith('/ip route add ')){log('Route added to simulated RouterOS state.','ok');return}
        if(x.startsWith('/ping ')){log('10.20.20.25 64  time=0.7ms','ok');return}
      }
      if(device==='fortigate'){
        if(x==='get system status'){['FortiGate-VM 7.4.x','Hostname: FG-EDGE','Operation Mode: NAT'].forEach(v=>log(v));return}
        if(x==='get router info routing-table all'){['C 10.10.10.0/24  port3','C 10.20.20.0/24  port4','S 10.30.30.0/24  10.10.10.2','S* 0.0.0.0/0  10.10.10.254'].forEach(v=>log(v));return}
        if(x==='show firewall policy'){['config firewall policy',' edit 10','  set name "LAN-to-DMZ"','  set action accept','  set service "HTTPS"',' next','end'].forEach(v=>log(v));return}
        if(x==='diagnose ip address list'){['10.10.10.1/24 port3','10.20.20.1/24 port4','10.50.50.1/24 port5'].forEach(v=>log(v));return}
        if(x.startsWith('config ')){mode='config';prompt.textContent='FG-EDGE (config) #';log('Entering configuration context.','ok');return}
        if(x==='end'){mode='exec';prompt.textContent=devices.fortigate.prompt;log('Leaving configuration context.','ok');return}
        if(x.startsWith('execute ping ')){log('64 bytes from 10.20.20.25: time=0.7 ms','ok');log('Success rate 100%','ok');return}
      }
      log('% Unknown command. Type help.','err');
    };
    nodes.forEach(n=>{const open=()=>setDevice(n.dataset.device);n.addEventListener('click',open);n.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}});});
    form.addEventListener('submit',e=>{e.preventDefault();const cmd=input.value; if(cmd){history.push(cmd);historyIndex=history.length;run(cmd);input.value='';}});
    input.addEventListener('keydown',e=>{
      if(e.key==='ArrowUp'){e.preventDefault();if(historyIndex>0){historyIndex--;input.value=history[historyIndex]}}
      else if(e.key==='ArrowDown'){e.preventDefault();if(historyIndex<history.length-1){historyIndex++;input.value=history[historyIndex]}else{historyIndex=history.length;input.value=''}}
      else if(e.key==='Tab'){e.preventDefault();const v=input.value.toLowerCase();const cmds=device?devices[device].commands:['cisco','mikrotik','fortigate','help'];const hit=cmds.find(x=>x.toLowerCase().startsWith(v)&&x.toLowerCase()!==v);if(hit)input.value=hit}
    });
    log('Network shell ready. Type help to begin.','ok');
    input.focus();
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
})();
