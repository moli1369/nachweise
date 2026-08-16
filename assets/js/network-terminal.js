(() => {
  const lab = document.querySelector('#network-game');
  if (!lab || document.querySelector('#router-cli')) return;

  const style = document.createElement('style');
  style.textContent = `
    .router-console{margin-top:.85rem;border:1px solid rgba(66,199,255,.16);border-radius:16px;overflow:hidden;background:#02070c;box-shadow:inset 0 1px rgba(255,255,255,.03),0 20px 70px rgba(0,0,0,.22)}
    .router-console-head{display:flex;justify-content:space-between;gap:1rem;align-items:center;padding:.78rem .9rem;border-bottom:1px solid var(--line);background:linear-gradient(90deg,rgba(66,199,255,.07),transparent);font:500 .58rem var(--mono);color:#7e96a8}
    .router-console-head>div:first-child{display:grid;grid-template-columns:auto 1fr;column-gap:.55rem;align-items:center}.router-console-head strong{color:#b8cad8;letter-spacing:.12em}.router-console-head small{grid-column:2;color:#587387;font-size:.5rem;margin-top:.12rem}.cli-dot{width:8px;height:8px;border-radius:50%;background:var(--green);box-shadow:0 0 12px rgba(111,229,174,.65)}.cli-device{display:flex;gap:.6rem;align-items:center}.cli-device span{padding:.28rem .45rem;border:1px solid var(--line);border-radius:6px}.cli-device .device-active{color:var(--cyan);border-color:rgba(66,199,255,.18)}
    .router-cli-screen{height:250px;overflow:auto;padding:1rem;background:radial-gradient(circle at 25% 10%,rgba(66,199,255,.045),transparent 30%),#02070c;color:#bacbd8;font:500 .68rem/1.65 var(--mono);white-space:pre-wrap}.cli-line{margin:.08rem 0}.cli-cmd{color:#c8e9fb}.cli-prompt{color:var(--cyan)}.cli-output{color:#91a6b6}.cli-ok{color:var(--green)}.cli-warn{color:#ffb37b}.cli-error{color:#ff8894}.cli-info{color:#82bfe0}
    .router-cli-form{display:flex;align-items:center;gap:.55rem;border-top:1px solid var(--line);padding:.65rem .75rem;background:#03090f}.router-prompt{color:var(--cyan);font:600 .68rem var(--mono);white-space:nowrap}.router-cli-form input{min-width:0;flex:1;border:0;outline:0;background:transparent;color:#ecf7ff;font:500 .68rem var(--mono)}.router-cli-form input::placeholder{color:#405869}.router-cli-form button{border:1px solid rgba(66,199,255,.22);border-radius:7px;padding:.38rem .58rem;background:rgba(66,199,255,.06);color:var(--cyan);font:600 .58rem var(--mono);cursor:pointer}.router-cli-form button:hover{background:rgba(66,199,255,.12)}
    .router-cli-help{display:flex;gap:.35rem;flex-wrap:wrap;align-items:center;padding:.55rem .75rem;border-top:1px solid var(--line);color:#587184;font:500 .52rem var(--mono)}.router-cli-help button{border:1px solid var(--line);border-radius:6px;background:rgba(255,255,255,.02);color:#8ba4b5;padding:.28rem .4rem;font:500 .52rem var(--mono);cursor:pointer}.router-cli-help button:hover{border-color:rgba(66,199,255,.3);color:var(--cyan)}
    @media(max-width:600px){.router-console-head{align-items:flex-start;flex-direction:column}.cli-device{align-self:flex-start}.router-cli-screen{height:230px;font-size:.61rem}.router-prompt{font-size:.61rem}.router-cli-form input{font-size:.61rem}}
  `;
  document.head.appendChild(style);

  const wrap = document.createElement('section');
  wrap.className = 'router-console';
  wrap.id = 'router-cli';
  wrap.innerHTML = `
    <div class="router-console-head">
      <div><span class="cli-dot"></span><strong>NETWORK DEVICE CLI</strong><small>RouterOS / Cisco IOS style command simulator · read-only lab with interactive state</small></div>
      <div class="cli-device"><span class="device-active">CORE-R1</span><span>10.10.10.1</span></div>
    </div>
    <div class="router-cli-screen" id="router-cli-screen" role="log" aria-live="polite"></div>
    <form class="router-cli-form" id="router-cli-form">
      <span class="router-prompt" id="router-prompt">CORE-R1#</span>
      <input id="router-cli-input" autocomplete="off" autocapitalize="none" spellcheck="false" aria-label="Network CLI command" placeholder="Type a command … e.g. show ip route">
      <button type="submit">RUN</button>
    </form>
    <div class="router-cli-help"><span>Try:</span>
      <button type="button" data-cli="help">help</button>
      <button type="button" data-cli="show ip route">show ip route</button>
      <button type="button" data-cli="show vlan brief">show vlan brief</button>
      <button type="button" data-cli="show interfaces">show interfaces</button>
      <button type="button" data-cli="show access-lists">show access-lists</button>
      <button type="button" data-cli="ping 10.20.20.25">ping 10.20.20.25</button>
      <button type="button" data-cli="traceroute 10.20.20.25">traceroute 10.20.20.25</button>
      <button type="button" data-cli="show cdp neighbors">show cdp neighbors</button>
    </div>`;
  const footer = lab.querySelector('.game-footer');
  footer ? lab.insertBefore(wrap, footer) : lab.appendChild(wrap);

  const out = wrap.querySelector('#router-cli-screen');
  const input = wrap.querySelector('#router-cli-input');
  const prompt = wrap.querySelector('#router-prompt');
  let mode = 'exec';
  let history = [];
  let historyIndex = -1;
  let configured = false;

  const write = (html='') => { const line=document.createElement('div'); line.className='cli-line'; line.innerHTML=html; out.appendChild(line); out.scrollTop=out.scrollHeight; };
  const cmd = (text) => `<span class="cli-prompt">${prompt.textContent}</span> <span class="cli-cmd">${text.replace(/&/g,'&amp;').replace(/</g,'&lt;')}</span>`;
  const text = (s, cls='cli-output') => `<span class="${cls}">${s.replace(/&/g,'&amp;').replace(/</g,'&lt;')}</span>`;

  function boot(){
    write(text('CORE-R1 virtual terminal · Network Operations Lab','cli-info'));
    write(text('Type "help" for available commands. Outputs are simulated for this portfolio lab.'));
    write('');
    write(cmd('show ip route'));
    write(text('C   10.10.10.0/24 is directly connected, Vlan10'));
    write(text('C   10.20.20.0/24 is directly connected, Vlan20'));
    write(text('O   10.30.30.0/24 [110/20] via 10.10.10.2, 00:12:44, Vlan10'));
    write('');
    write(text('Ready. Try ping or traceroute to inspect packet forwarding.','cli-ok'));
  }

  function output(command){
    const c = command.trim().toLowerCase().replace(/\s+/g,' ');
    write(cmd(command));
    if(!c){ return; }
    if(c==='help' || c==='?'){
      write(text('show ip route        routing table','cli-info'));
      write(text('show vlan brief      VLAN database','cli-info'));
      write(text('show interfaces      interface status / counters','cli-info'));
      write(text('show access-lists    firewall / ACL rules','cli-info'));
      write(text('show cdp neighbors   connected devices','cli-info'));
      write(text('ping <ip>             reachability test','cli-info'));
      write(text('traceroute <ip>       path discovery','cli-info'));
      write(text('configure terminal    enter configuration mode','cli-info'));
      write(text('exit                  leave current mode','cli-info'));
      return;
    }
    if(c==='show ip route'){
      write(text('Codes: C - connected, O - OSPF, S - static','cli-info')); 
      write(text('C 10.10.10.0/24  is directly connected, Vlan10'));
      write(text('C 10.20.20.0/24  is directly connected, Vlan20'));
      write(text('O 10.30.30.0/24  [110/20] via 10.10.10.2, Vlan10'));
      write(text('S* 0.0.0.0/0     via 10.10.10.254'));
      return;
    }
    if(c==='show vlan brief'){
      write(text('VLAN Name                             Status    Ports'));
      write(text('---- -------------------------------- --------- ----------------')); 
      write(text('1    default                          active    Gi0/1'));
      write(text('10   CLIENTS                          active    Gi0/2-8'));
      write(text('20   SERVERS                          active    Gi0/9-16'));
      write(text('50   MANAGEMENT                       active    Gi0/24'));
      return;
    }
    if(c==='show interfaces'){
      write(text('Gi0/1  up/up   1G   access vlan 1    input 0 drops'));
      write(text('Gi0/2  up/up   1G   access vlan 10   input 12.4k pkts'));
      write(text('Gi0/9  up/up   1G   access vlan 20   input 8.1k pkts'));
      write(text('Gi0/24 up/up   1G   trunk             native vlan 50'));
      return;
    }
    if(c==='show access-lists'){
      write(text('ACL EDGE-IN / 5 entries'));
      write(text('10 permit tcp 10.10.10.0/24 10.20.20.0/24 eq 443','cli-ok'));
      write(text('20 permit icmp 10.10.10.0/24 any','cli-ok'));
      write(text('30 deny ip any 10.20.20.0/24 log','cli-warn'));
      write(text('40 permit ip 10.10.10.0/24 any','cli-ok'));
      return;
    }
    if(c==='show cdp neighbors'){
      write(text('Device ID        Local Port     Platform        Port ID'));
      write(text('ACCESS-SW01       Gi0/24        Catalyst        Gi0/1'));
      write(text('EDGE-MT01         Gi0/1         RouterOS        ether1'));
      write(text('FW-01             Gi0/48        FortiGate       port2'));
      return;
    }
    if(c.startsWith('ping ')){
      const ip=c.slice(5).trim();
      if(ip==='10.20.20.25' || ip==='10.10.10.1'){
        write(text(`PING ${ip} 56(84) bytes of data.`));
        write(text(`64 bytes from ${ip}: icmp_seq=1 ttl=63 time=0.71 ms`,'cli-ok'));
        write(text('--- 100% packet loss: 0%','cli-ok'));
      } else {
        write(text(`Destination ${ip} unreachable from 10.10.10.1`,'cli-error'));
      }
      return;
    }
    if(c.startsWith('traceroute ') || c.startsWith('tracert ')){
      const ip=c.split(' ')[1];
      if(ip==='10.20.20.25'){
        write(text(`traceroute to ${ip}, 4 hops max`));
        write(text('1  10.10.10.1   0.7 ms'));
        write(text('2  10.10.10.2   1.3 ms'));
        write(text('3  10.20.20.1   1.8 ms'));
        write(text(`4  ${ip}          2.1 ms`,'cli-ok'));
      } else { write(text(`No route to ${ip}`,'cli-error')); }
      return;
    }
    if(c==='configure terminal' || c==='conf t'){
      mode='config'; prompt.textContent='CORE-R1(config)#'; configured=true;
      write(text('Enter configuration commands, one per line. End with CNTL/Z.','cli-info')); return;
    }
    if(c==='exit'){
      if(mode==='config'){mode='exec';prompt.textContent='CORE-R1#';write(text('Leaving configuration mode.','cli-info'));} else write(text('Already at exec mode.','cli-warn')); return;
    }
    if(mode==='config' && (c.startsWith('interface ') || c.startsWith('ip route ') || c.startsWith('router ospf'))){
      write(text(`${command}  → accepted in simulator state`,'cli-ok')); return;
    }
    write(text(`% Unknown command: ${command}. Type "help" for the supported lab commands.`,'cli-error'));
  }

  wrap.querySelector('#router-cli-form').addEventListener('submit', e => {
    e.preventDefault(); const value=input.value.trim(); if(!value)return; history.push(value); historyIndex=history.length; output(value); input.value='';
  });
  input.addEventListener('keydown', e=>{
    if(e.key==='ArrowUp'){e.preventDefault();if(historyIndex>0){historyIndex--;input.value=history[historyIndex];}}
    if(e.key==='ArrowDown'){e.preventDefault();if(historyIndex<history.length-1){historyIndex++;input.value=history[historyIndex];}else{historyIndex=history.length;input.value='';}}
    if(e.key==='Tab'){e.preventDefault();const v=input.value.trim().toLowerCase();const candidates=['show ip route','show vlan brief','show interfaces','show access-lists','show cdp neighbors','ping 10.20.20.25','traceroute 10.20.20.25','configure terminal'];const hit=candidates.find(x=>x.startsWith(v)&&x!==v);if(hit)input.value=hit;}
  });
  wrap.querySelectorAll('[data-cli]').forEach(b=>b.addEventListener('click',()=>{input.value=b.dataset.cli;input.focus();}));
  boot();
})();
