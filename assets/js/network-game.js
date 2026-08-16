(() => {
  const board = document.querySelector('#network-game');
  if (!board) return;

  const nodes = {
    client: { name: 'Client · VLAN 10', type: 'endpoint', x: 7, y: 54 },
    access: { name: 'Access Switch', type: 'switch', x: 28, y: 54 },
    core: { name: 'Core L3 · OSPF', type: 'router', x: 50, y: 54 },
    firewall: { name: 'FortiGate', type: 'firewall', x: 71, y: 33 },
    server: { name: 'Server VLAN 20', type: 'server', x: 92, y: 33 },
    internet: { name: 'WAN / Internet', type: 'wan', x: 71, y: 76 },
    dmz: { name: 'DMZ', type: 'dmz', x: 92, y: 76 },
  };

  const links = [
    ['client','access'],['access','core'],['core','firewall'],['firewall','server'],
    ['core','internet'],['internet','dmz'],['firewall','dmz']
  ];

  const scenarios = [
    { source:'client', target:'server', srcIp:'10.10.10.42', dstIp:'10.20.20.25', vlan:'10 → 20', proto:'HTTPS', rule:'ALLOW', note:'Inter-VLAN routing + HTTPS through the firewall.', answer:['access','core','firewall','server'] },
    { source:'client', target:'dmz', srcIp:'10.10.10.42', dstIp:'172.16.50.12', vlan:'10 → DMZ', proto:'HTTPS', rule:'ALLOW', note:'Private client reaches a published service in the DMZ.', answer:['access','core','firewall','dmz'] },
    { source:'client', target:'internet', srcIp:'10.10.10.42', dstIp:'8.8.8.8', vlan:'10 → WAN', proto:'DNS', rule:'NAT', note:'Client traffic exits through the core and firewall with NAT.', answer:['access','core','firewall','internet'] },
  ];

  let scenarioIndex = 0;
  let step = 0;
  let score = 0;
  let mistakes = 0;
  let startedAt = 0;
  let completed = 0;
  let current = scenarios[0];
  let locked = false;

  const q = (sel) => board.querySelector(sel);
  const fmt = (v) => String(v).padStart(2,'0');

  function renderSvg() {
    const svg = q('.game-topology');
    svg.innerHTML = `
      <defs>
        <linearGradient id="ng-line" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#39c8ff" stop-opacity=".12"/>
          <stop offset=".5" stop-color="#39c8ff" stop-opacity=".9"/>
          <stop offset="1" stop-color="#70f0bd" stop-opacity=".25"/>
        </linearGradient>
        <filter id="ng-glow"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      ${links.map(([a,b])=>{
        const A=nodes[a],B=nodes[b];
        return `<path class="g-link" data-a="${a}" data-b="${b}" d="M ${A.x} ${A.y} L ${B.x} ${B.y}"/>`;
      }).join('')}
      ${Object.entries(nodes).map(([id,n])=>`<g class="g-node g-${n.type}" data-id="${id}" transform="translate(${n.x} ${n.y})">
        <circle class="g-halo" r="4.2"/><circle class="g-ring" r="3"/><circle class="g-core" r="1.7"/>
        <text y="7.2" text-anchor="middle">${n.name}</text>
      </g>`).join('')}
      <circle class="g-packet" cx="${nodes.client.x}" cy="${nodes.client.y}" r="1.15"/>
    `;
  }

  function updatePacket() {
    const p = q('.packet-value');
    const s = q('.game-status');
    p.textContent = current.note;
    q('[data-packet-src]').textContent = current.srcIp;
    q('[data-packet-dst]').textContent = current.dstIp;
    q('[data-packet-vlan]').textContent = current.vlan;
    q('[data-packet-proto]').textContent = current.proto;
    q('[data-packet-rule]').textContent = current.rule;
    s.textContent = step === 0 ? 'Choose the first hop from the source.' : `Hop ${fmt(step)} of ${fmt(current.answer.length)} — keep the packet moving.`;
  }

  function renderChoices() {
    const wrap = q('.game-choices');
    const prev = step === 0 ? current.source : current.answer[step-1];
    const neighbors = links.flatMap(([a,b]) => a===prev?[b]:b===prev?[a]:[]);
    const options = [...new Set(neighbors)].sort((a,b)=>Number(b===current.answer[step])-Number(a===current.answer[step]));
    wrap.innerHTML = options.map(id => `<button class="hop-btn" data-hop="${id}">${nodes[id].name}<span>${nodes[id].type.toUpperCase()}</span></button>`).join('');
    wrap.querySelectorAll('button').forEach(btn => btn.addEventListener('click', () => chooseHop(btn.dataset.hop)));
  }

  function markPath() {
    board.querySelectorAll('.g-link').forEach(el => el.classList.remove('active','complete'));
    const path = [current.source, ...current.answer.slice(0,step)];
    for (let i=0;i<path.length-1;i++) {
      const a=path[i],b=path[i+1];
      const el=board.querySelector(`.g-link[data-a="${a}"][data-b="${b}"],.g-link[data-a="${b}"][data-b="${a}"]`);
      if (el) el.classList.add(i < step ? 'complete' : 'active');
    }
    board.querySelectorAll('.g-node').forEach(n => n.classList.remove('current','target','passed'));
    const currentId = step===0 ? current.source : current.answer[step-1];
    board.querySelector(`.g-node[data-id="${currentId}"]`)?.classList.add('current');
    board.querySelector(`.g-node[data-id="${current.target}"]`)?.classList.add('target');
    path.slice(0,-1).forEach(id => board.querySelector(`.g-node[data-id="${id}"]`)?.classList.add('passed'));
    movePacket(currentId);
  }

  function movePacket(id) {
    const p=q('.g-packet'); const n=nodes[id];
    p.setAttribute('cx', n.x); p.setAttribute('cy', n.y);
  }

  function chooseHop(id) {
    if (locked) return;
    const correct = id === current.answer[step];
    const btn = board.querySelector(`[data-hop="${id}"]`);
    if (!correct) {
      mistakes++;
      btn.classList.add('wrong');
      q('.game-feedback').textContent = 'Route rejected — check the topology and forwarding path.';
      q('.game-feedback').className = 'game-feedback bad';
      setTimeout(()=>btn.classList.remove('wrong'),650);
      return;
    }

    btn.classList.add('right');
    step++;
    score += Math.max(25, 100 - mistakes*15);
    q('.score-value').textContent = score;
    q('.mistake-value').textContent = mistakes;
    q('.game-feedback').textContent = step === current.answer.length ? 'Packet delivered — clean route.' : 'Correct hop. Continue routing.';
    q('.game-feedback').className = 'game-feedback good';
    markPath();
    updatePacket();
    if (step >= current.answer.length) finishScenario();
    else renderChoices();
  }

  function finishScenario() {
    locked = true;
    completed++;
    score += Math.max(0, 150 - Math.floor((Date.now()-startedAt)/1000)*3 - mistakes*20);
    q('.score-value').textContent = score;
    q('.game-status').textContent = completed < scenarios.length ? 'Packet delivered. Scenario complete.' : 'Lab complete — your routing decisions are logged.';
    q('.next-btn').hidden = false;
    q('.game-feedback').textContent = completed < scenarios.length ? 'Nice. Ready for the next network scenario?' : 'Excellent. You handled routing, VLAN segmentation, firewall policy and NAT.';
    q('.game-feedback').className = 'game-feedback good';
  }

  function nextScenario() {
    if (completed >= scenarios.length) {
      scenarioIndex = 0; completed = 0; score = 0; mistakes = 0;
    }
    current = scenarios[scenarioIndex % scenarios.length];
    scenarioIndex++;
    step = 0; mistakes = 0; locked = false; startedAt = Date.now();
    q('.next-btn').hidden = true;
    q('.score-value').textContent = score;
    q('.mistake-value').textContent = mistakes;
    q('.game-feedback').textContent = 'New packet loaded.';
    q('.game-feedback').className = 'game-feedback';
    renderChoices(); updatePacket(); markPath();
  }

  q('.next-btn').addEventListener('click', nextScenario);
  q('.reset-btn').addEventListener('click', () => { scenarioIndex=0; completed=0; score=0; mistakes=0; nextScenario(); });
  renderSvg(); nextScenario();
})();
