(() => {
  const lab = document.querySelector('#network-game');
  if (!lab || document.querySelector('#router-cli')) return;

  const style = document.createElement('style');
  style.textContent = `
    .router-console{margin-top:.85rem;border:1px solid rgba(66,199,255,.16);border-radius:16px;overflow:hidden;background:#02070c;box-shadow:inset 0 1px rgba(255,255,255,.03),0 20px 70px rgba(0,0,0,.22)}
    .router-console-head{display:flex;justify-content:space-between;gap:1rem;align-items:center;padding:.78rem .9rem;border-bottom:1px solid var(--line);background:linear-gradient(90deg,rgba(66,199,255,.07),transparent);font:500 .58rem var(--mono);color:#7e96a8}
    .router-console-head>div:first-child{display:grid;grid-template-columns:auto 1fr;column-gap:.55rem;align-items:center}.router-console-head strong{color:#b8cad8;letter-spacing:.12em}.router-console-head small{grid-column:2;color:#587387;font-size:.5rem;margin-top:.12rem}.cli-dot{width:8px;height:8px;border-radius:50%;background:var(--green);box-shadow:0 0 12px rgba(111,229,174,.65)}.cli-device{display:flex;gap:.6rem;align-items:center}.cli-device span{padding:.28rem .45rem;border:1px solid var(--line);border-radius:6px}.cli-device .device-active{color:var(--cyan);border-color:rgba(66,199,255,.18)}.router-cli-screen{height:250px;overflow:auto;padding:1rem;background:radial-gradient(circle at 25% 10%,rgba(66,199,255,.045),transparent 30%),#02070c;color:#bacbd8;font:500 .68rem/1.65 var(--mono);white-space:pre-wrap}.cli-line{margin:.08rem 0}.cli-cmd{color:#c8e9fb}.cli-prompt{color:var(--cyan)}.cli-output{color:#91a6b6}.cli-ok{color:#79edbc}.cli-warn{color:#ffb37b}.cli-error{color:#ff8894}.cli-info{color:#82bfe0}.router-cli-form{display:flex;align-items:center;gap:.55rem;border-top:1px solid var(--line);padding:.65rem .75rem;background:#03090f}.router-prompt{color:var(--cyan);font:600 .68rem var(--mono);white-space:nowrap}.router-cli-form input{min-width:0;flex:1;border:0;outline:0;background:transparent;color:#ecf7ff;font:500 .68rem var(--mono)}.router-cli-form input::placeholder{color:#405869}.router-cli-form button{border:1px solid rgba(66,199,255,.22);border-radius:7px;padding:.38rem .58rem;background:rgba(66,199,255,.06);color:var(--cyan);font:600 .58rem var(--mono);cursor:pointer}.router-cli-form button:hover{background:rgba(66,199,255,.12)}.router-cli-help{display:flex;gap:.35rem;flex-wrap:wrap;align-items:center;padding:.55rem .75rem;border-top:1px solid var(--line);color:#587184;font:500 .52rem var(--mono)}.router-cli-help button{border:1px solid var(--line);border-radius:6px;background:rgba(255,255,255,.02);color:#8ba4b5;padding:.28rem .4rem;font:500 .52rem var(--mono);cursor:pointer}.router-cli-help button:hover{border-color:rgba(66,199,255,.3);color:var(--cyan)}.router-cli-help .hint{color:#9fb5c5;margin-right:.15rem}.router-cli-help .tip{opacity:.7}@media(max-width:600px){.router-console-head{align-items:flex-start;flex-direction:column}.cli-device{align-self:flex-start}.router-cli-screen{height:230px;font-size:.61rem}.router-prompt{font-size:.61rem}.router-cli-form input{font-size:.61rem}}
  `;
  document.head.appendChild(style);

  const wrap = document.createElement('section');
  wrap.className='router-console'; wrap.id='router-cli';
  wrap.innerHTML=`<div class="router-console-head"><div><span class="cli-dot"></span><strong>NETWORK DEVICE CLI</strong><small>RouterOS / Cisco IOS style command simulator · interactive training shell</small></div><div class="cli-device"><span class="device-active">CORE-R1</span><span>10.10.10.1</span></div></div><div class="router-cli-screen" id="router-cli-screen" role="log" aria-live="polite"></div><form class="router-cli-form" id="router-cli-form"><span class="router-prompt" id="router-prompt">CORE-R1#</span><input id="router-cli-input" autocomplete="off" autocapitalize="none" spellcheck="false" aria-label="Network CLI command" placeholder="Type a command … e.g. show ip route"><button type="submit">RUN</button></form><div class="router-cli-help"><span class="hint">HELP:</span><button type="button" data-cli="help">help</button><button type="button" data-cli="show ip route">show ip route</button><button type="button" data-cli="show vlan brief">show vlan brief</button><button type="button" data-cli="show interfaces">show interfaces</button><button type="button" data-cli="show access-lists">show access-lists</button><button type="button" data-cli="ping 10.20.20.25">ping 10.20.20.25</button><button type="button" data-cli="traceroute 10.20.20.25">traceroute 10.20.20.25</button><button type="button" data-cli="show cdp neighbors">show cdp neighbors</button><span class="tip">Tab = autocomplete · ↑↓ = history</span></div>`;
  const footer=lab.querySelector('.game-footer'); footer?lab.insertBefore(wrap,footer):lab.appendChild(wrap);
  const out=wrap.querySelector('#router-cli-screen'),input=wrap.querySelector('#router-cli-input'),prompt=wrap.querySelector('#router-prompt');

  let mode='exec';
  let configDepth=0;
  let history=[];
  let historyIndex=-1;
  const state={routes:new Map([['10.10.10.0/24','connected, Vlan10'],['10.20.20.0/24','connected, Vlan20'],['10.30.30.0/24','OSPF via 10.10.10.2'],['0.0.0.0/0','static via 10.10.10.254']]),vlans:new Map([['10','CLIENTS'],['20','SERVERS'],['50','MANAGEMENT']]),interfaces:new Map([['Gi0/1',{status:'up/up',mode:'access',vlan:'1'}],['Gi0/2',{status:'up/up',mode:'access',vlan:'10'}],['Gi0/9',{status:'up/up',mode:'access',vlan:'20'}],['Gi0/24',{status:'up/up',mode:'trunk',vlan:'50'}]),acl:true};

  const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const write=(html='')=>{const line=document.createElement('div');line.className='cli-line';line.innerHTML=html;out.appendChild(line);out.scrollTop=out.scrollHeight};
  const promptText=()=>mode==='config'?`CORE-R1(config${configDepth?'...':''})#`:'CORE-R1#';
  const show=(s,cls='cli-output')=>`<span class="${cls}">${esc(s)}</span>`;
  const echo=s=>write(`<span class="cli-prompt">${esc(promptText())}</span> <span class="cli-cmd">${esc(s)}</span>`);
  const syncPrompt=()=>{prompt.textContent=promptText()};

  function printRoutes(){
    write(show('Codes: C - connected, O - OSPF, S - static','cli-info'));
    state.routes.forEach((via,net)=>{let code=via.startsWith('connected')?'C':via.startsWith('OSPF')?'O':'S*';write(show(`${code.padEnd(3)} ${net.padEnd(17)} ${via}`))});
  }
  function printVlans(){
    write(show('VLAN  Name                 Status    Ports','cli-info')); write(show('----  -------------------  --------  ----------------','cli-info'));
    state.vlans.forEach((name,id)=>write(show(`${id.padEnd(4)}  ${name.padEnd(19)}  active    ${id==='10'?'Gi0/2-8':id==='20'?'Gi0/9-16':'Gi0/24'}`)));
  }
  function printInterfaces(){state.interfaces.forEach((v,k)=>write(show(`${k.padEnd(6)} ${v.status.padEnd(7)} 1G   ${v.mode.padEnd(6)} vlan ${v.vlan}`)));}
  function printAcl(){
    write(show(`ACL EDGE-IN / ${state.acl?5:0} entries`,'cli-info'));
    if(!state.acl){write(show('No ACL entries configured.','cli-warn'));return;}
    write(show('10 permit tcp 10.10.10.0/24 10.20.20.0/24 eq 443','cli-ok'));
    write(show('20 permit icmp 10.10.10.0/24 any','cli-ok'));
    write(show('30 deny ip any 10.20.20.0/24 log','cli-warn'));
    write(show('40 permit ip 10.10.10.0/24 any','cli-ok'));
  }

  function run(command){
    const raw=command.trim(); const c=raw.toLowerCase().replace(/\s+/g,' '); echo(raw); if(!c)return;
    if(c==='help'||c==='?'){[
      'show ip route        routing table','show vlan brief      VLAN database','show interfaces      interface status / counters','show access-lists    firewall / ACL rules','show cdp neighbors   connected devices','ping <ip>             reachability test','traceroute <ip>       path discovery','configure terminal    enter configuration mode','interface <name>      select interface','ip route <net> <gw>   add static route','no ip route <net>     remove static route','vlan <id>             create VLAN in config mode','name <text>           name current VLAN','switchport access vlan <id>  assign access VLAN','shutdown / no shutdown      interface state','clear                 clear terminal','exit                  leave current mode'
    ].forEach(x=>write(show(x,'cli-info'))); return;}
    if(c==='clear'){out.innerHTML='';return;}
    if(c==='show ip route'||c==='show route'){printRoutes();return;}
    if(c==='show vlan brief'){printVlans();return;}
    if(c==='show interfaces'){printInterfaces();return;}
    if(c==='show access-lists'||c==='show access-list'){printAcl();return;}
    if(c==='show cdp neighbors'){['Device ID        Local Port     Platform        Port ID','ACCESS-SW01       Gi0/24        Catalyst        Gi0/1','EDGE-MT01         Gi0/1         RouterOS        ether1','FW-01             Gi0/48        FortiGate       port2'].forEach((x,i)=>write(show(x,i===0?'cli-info':'cli-output')));return;}
    if(c.startsWith('ping ')){const ip=c.slice(5).trim();if(['10.20.20.25','10.10.10.1','10.20.20.1'].includes(ip)){write(show(`PING ${ip} 56(84) bytes of data.`));write(show(`64 bytes from ${ip}: icmp_seq=1 ttl=63 time=0.71 ms`,'cli-ok'));write(show('--- 100% packet loss: 0%','cli-ok'))}else write(show(`Destination ${ip} unreachable from 10.10.10.1`,'cli-error'));return;}
    if(c.startsWith('traceroute ')||c.startsWith('tracert ')){const ip=c.split(' ')[1];if(ip==='10.20.20.25'){['traceroute to 10.20.20.25, 4 hops max','1  10.10.10.1   0.7 ms','2  10.10.10.2   1.3 ms','3  10.20.20.1   1.8 ms','4  10.20.20.25  2.1 ms'].forEach((x,i)=>write(show(x,i===4?'cli-ok':'cli-output')))}else write(show(`No route to ${ip}`,'cli-error'));return;}
    if(c==='configure terminal'||c==='conf t'){mode='config';configDepth=0;syncPrompt();write(show('Enter configuration commands, one per line. Type exit to return to exec mode.','cli-info'));return;}
    if(c==='exit'){if(configDepth>0){configDepth=0;syncPrompt();write(show('Leaving sub-configuration mode.','cli-info'))}else if(mode==='config'){mode='exec';syncPrompt();write(show('Leaving configuration mode.','cli-info'))}else write(show('Already at exec mode.','cli-warn'));return;}
    if(mode!=='config'){write(show(`% Unknown command: ${raw}. Type "help" for supported commands.`,'cli-error'));return;}
    if(/^interface\s+/i.test(raw)){configDepth=1;syncPrompt();write(show(`Entering interface ${raw.replace(/^interface\s+/i,'')}.`,'cli-info'));return;}
    if(/^router ospf\s+/i.test(raw)){configDepth=1;syncPrompt();write(show(`Entering OSPF configuration ${raw}.`,'cli-info'));return;}
    if(/^vlan\s+\d+$/i.test(raw)){const id=raw.split(/\s+/)[1];state.vlans.set(id,'VLAN'+id);configDepth=1;syncPrompt();write(show(`VLAN ${id} created. Use "name <text>" to label it.`,'cli-ok'));return;}
    if(/^name\s+/i.test(raw)&&state.vlans.size){const id=[...state.vlans.keys()].slice(-1)[0];state.vlans.set(id,raw.replace(/^name\s+/i,''));write(show(`VLAN ${id} named ${state.vlans.get(id)}.`,'cli-ok'));return;}
    if(/^ip route\s+/i.test(raw)){const parts=raw.split(/\s+/);if(parts.length>=4){const net=parts[2],gw=parts[3];state.routes.set(net,`static via ${gw}`);write(show(`% Static route ${net} via ${gw} installed.`,'cli-ok'))}else write(show('% Invalid input: ip route <network> <gateway>','cli-error'));return;}
    if(/^no ip route\s+/i.test(raw)){const net=raw.split(/\s+/)[3];if(state.routes.delete(net))write(show(`% Removed route ${net}.`,'cli-ok'));else write(show(`% Route ${net} not found.`,'cli-warn'));return;}
    if(/^switchport access vlan\s+\d+$/i.test(raw)){const id=raw.split(/\s+/).slice(-1)[0];const iface='Gi0/2';state.interfaces.get(iface).vlan=id;write(show(`Interface ${iface} access VLAN set to ${id}.`,'cli-ok'));return;}
    if(c==='shutdown'){write(show('Interface administratively down.','cli-warn'));return;}
    if(c==='no shutdown'){write(show('Interface administratively up.','cli-ok'));return;}
    write(show(`% Accepted configuration command: ${raw}`,'cli-ok'));
  }

  write(show('CORE-R1 virtual terminal · Network Operations Lab','cli-info'));write(show('This is a learning simulator. Type "help" to see commands. Tab completes commands; ↑↓ recalls history.'));write('');write(show('Ready. Try: show ip route','cli-ok'));
  wrap.querySelector('#router-cli-form').addEventListener('submit',e=>{e.preventDefault();const v=input.value.trim();if(!v)return;history.push(v);historyIndex=history.length;run(v);input.value='';});
  input.addEventListener('keydown',e=>{if(e.key==='ArrowUp'){e.preventDefault();if(historyIndex>0){historyIndex--;input.value=history[historyIndex]}}if(e.key==='ArrowDown'){e.preventDefault();if(historyIndex<history.length-1){historyIndex++;input.value=history[historyIndex]}else{historyIndex=history.length;input.value=''}}if(e.key==='Tab'){e.preventDefault();const v=input.value.trim().toLowerCase();const candidates=['show ip route','show vlan brief','show interfaces','show access-lists','show cdp neighbors','ping 10.20.20.25','traceroute 10.20.20.25','configure terminal','interface gigabitEthernet0/1','ip route 10.40.40.0/24 10.10.10.254','no ip route 10.40.40.0/24','vlan 30','switchport access vlan 30','shutdown','no shutdown'];const hit=candidates.find(x=>x.startsWith(v)&&x!==v);if(hit)input.value=hit}});
  wrap.querySelectorAll('[data-cli]').forEach(b=>b.addEventListener('click',()=>{input.value=b.dataset.cli;input.focus()}));
})();
