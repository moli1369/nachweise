// Network Operations Lab engine
(() => {
  const lab = document.querySelector('#network-game');
  if (!lab) return;

  const style = document.createElement('style');
  style.textContent = `
    .network-lab .game-map-body{position:relative;min-height:470px;background:radial-gradient(circle at 50% 48%,rgba(66,199,255,.09),transparent 38%),#02070d;overflow:hidden}
    .network-lab .game-map-body:before{content:"";position:absolute;inset:0;background-image:linear-gradient(rgba(66,199,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(66,199,255,.035) 1px,transparent 1px);background-size:28px 28px;pointer-events:none}
    .lab-svg{position:absolute;inset:0;width:100%;height:100%;display:block}
    .lab-link{fill:none;stroke:rgba(66,199,255,.18);stroke-width:1.7;stroke-dasharray:3 9;animation:labflow 2.4s linear infinite}
    .lab-link.active{stroke:#42c7ff;stroke-width:2.7;stroke-dasharray:8 7;filter:drop-shadow(0 0 7px rgba(66,199,255,.55))}
    .lab-link.done{stroke:#79edbc;stroke-width:2.7;stroke-dasharray:8 7;filter:drop-shadow(0 0 7px rgba(121,237,188,.45))}
    .lab-node{cursor:pointer}.lab-node rect,.lab-node circle{fill:#081723;stroke:rgba(66,199,255,.3);stroke-width:1.4;transition:.2s}
    .lab-node:hover rect,.lab-node:hover circle,.lab-node.active rect,.lab-node.active circle{stroke:#42c7ff;filter:drop-shadow(0 0 12px rgba(66,199,255,.35))}
    .lab-node.target rect,.lab-node.target circle{stroke:#ffb478;filter:drop-shadow(0 0 11px rgba(255,180,120,.28))}.lab-node.success rect,.lab-node.success circle{stroke:#79edbc;filter:drop-shadow(0 0 11px rgba(121,237,188,.28))}
    .lab-node text{fill:#e5f4fb;text-anchor:middle;font-family:var(--mono);font-weight:600;letter-spacing:.08em;font-size:9px;pointer-events:none}.lab-node .sub{fill:#638398;font-size:5.8px;font-weight:500;letter-spacing:.04em}
    .packet-dot{fill:#fff;filter:drop-shadow(0 0 8px rgba(255,255,255,.95));transition:cx .6s ease,cy .6s ease}.packet-trail{fill:none;stroke:rgba(255,255,255,.22);stroke-width:1.2;stroke-dasharray:2 7}
    .map-status{position:absolute;left:18px;right:18px;bottom:16px;display:flex;justify-content:space-between;align-items:center;gap:10px;padding:10px 12px;border:1px solid rgba(180,215,240,.1);border-radius:12px;background:rgba(1,8,14,.76);backdrop-filter:blur(8px);font:500 .55rem var(--mono);color:#7692a4}.map-status strong{color:#d8edf6}.map-status .ok{color:#79edbc}.map-status .warn{color:#ffb478}
    .game-choices{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}.game-hop{width:100%;padding:10px 11px;border:1px solid var(--line);border-radius:10px;background:rgba(255,255,255,.02);color:#acc3d1;text-align:left;cursor:pointer;font:600 .58rem var(--mono);transition:.2s}.game-hop:hover{border-color:rgba(66,199,255,.45);background:rgba(66,199,255,.06);color:#eefaff;transform:translateY(-1px)}.game-hop .small{display:block;margin-top:3px;color:#5f7a8c;font-weight:500;font-size:.48rem}.game-hop.correct{border-color:rgba(121,237,188,.45);background:rgba(121,237,188,.06);color:#79edbc}.game-hop.wrong{border-color:rgba(255,135,147,.45);background:rgba(255,135,147,.05);color:#ff8793}
    @keyframes labflow{to{stroke-dashoffset:-48}}@media(max-width:800px){.network-lab .game-map-body{min-height:390px}.game-choices{grid-template-columns:1fr}.map-status{font-size:.48rem;bottom:10px;left:10px;right:10px}}@media(max-width:520px){.network-lab .game-map-body{min-height:330px}.lab-node text{font-size:7px}.lab-node .sub{font-size:4.8px}.map-status{padding:8px 9px}}
  `;
  document.head.appendChild(style);

  const scenarios=[
    {title:'Client → DMZ',src:'10.10.10.25',dst:'10.20.20.25',vlan:'10',proto:'TCP/443',policy:'ALLOW · WEB',path:['client','cisco','fortigate','server']},
    {title:'Server → WAN',src:'10.20.20.25',dst:'8.8.8.8',vlan:'20',proto:'ICMP',policy:'NAT · OUTBOUND',path:['server','fortigate','cisco','mikrotik','wan']},
    {title:'Management → Edge',src:'10.50.50.15',dst:'10.10.10.2',vlan:'50',proto:'SSH/22',policy:'ALLOW · MGMT',path:['mgmt','cisco','mikrotik']}
  ];
  const nodes={
    client:{x:100,y:245,w:126,h:62,label:'CLIENT VLAN 10',sub:'10.10.10.25',shape:'rect'},
    mgmt:{x:100,y:95,w:126,h:62,label:'MGMT VLAN 50',sub:'10.50.50.15',shape:'rect'},
    cisco:{x:350,y:170,r:52,label:'CISCO CORE',sub:'OSPF · L3',shape:'circle'},
    fortigate:{x:530,y:78,w:132,h:62,label:'FORTIGATE',sub:'POLICY · NAT',shape:'rect'},
    mikrotik:{x:530,y:263,w:132,h:62,label:'MIKROTIK',sub:'EDGE · WAN',shape:'rect'},
    server:{x:680,y:170,w:120,h:62,label:'DMZ SERVER',sub:'10.20.20.25',shape:'rect'},
    wan:{x:735,y:303,r:30,label:'WAN',sub:'8.8.8.8',shape:'circle'}
  };
  const edges=[['client','cisco'],['mgmt','cisco'],['cisco','fortigate'],['cisco','mikrotik'],['fortigate','server'],['fortigate','mikrotik'],['mikrotik','wan']];
  let scenarioIndex=0,step=0,score=0,mistakes=0;
  const esc=s=>String(s).replace(/[&<>]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[ch]));
  const svgEl=(tag,cls)=>{const e=document.createElementNS('http://www.w3.org/2000/svg',tag);if(cls)e.setAttribute('class',cls);return e};
  const pos=k=>({x:nodes[k].x,y:nodes[k].y});
  const labelFor=k=>nodes[k]?.label||k.toUpperCase();

  function buildMap(){
    const host=lab.querySelector('.game-map-body');if(!host)return;
    const svg=svgEl('svg','lab-svg');svg.setAttribute('viewBox','0 0 820 350');svg.setAttribute('preserveAspectRatio','xMidYMid meet');svg.setAttribute('role','img');svg.setAttribute('aria-label','Interactive network topology');
    const links=svgEl('g');
    edges.forEach(([a,b],i)=>{const p1=pos(a),p2=pos(b),path=svgEl('path','lab-link');path.dataset.edge=`${a}-${b}`;path.setAttribute('d',`M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`);path.style.animationDelay=`${i*.2}s`;links.appendChild(path)});
    svg.appendChild(links);
    const trail=svgEl('path','packet-trail');trail.setAttribute('d','M 100 245 L 350 170 L 530 78 L 680 170');svg.appendChild(trail);
    const packet=svgEl('circle','packet-dot');packet.id='lab-packet';packet.setAttribute('r','5');packet.setAttribute('cx',nodes.client.x);packet.setAttribute('cy',nodes.client.y);svg.appendChild(packet);
    Object.entries(nodes).forEach(([key,n])=>{
      const g=svgEl('g','lab-node');g.dataset.node=key;
      if(n.shape==='rect'){const r=svgEl('rect');r.setAttribute('x',n.x-n.w/2);r.setAttribute('y',n.y-n.h/2);r.setAttribute('width',n.w);r.setAttribute('height',n.h);r.setAttribute('rx','14');g.appendChild(r)}
      else{const r=svgEl('circle');r.setAttribute('cx',n.x);r.setAttribute('cy',n.y);r.setAttribute('r',n.r);g.appendChild(r)}
      const title=svgEl('text');title.setAttribute('x',n.x);title.setAttribute('y',n.y-2);title.textContent=n.label;g.appendChild(title);
      const sub=svgEl('text','sub');sub.setAttribute('x',n.x);sub.setAttribute('y',n.y+14);sub.textContent=n.sub;g.appendChild(sub);
      g.addEventListener('click',()=>chooseNode(key));svg.appendChild(g);
    });
    host.innerHTML='';host.appendChild(svg);
    const status=document.createElement('div');status.className='map-status';status.innerHTML='<span>FORWARDING PLANE · <strong id="map-step">Awaiting packet</strong></span><span id="map-health" class="ok">● SIMULATOR READY</span>';host.appendChild(status);
  }

  function setMapState(active,next,done=false){
    lab.querySelectorAll('.lab-node').forEach(n=>n.classList.remove('active','target','success'));
    if(active)lab.querySelector(`[data-node="${active}"]`)?.classList.add('active');
    if(next)lab.querySelector(`[data-node="${next}"]`)?.classList.add(done?'success':'target');
    lab.querySelectorAll('.lab-link').forEach(l=>l.classList.remove('active','done'));
    if(active&&next){for(const key of [`${active}-${next}`,`${next}-${active}`])lab.querySelector(`[data-edge="${key}"]`)?.classList.add(done?'done':'active')}
  }
  function movePacket(k){const p=lab.querySelector('#lab-packet'),n=nodes[k];if(p&&n){p.setAttribute('cx',n.x);p.setAttribute('cy',n.y)}}
  function optionsFor(current,next){const candidates={client:['cisco'],mgmt:['cisco'],server:['fortigate','cisco'],cisco:['fortigate','mikrotik','client','mgmt'],fortigate:['server','mikrotik','cisco'],mikrotik:['wan','cisco','fortigate'],wan:[]};return [...new Set([next,...(candidates[current]||[]).filter(k=>k!==next)])].slice(0,4)}

  function render(){
    const s=scenarios[scenarioIndex],current=s.path[step],next=s.path[step+1];
    lab.querySelector('[data-packet-src]').textContent=s.src;lab.querySelector('[data-packet-dst]').textContent=s.dst;lab.querySelector('[data-packet-vlan]').textContent=s.vlan;lab.querySelector('[data-packet-proto]').textContent=s.proto;lab.querySelector('[data-packet-rule]').textContent=s.policy;
    lab.querySelector('.packet-value').textContent=`Scenario ${scenarioIndex+1} / 3 · ${s.title}`;
    const choices=lab.querySelector('.game-choices');choices.innerHTML='';
    if(!next){lab.querySelector('.game-status').textContent='Packet delivered. Scenario complete.';lab.querySelector('.next-btn').hidden=false;lab.querySelector('#map-step').textContent='DELIVERED';lab.querySelector('#map-health').textContent='● PACKET DELIVERED';lab.querySelector('#map-health').className='ok';setMapState(current,null,true);return}
    lab.querySelector('.game-status').textContent=`Choose the next hop from ${labelFor(current)}.`;lab.querySelector('#map-step').textContent=`${labelFor(current)} → ?`;lab.querySelector('#map-health').textContent='● ROUTE DECISION REQUIRED';lab.querySelector('#map-health').className='warn';
    optionsFor(current,next).forEach(k=>{const b=document.createElement('button');b.className='game-hop';b.type='button';b.dataset.node=k;b.innerHTML=`${esc(labelFor(k))}<span class="small">${esc(nodes[k].sub)}</span>`;b.onclick=()=>chooseNode(k);choices.appendChild(b)});
    setMapState(current,next,false);movePacket(current);
  }

  function chooseNode(k){
    const s=scenarios[scenarioIndex],current=s.path[step],expected=s.path[step+1];if(!expected||k===current)return;
    if(k===expected){score+=10;step++;lab.querySelector('.score-value').textContent=score;lab.querySelector('.game-feedback').textContent='Correct forwarding decision. Packet advanced.';movePacket(k);dispatchDevice(k);setTimeout(render,240)}
    else{mistakes++;lab.querySelector('.mistake-value').textContent=mistakes;lab.querySelector('.game-feedback').textContent=`Wrong hop: ${labelFor(k)} is not the next forwarding device.`;const b=lab.querySelector(`[data-node="${k}"]`);if(b)b.classList.add('wrong');setMapState(current,k,false)}
  }
  function dispatchDevice(k){if(['cisco','mikrotik','fortigate'].includes(k))window.dispatchEvent(new CustomEvent('portfolio:device',{detail:{device:k}}))}
  function reset(){scenarioIndex=0;step=0;score=0;mistakes=0;lab.querySelector('.score-value').textContent='0';lab.querySelector('.mistake-value').textContent='0';lab.querySelector('.game-feedback').textContent='New packet loaded.';lab.querySelector('.next-btn').hidden=true;render()}
  function nextScenario(){scenarioIndex=(scenarioIndex+1)%scenarios.length;step=0;lab.querySelector('.next-btn').hidden=true;lab.querySelector('.game-feedback').textContent=`Scenario ${scenarioIndex+1} loaded.`;render()}

  buildMap();render();lab.querySelector('.reset-btn')?.addEventListener('click',reset);lab.querySelector('.next-btn')?.addEventListener('click',nextScenario);
})();
