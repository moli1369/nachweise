(() => {
  const lab = document.querySelector('#network-game');
  if (!lab) return;

  const style = document.createElement('style');
  style.textContent = `
    .network-lab .game-topbar{position:relative;overflow:hidden;background:linear-gradient(135deg,rgba(8,24,39,.98),rgba(3,10,18,.98));}
    .network-lab .game-topbar:after{content:"";position:absolute;inset:auto -20% -70% -20%;height:140px;background:radial-gradient(circle,rgba(66,199,255,.11),transparent 62%);pointer-events:none}
    .network-lab .game-map-body{position:relative;min-height:470px;background:radial-gradient(circle at 50% 48%,rgba(66,199,255,.09),transparent 38%),#02070d;overflow:hidden}
    .network-lab .game-map-body:before{content:"";position:absolute;inset:0;background-image:linear-gradient(rgba(66,199,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(66,199,255,.035) 1px,transparent 1px);background-size:28px 28px;pointer-events:none}
    .lab-svg{position:absolute;inset:0;width:100%;height:100%;display:block}
    .lab-link{fill:none;stroke:rgba(66,199,255,.17);stroke-width:1.5;stroke-dasharray:3 9;animation:labflow 2.4s linear infinite}
    .lab-link.active{stroke:#42c7ff;stroke-width:2.4;stroke-dasharray:8 7;filter:drop-shadow(0 0 7px rgba(66,199,255,.55))}
    .lab-link.done{stroke:#79edbc;stroke-width:2.4;stroke-dasharray:8 7;filter:drop-shadow(0 0 7px rgba(121,237,188,.45))}
    .lab-node{cursor:pointer}
    .lab-node rect,.lab-node circle{fill:#081723;stroke:rgba(66,199,255,.3);stroke-width:1.4;transition:.2s}
    .lab-node:hover rect,.lab-node:hover circle,.lab-node.active rect,.lab-node.active circle{stroke:#42c7ff;filter:drop-shadow(0 0 12px rgba(66,199,255,.35))}
    .lab-node.target rect,.lab-node.target circle{stroke:#ffb478;filter:drop-shadow(0 0 11px rgba(255,180,120,.28))}
    .lab-node.success rect,.lab-node.success circle{stroke:#79edbc;filter:drop-shadow(0 0 11px rgba(121,237,188,.28))}
    .lab-node text{fill:#e5f4fb;text-anchor:middle;font-family:var(--mono);font-weight:600;letter-spacing:.08em;font-size:9px;pointer-events:none}
    .lab-node .sub{fill:#638398;font-size:5.8px;font-weight:500;letter-spacing:.04em}
    .lab-node .ip{fill:#3ebce8;font-size:5.2px;font-weight:500}
    .packet-dot{fill:#fff;filter:drop-shadow(0 0 8px rgba(255,255,255,.95));transition:cx .6s ease,cy .6s ease}
    .packet-trail{fill:none;stroke:rgba(255,255,255,.32);stroke-width:1.2;stroke-dasharray:2 7}
    .map-status{position:absolute;left:18px;right:18px;bottom:16px;display:flex;justify-content:space-between;align-items:center;gap:10px;padding:10px 12px;border:1px solid rgba(180,215,240,.1);border-radius:12px;background:rgba(1,8,14,.72);backdrop-filter:blur(8px);font:500 .55rem var(--mono);color:#7692a4}
    .map-status strong{color:#d8edf6}.map-status .ok{color:#79edbc}.map-status .warn{color:#ffb478}
    .game-choices{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}
    .game-hop{width:100%;padding:10px 11px;border:1px solid var(--line);border-radius:10px;background:rgba(255,255,255,.02);color:#acc3d1;text-align:left;cursor:pointer;font:600 .58rem var(--mono);transition:.2s}
    .game-hop:hover{border-color:rgba(66,199,255,.45);background:rgba(66,199,255,.06);color:#eefaff;transform:translateY(-1px)}
    .game-hop .small{display:block;margin-top:3px;color:#5f7a8c;font-weight:500;font-size:.48rem}
    .game-hop.correct{border-color:rgba(121,237,188,.45);background:rgba(121,237,188,.06);color:#79edbc}
    .game-hop.wrong{border-color:rgba(255,135,147,.45);background:rgba(255,135,147,.05);color:#ff8793}
    .packet-card{box-shadow:inset 0 1px 0 rgba(255,255,255,.025)}
    @keyframes labflow{to{stroke-dashoffset:-48}}
    @media(max-width:800px){.network-lab .game-map-body{min-height:390px}.game-choices{grid-template-columns:1fr}.map-status{font-size:.48rem;bottom:10px;left:10px;right:10px}}
    @media(max-width:520px){.network-lab .game-map-body{min-height:330px}.lab-node text{font-size:7px}.lab-node .sub{font-size:4.8px}.lab-node .ip{font-size:4.4px}.map-status{padding:8px 9px}.network-lab .game-topbar{flex-wrap:wrap}}
  `;
  document.head.appendChild(style);

  const scenarios = [
    {title:'Client → DMZ',src:'10.10.10.25',dst:'10.20.20.25',vlan:'10',proto:'TCP/443',policy:'ALLOW · WEB',path:['client','cisco','fortigate','server']},
    {title:'Server → WAN',src:'10.20.20.25',dst:'8.8.8.8',vlan:'20',proto:'ICMP',policy:'NAT · OUTBOUND',path:['server','fortigate','cisco','mikrotik','wan']},
    {title:'Management → Edge',src:'10.50.50.15',dst:'10.10.10.2',vlan:'50',proto:'SSH/22',policy:'ALLOW · MGMT',path:['mgmt','cisco','mikrotik']}
  ];
  const nodes = {
    client:{x:90,y:245,w:118,h:62,label:'CLIENT VLAN 10',sub:'10.10.10.25',type:'rect'},
    mgmt:{x:90,y:95,w:118,h:62,label:'MGMT VLAN 50',sub:'10.50.50.15',type:'rect'},
    cisco:{x:350,y:170,r:52,label:'CISCO CORE',sub:'OSPF · L3',type:'circle'},
    fortigate:{x:535,y:85,w:132,h:62,label:'FORTIGATE',sub:'POLICY · NAT',type:'rect'},
    mikrotik:{x:535,y:255,w:132,h:62,label:'MIKROTIK',sub:'EDGE · WAN',type:'rect'},
    server:{x:665,y:170,w:110,h:62,label:'DMZ SERVER',sub:'10.20.20.25',type:'rect'},
    wan:{x:700,y:305,r:30,label:'WAN',sub:'8.8.8.8',type:'circle'}
  };
  const edges = [
    ['client','cisco'],['mgmt','cisco'],['cisco','fortigate'],['cisco','mikrotik'],['fortigate','server'],['fortigate','mikrotik'],['mikrotik','wan']
  ];
  let scenarioIndex=0, step=0, score=0, mistakes=0;

  const q = s => s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const c = (tag, cls) => { const el=document.createElementNS('http://www.w3.org/2000/svg',tag); if(cls) el.setAttribute('class',cls); return el; };
  const point = key => { const n=nodes[key]; return {x:n.x,y:n.y}; };

  function buildMap(){
    const host=lab.querySelector('.game-map-body');
    if(!host)return;
    host.querySelector('.lab-svg')?.remove();
    host.querySelector('.map-status')?.remove();
    const svg=c('svg','lab-svg');svg.setAttribute('viewBox','0 0 820 350');svg.setAttribute('preserveAspectRatio','xMidYMid meet');svg.setAttribute('role','img');svg.setAttribute('aria-label','Interactive network topology');
    const linkLayer=c('g');
    edges.forEach(([a,b],i)=>{const pa=point(a),pb=point(b),path=c('path','lab-link');path.dataset.edge=`${a}-${b}`;path.setAttribute('d',`M ${pa.x} ${pa.y} L ${pb.x} ${pb.y}`);path.style.animationDelay=`${i*.25}s`;linkLayer.appendChild(path)});
    svg.appendChild(linkLayer);
    const trail=c('path','packet-trail');trail.setAttribute('d','M90 245 L350 170 L535 85 L665 170');svg.appendChild(trail);
    const packet=c('circle','packet-dot');packet.id='lab-packet';packet.setAttribute('r','5');packet.setAttribute('cx',nodes.client.x);packet.setAttribute('cy',nodes.client.y);svg.appendChild(packet);
    Object.entries(nodes).forEach(([key,n])=>{
      const g=c('g','lab-node');g.dataset.node=key;
      if(key===nodes.client || key===nodes.mgmt || key===nodes.fortigate || key===nodes.mikrotik || key===nodes.server){const r=c('rect');r.setAttribute('x',n.x-n.w/2);r.setAttribute('y',n.y-n.h/2);r.setAttribute('width',n.w);r.setAttribute('height',n.h);r.setAttribute('rx','14');g.appendChild(r)}else{const circle=c('circle');circle.setAttribute('cx',n.x);circle.setAttribute('cy',n.y);circle.setAttribute('r',n.r);g.appendChild(circle)}
      const t=c('text');t.setAttribute('x',n.x);t.setAttribute('y',n.y-2);t.textContent=n.label;g.appendChild(t);
      const s=c('text','sub');s.setAttribute('x',n.x);s.setAttribute('y',n.y+13);s.textContent=n.sub;g.appendChild(s);
      g.addEventListener('click',()=>chooseNode(key));svg.appendChild(g);
    });
    host.appendChild(svg);
    const status=document.createElement('div');status.className='map-status';status.innerHTML='<span>FORWARDING PLANE · <strong id="map-step">Awaiting packet</strong></span><span id="map-health" class="ok">● SIMULATOR READY</span>';host.appendChild(status);
  }

  function setMapState(active,next,done=false){
    lab.querySelectorAll('.lab-node').forEach(n=>n.classList.remove('active','target','success'));
    if(active)lab.querySelector(`[data-node="${active}"]`)?.classList.add('active');
    if(next)lab.querySelector(`[data-node="${next}"]`)?.classList.add(done?'success':'target');
    lab.querySelectorAll('.lab-link').forEach(l=>l.classList.remove('active','done'));
    if(active && next){const key=`${active}-${next}`,rev=`${next}-${active}`;lab.querySelector(`[data-edge="${key}"]`)?.classList.add(done?'done':'active');lab.querySelector(`[data-edge="${rev}"]`)?.classList.add(done?'done':'active')}
  }

  function movePacket(to){const n=nodes[to];const p=lab.querySelector('#lab-packet');if(p){p.setAttribute('cx',n.x);p.setAttribute('cy',n.y)}}

  function updateInspector(){
    const s=scenarios[scenarioIndex];
    lab.querySelector('[data-packet-src]').textContent=s.src;lab.querySelector('[data-packet-dst]').textContent=s.dst;lab.querySelector('[data-packet-vlan]').textContent=s.vlan;lab.querySelector('[data-packet-proto]').textContent=s.proto;lab.querySelector('[data-packet-rule]').textContent=s.policy;
    lab.querySelector('.packet-value').textContent=`Scenario ${scenarioIndex+1} / 3 · ${s.title}`;
    const current=s.path[step],next=s.path[step+1];
    lab.querySelector('.game-status').textContent=next?`Choose the next hop from ${labelFor(current)}.`:'Packet delivered. Scenario complete.';
    const choices=lab.querySelector('.game-choices');choices.innerHTML='';
    if(!next){lab.querySelector('.next-btn').hidden=false;lab.querySelector('#map-step').textContent='DELIVERED';lab.querySelector('#map-health').textContent='● PACKET DELIVERED';lab.querySelector('#map-health').className='ok';setMapState(current,null,true);return}
    const options=optionsFor(current,next);
    options.forEach(k=>{const b=document.createElement('button');b.type='button';b.className='game-hop';b.dataset.node=k;b.innerHTML=`${q(labelFor(k))}<span class="small">${q(nodes[k].sub)}</span>`;b.onclick=()=>chooseNode(k);choices.appendChild(b)});
    setMapState(current,next,false);lab.querySelector('#map-step').textContent=`${labelFor(current)} → ?`;
    if(current)movePacket(current);
  }

  function labelFor(k){return nodes[k]?.label||k.toUpperCase();}
  function optionsFor(current,next){
    const candidates={client:['cisco'],mgmt:['cisco'],server:['fortigate','cisco'],cisco:['fortigate','mikrotik','client','mgmt'],fortigate:['server','mikrotik','cisco'],mikrotik:['wan','cisco','fortigate'],wan:[]};
    const base=(candidates[current]||[]).filter(Boolean);return [...new Set([next,...base.filter(x=>x!==next)])].slice(0,4);
  }

  function chooseNode(k){
    const s=scenarios[scenarioIndex],current=s.path[step],expected=s.path[step+1];
    if(!expected||k===current)return;
    const buttons=[...lab.querySelectorAll('.game-hop')];
    if(k===expected){score+=10;step++;buttons.find(b=>b.dataset.node===k)?.classList.add('correct');movePacket(k);lab.querySelector('.score-value').textContent=score;setTimeout(updateInspector,240)}
    else{mistakes++;buttons.find(b=>b.dataset.node===k)?.classList.add('wrong');lab.querySelector('.mistake-value').textContent=mistakes;lab.querySelector('.game-feedback').textContent=`Wrong hop. ${labelFor(k)} is not the next forwarding step.`;lab.querySelector('#map-health').textContent='● ROUTING MISMATCH';lab.querySelector('#map-health').className='warn';setMapState(current,k,false)}
    dispatchDeviceFromNode(k);
  }

  function dispatchDeviceFromNode(k){if(['cisco','mikrotik','fortigate'].includes(k))window.dispatchEvent(new CustomEvent('portfolio:device',{detail:{device:k}}))}

  function reset(){scenarioIndex=0;step=0;score=0;mistakes=0;lab.querySelector('.score-value').textContent='0';lab.querySelector('.mistake-value').textContent='0';lab.querySelector('.game-feedback').textContent='New packet loaded.';lab.querySelector('.next-btn').hidden=true;movePacket(scenarios[0].path[0]);updateInspector()}
  function nextScenario(){scenarioIndex=(scenarioIndex+1)%scenarios.length;step=0;lab.querySelector('.next-btn').hidden=true;lab.querySelector('.game-feedback').textContent=`Scenario ${scenarioIndex+1} loaded.`;movePacket(scenarios[scenarioIndex].path[0]);updateInspector()}

  buildMap();updateInspector();
  lab.querySelector('.reset-btn')?.addEventListener('click',reset);
  lab.querySelector('.next-btn')?.addEventListener('click',nextScenario);

  // Keep the Hero as a clean NOC dashboard; the actual Lab below is the interactive simulator.
  const visual=document.querySelector('.hero-visual');
  if(visual){visual.innerHTML=`<div class="visual-head"><b>NOC / INFRASTRUCTURE COMMAND CENTER</b><em>● LIVE</em></div><div class="noc-panel"><div class="noc-map"><div class="noc-grid"></div><svg class="noc-svg" viewBox="0 0 700 300"><path class="noc-link noc-flow" d="M80 150H260"/><path class="noc-link noc-flow" d="M260 150H440"/><path class="noc-link noc-flow" d="M440 150H620"/><rect class="noc-node-rect" x="24" y="116" width="112" height="68" rx="13"/><text x="80" y="143" class="noc-text">MIKROTIK</text><text x="80" y="160" class="noc-sub">EDGE / WAN</text><circle class="noc-core" cx="350" cy="150" r="48"/><text x="350" y="147" class="noc-text">CISCO CORE</text><text x="350" y="162" class="noc-sub">OSPF / VLAN</text><rect class="noc-node-rect" x="564" y="116" width="112" height="68" rx="13"/><text x="620" y="143" class="noc-text">FORTIGATE</text><text x="620" y="160" class="noc-sub">SECURITY</text><circle class="noc-packet" cx="126" cy="150" r="4"/></svg><div class="noc-meta"><span>ROUTING <b>ONLINE</b></span><span>SECURITY <b>HARDENED</b></span><span>MONITORING <b>HEALTHY</b></span></div></div></div>`}
})();
