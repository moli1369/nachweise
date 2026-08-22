(() => {
  const boot = () => {
    const svg = document.querySelector('.voip-operations .voip-svg');
    const old = svg?.querySelector('circle[style*="voipPacket"]');
    if (!svg || !old) return;
    if (svg.querySelector('#voip-packet-path')) return;

    const ns = 'http://www.w3.org/2000/svg';
    const path = document.createElementNS(ns, 'path');
    path.id = 'voip-packet-path';
    path.setAttribute('d', 'M183 125 H400 H620 V65 H805 V185 H620 H400 H183');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'none');
    path.setAttribute('pathLength', '1');
    svg.insertBefore(path, old);

    const packet = document.createElementNS(ns, 'circle');
    packet.setAttribute('r', '4');
    packet.setAttribute('fill', '#fff');
    packet.setAttribute('class', 'voip-packet');
    packet.setAttribute('style', 'filter:drop-shadow(0 0 6px rgba(255,255,255,.9))');

    const motion = document.createElementNS(ns, 'animateMotion');
    motion.setAttribute('dur', '6s');
    motion.setAttribute('repeatCount', 'indefinite');
    motion.setAttribute('calcMode', 'linear');
    const mp = document.createElementNS(ns, 'mpath');
    mp.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#voip-packet-path');
    mp.setAttribute('href', '#voip-packet-path');
    motion.appendChild(mp);
    packet.appendChild(motion);

    old.replaceWith(packet);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
