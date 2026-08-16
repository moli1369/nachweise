(() => {
  const start = () => {
    const lab = document.querySelector('#network-game');
    if (!lab) return false;
    const base = lab.querySelector('.vendor-lab');
    if (!base || lab.dataset.sessionLayer === 'ready') return true;
    lab.dataset.sessionLayer = 'ready';

    const existingScreen = base.querySelector('#vendor-screen');
    const existingInput = base.querySelector('#vendor-input');
    const existingPrompt = base.querySelector('#vendor-prompt');
    const existingForm = base.querySelector('#vendor-form');
    if (!existingScreen || !existingInput || !existingPrompt || !existingForm) return false;

    const style = document.createElement('style');
    style.textContent = `
      .vendor-lab.session-mode .vendor-tabs{display:none}
      .vendor-session-bar{display:flex;align-items:center;gap:.55rem;padding:.6rem .7rem;border-bottom:1px solid var(--line);background:linear-gradient(90deg,rgba(66,199,255,.08),transparent)}
      .vendor-session-dot{width:7px;height:7px;border-radius:50%;background:var(--green);box-shadow:0 0 11px rgba(111,229,174,.75);flex:0 0 auto}
      .vendor-session-title{font:600 .59rem var(--mono);color:#d8eaf3;letter-spacing:.04em}
      .vendor-session-sub{color:#637b8d;font:500 .5rem var(--mono)}
      .vendor-session-exit{margin-left:auto;border:1px solid var(--line);border-radius:7px;background:rgba(255,255,255,.02);color:#9cb2c0;padding:.35rem .52rem;font:600 .53rem var(--mono);cursor:pointer}
      .vendor-session-exit:hover{border-color:rgba(255,177,120,.45);color:#ffb478}
      .session-hidden{display:none!important}
      .vendor-lab .session-guide{border-left:1px solid var(--line);padding:.8rem;background:#03101a}
      .vendor-lab .session-guide h4{margin:0;color:#c9dce7;font-size:.72rem}
      .vendor-lab .session-guide p{margin:.3rem 0 .7rem;color:#698193;font:500 .55rem/1.45 var(--mono)}
      .vendor-lab .session-cmd{display:block;width:100%;text-align:left;margin:.38rem 0;padding:.42rem .5rem;border:1px solid var(--line);border-radius:7px;background:rgba(255,255,255,.02);color:#9fc2d4;font:500 .55rem var(--mono);cursor:pointer}
      .vendor-lab .session-cmd:hover{border-color:rgba(66,199,255,.3);color:var(--cyan)}
      @media(max-width:900px){.vendor-lab .session-guide{border-left:0;border-top:1px solid var(--line)}}
    `;
    document.head.appendChild(style);

    const top = base.querySelector('.vendor-tabs');
    const main = base.querySelector('.vendor-main');
    if (!top || !main) return false;

    const selector = document.createElement('div');
    selector.className = 'vendor-session-bar';
    selector.innerHTML = `<span class="vendor-session-dot"></span><span class="vendor-session-title" id="session-device">NO SESSION</span><span class="vendor-session-sub" id="session-mode-label">Type cisco, mikrotik or fortigate to connect</span><button type="button" class="vendor-session-exit" id="session-exit">exit</button>`;
    base.insertBefore(selector, base.firstChild);

    const guide = main.querySelector('.vendor-guide');
    if (guide) guide.classList.add('session-guide');

    const screen = existingScreen;
    const input = existingInput;
    const prompt = existingPrompt;
    const form = existingForm;
    const commands = {
      cisco: ['show ip route','show vlan brief','show interfaces','configure terminal'],
      mikrotik: ['/ip route print','/interface print','/ip address print','/ip firewall filter print'],
      fortigate: ['get router info routing-table all','show firewall policy','get system status','execute ping 10.20.20.25']
    };
    const info = {
      cisco: { label:'Cisco IOS · CORE-R1', prompt:'CORE-R1#', help:'Enter Cisco IOS style commands.', mode:'IOS CLI' },
      mikrotik: { label:'MikroTik RouterOS · MT-EDGE', prompt:'[admin@MT-EDGE] >', help:'Enter RouterOS slash-menu commands.', mode:'RouterOS CLI' },
      fortigate: { label:'FortiGate · FG-EDGE', prompt:'FG-EDGE #', help:'Enter FortiOS get/show/diagnose commands.', mode:'FortiOS CLI' }
    };

    let session = null;
    let config = false;
    let history = [];
    let historyIndex = 0;
    let routes = {
      cisco: new Map([['10.10.10.0/24','connected Vlan10'],['10.20.20.0/24','connected Vlan20'],['10.30.30.0/24','OSPF via 10.10.10.2'],['0.0.0.0/0','static via 10.10.10.254']]),
      mikrotik: new Map([['10.10.10.0/24','vlan10 connected'],['10.20.20.0/24','vlan20 connected'],['10.30.30.0/24','10.10.10.2'],['0.0.0.0/0','10.10.10.254']]),
      fortigate: new Map([['10.10.10.0/24','port3'],['10.20.20.0/24','port4'],['10.30.30.0/24','10.10.10.2'],['0.0.0.0/0','10.10.10.254']])
    };

    const esc = s => String(s).replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
    const write = (s, cls='') => { const d=document.createElement('div'); d.className=`vendor-line ${cls}`; d.innerHTML=s; screen.appendChild(d); screen.scrollTop=screen.scrollHeight; };
    const echo = c => write(`<span class="v-prompt">${esc(prompt.textContent)}</span> ${esc(c)}`);
    const updateVisual = (vendor, activeMode) => {
      const map = document.querySelector('.game-map-body');
      if (!map) return;
      const old = map.querySelector('.session-focus');
      if (old) old.remove();
      const focus = document.createElement('div');
      focus.className = 'session-focus';
      const label = vendor === 'cisco' ? 'CISCO CORE · CORE-R1' : vendor === 'mikrotik' ? 'MIKROTIK EDGE · MT-EDGE' : 'FORTIGATE SECURITY · FG-EDGE';
      focus.innerHTML = `<span class="session-focus-dot"></span><strong>${label}</strong><small>${activeMode ? 'CONFIGURATION ACTIVE' : 'SESSION ACTIVE'}</small>`;
      map.appendChild(focus);
    };
    const clearVisual = () => document.querySelector('.game-map-body .session-focus')?.remove();

    function setGuide(vendor){
      const h = guide?.querySelector('h4'); const p = guide?.querySelector('p'); const c = guide?.querySelector('#vendor-cmds');
      if (!h || !p || !c) return;
      h.textContent = `${info[vendor].label} · quick guide`;
      p.textContent = info[vendor].help;
      c.innerHTML = commands[vendor].map(cmd => `<button type="button" class="session-cmd" data-cmd="${esc(cmd)}">${esc(cmd)}</button>`).join('');
      c.querySelectorAll('[data-cmd]').forEach(b => b.addEventListener('click', () => { input.value=b.dataset.cmd; input.focus(); }));
    }

    const shellHelp = [
      'Device launcher:',
      '  cisco       enter Cisco IOS session',
      '  mikrotik    enter MikroTik RouterOS session',
      '  fortigate   enter FortiGate FortiOS session',
      '  exit        leave current device session',
      'Case-insensitive: CISCO / Cisco / cisco are identical.'
    ];

    function enter(vendor){
      session = vendor; config = false; history=[]; historyIndex=0;
      base.classList.add('session-mode');
      selector.querySelector('#session-device').textContent = info[vendor].label;
      selector.querySelector('#session-mode-label').textContent = info[vendor].mode;
      prompt.textContent = info[vendor].prompt;
      screen.innerHTML='';
      setGuide(vendor);
      write(`Connected to ${esc(info[vendor].label)}.`,'v-info');
      write('Type "help" for commands. Type "exit" to disconnect.','v-info');
      updateVisual(vendor, false);
      input.placeholder = `Type a ${vendor} command…`;
      input.focus();
    }

    function leave(){
      if (!session) return;
      write('Session closed. Returning to device launcher.','v-warn');
      session=null; config=false; history=[]; historyIndex=0;
      base.classList.remove('session-mode');
      selector.querySelector('#session-device').textContent='NO SESSION';
      selector.querySelector('#session-mode-label').textContent='Type cisco, mikrotik or fortigate to connect';
      prompt.textContent='LAB#';
      screen.innerHTML='';
      guide?.querySelector('h4') && (guide.querySelector('h4').textContent='Device launcher');
      guide?.querySelector('p') && (guide.querySelector('p').textContent='Choose a device by typing its name.');
      const c=guide?.querySelector('#vendor-cmds');
      if(c) c.innerHTML=['cisco','mikrotik','fortigate'].map(v=>`<button type="button" class="session-cmd" data-launch="${v}">${v}</button>`).join('');
      c?.querySelectorAll('[data-launch]').forEach(b=>b.addEventListener('click',()=>enter(b.dataset.launch)));
      input.placeholder='Type device name… cisco | mikrotik | fortigate';
      clearVisual();
      write(shellHelp.map(x=>esc(x)).join('<br>'),'v-info');
      input.value=''; input.focus();
    }

    function renderRoutes(vendor){
      routes[vendor].forEach((via, net) => write(esc(`${net.padEnd(18)} ${via}`)));
    }

    function run(command){
      const raw=command.trim(); const x=raw.toLowerCase();
      if(!x) return;
      echo(raw);

      if(!session){
        if(['cisco','mikrotik','fortigate'].includes(x)){enter(x);return;}
        if(x==='help'||x==='?'){write(shellHelp.map(esc).join('<br>'),'v-info');return;}
        write('% Unknown launcher command. Use cisco, mikrotik, fortigate or help.','v-error'); return;
      }
      if(x==='exit'||x==='quit'||x==='logout'){leave();return;}

      if(x==='help'||x==='?'){
        const common=['help','exit','clear'];
        const vendorHelp = session==='cisco' ? ['show ip route','show vlan brief','show interfaces','configure terminal','ping 10.20.20.25'] : session==='mikrotik' ? ['/ip route print','/interface print','/ip address print','/ip firewall filter print','/ip route add dst-address=10.40.40.0/24 gateway=10.10.10.254'] : ['get router info routing-table all','show firewall policy','get system status','diagnose ip address list','execute ping 10.20.20.25','config firewall policy'];
        [...vendorHelp,...common].forEach(c=>write(esc(c),'v-info'));return;
      }
      if(x==='clear'){screen.innerHTML='';return;}

      if(session==='cisco'){
        if(x==='show ip route'){renderRoutes('cisco');return;}
        if(x==='show vlan brief'){['10 CLIENTS active','20 SERVERS active','50 MANAGEMENT active'].forEach(v=>write(v));return;}
        if(x==='show interfaces'){['Gi0/1 up/up 1G WAN','Gi0/2 up/up access vlan 10','Gi0/9 up/up access vlan 20','Gi0/24 up/up trunk'].forEach(v=>write(v));return;}
        if(x==='configure terminal'||x==='conf t'){config=true;prompt.textContent='CORE-R1(config)#';updateVisual('cisco',true);write('Enter configuration mode.','v-info');return;}
        if(x==='end'){config=false;prompt.textContent='CORE-R1#';updateVisual('cisco',false);write('Leaving configuration mode.','v-info');return;}
        if(config && x.startsWith('ip route ')){const p=x.split(/\s+/);if(p.length>=4){routes.cisco.set(p[2],`static via ${p[3]}`);write('Static route installed in simulated routing table.','v-ok')}return;}
        if(config && x.startsWith('no ip route ')){const net=x.split(/\s+/)[3];routes.cisco.delete(net);write(`Route ${net} removed from simulated table.`,'v-ok');return;}
        if(x.startsWith('ping ')){write('64 bytes from 10.20.20.25: icmp_seq=1 ttl=63 time=0.7 ms','v-ok');return;}
      }

      if(session==='mikrotik'){
        if(x==='/ip route print'){renderRoutes('mikrotik');return;}
        if(x==='/interface print'){['0 R ether1 WAN','1 R ether2 LAN','2 R ether3 SERVER','3 R bridge-lan'].forEach(v=>write(v));return;}
        if(x==='/ip address print'){['10.10.10.1/24 vlan10','10.20.20.1/24 vlan20','10.50.50.1/24 vlan50'].forEach(v=>write(v));return;}
        if(x==='/ip firewall filter print'){['0 accept established,related','1 accept tcp dst-port=443','2 drop src-address-list=blocked','3 drop invalid'].forEach(v=>write(v));return;}
        if(x.startsWith('/ip route add ')){const m=x.match(/dst-address=([^\s]+).*gateway=([^\s]+)/);if(m){routes.mikrotik.set(m[1],m[2]);write(`route added: ${m[1]} via ${m[2]}`,'v-ok')}else write('expected dst-address=<net> gateway=<gw>','v-error');return;}
        if(x==='/system resource print'){['uptime: 7d14h','version: RouterOS 7.x','cpu-load: 12%'].forEach(v=>write(v));return;}
      }

      if(session==='fortigate'){
        if(x==='get router info routing-table all'){renderRoutes('fortigate');return;}
        if(x==='show firewall policy'){['edit 10','set name "LAN-to-DMZ"','set srcintf "port3"','set dstintf "port4"','set action accept','next'].forEach(v=>write(v));return;}
        if(x==='get system status'){['FortiGate-VM v7.4','Hostname: FG-EDGE','Operation mode: NAT'].forEach(v=>write(v));return;}
        if(x==='diagnose ip address list'){['10.10.10.1/24 port3','10.20.20.1/24 port4','10.50.50.1/24 port5'].forEach(v=>write(v));return;}
        if(x.startsWith('config ')){config=true;prompt.textContent='FG-EDGE (config) #';updateVisual('fortigate',true);write('Entering configuration context.','v-info');return;}
        if(x==='end'){config=false;prompt.textContent='FG-EDGE #';updateVisual('fortigate',false);write('Leaving configuration context.','v-info');return;}
        if(x.startsWith('execute ping ')){write('64 bytes from 10.20.20.25: icmp_seq=1 ttl=63 time=0.6 ms','v-ok');return;}
      }

      write('% Unknown or unsupported command for this session. Type help.','v-error');
    }

    selector.querySelector('#session-exit').addEventListener('click', leave);
    form.onsubmit = e => { e.preventDefault(); const v=input.value.trim(); if(!v) return; history.push(v); historyIndex=history.length; run(v); input.value=''; };
    input.onkeydown = e => {
      if(e.key==='ArrowUp'){e.preventDefault();if(historyIndex>0){historyIndex--;input.value=history[historyIndex]}}
      else if(e.key==='ArrowDown'){e.preventDefault();if(historyIndex<history.length-1){historyIndex++;input.value=history[historyIndex]}else{historyIndex=history.length;input.value=''}}
      else if(e.key==='Tab'){e.preventDefault();const v=input.value.trim().toLowerCase();const baseCommands=session?([...commands[session],'help','exit','clear']):['cisco','mikrotik','fortigate','help'];const hit=baseCommands.find(c=>c.toLowerCase().startsWith(v)&&c.toLowerCase()!==v);if(hit)input.value=hit}
    };

    base.querySelectorAll('.vendor-tab').forEach(b => b.classList.add('session-hidden'));
    base.querySelector('.vendor-help')?.classList.add('session-hidden');
    leave();
    return true;
  };

  let n=0;
  const timer=setInterval(()=>{n++;if(start()||n>80)clearInterval(timer)},150);
})();
