(() => {
  const boot = () => {
    if (document.querySelector('.voip-operations')) return;

    const style = document.createElement('style');
    style.textContent = `
      /* Recruiter-facing CV CTA */
      #cv-link{min-width:132px;padding:.62rem .82rem;font-size:.72rem;font-weight:700;border-color:rgba(66,199,255,.34);background:linear-gradient(135deg,rgba(66,199,255,.13),rgba(121,237,188,.07));color:#dff7ff;box-shadow:0 8px 24px rgba(0,0,0,.16)}
      #cv-link:before{content:'↓';display:inline-grid;place-items:center;width:19px;height:19px;border-radius:6px;margin-right:6px;border:1px solid rgba(66,199,255,.2);color:#42c7ff;background:rgba(66,199,255,.05)}
      #cv-link:hover{border-color:rgba(66,199,255,.55);box-shadow:0 10px 30px rgba(66,199,255,.11)}
      @media(max-width:900px){#cv-link{min-width:112px;padding:.55rem .65rem;font-size:.66rem}.nav-actions{gap:.35rem}}
      @media(max-width:700px){#cv-link{min-width:108px}.nav-links{display:none}}

      /* VoIP / Unified Communications showcase */
      .voip-operations{width:min(1180px,calc(100% - 2 * var(--pad)));margin:18px auto 0}
      .voip-shell{border:1px solid rgba(121,237,188,.14);border-radius:20px;overflow:hidden;background:linear-gradient(145deg,rgba(7,21,31,.94),rgba(3,10,16,.98));box-shadow:0 22px 80px rgba(0,0,0,.18)}
      .voip-head{display:flex;justify-content:space-between;gap:20px;align-items:end;padding:20px 22px;border-bottom:1px solid rgba(180,215,240,.08)}
      .voip-kicker{color:#79edbc;font:600 .52rem var(--mono);letter-spacing:.16em;text-transform:uppercase}
      .voip-title{margin:6px 0 0;font-size:1.5rem;letter-spacing:-.035em}
      .voip-copy{margin:5px 0 0;color:#718a9b;font-size:.72rem;line-height:1.5;max-width:740px}
      .voip-status{white-space:nowrap;color:#79edbc;font:600 .52rem var(--mono);padding:8px 10px;border:1px solid rgba(121,237,188,.16);border-radius:999px;background:rgba(121,237,188,.04)}
      .voip-map{padding:18px;background:radial-gradient(circle at 50% 50%,rgba(121,237,188,.06),transparent 48%),#030b12}
      .voip-svg{width:100%;height:auto;display:block;min-height:220px}
      .voip-line{fill:none;stroke:rgba(121,237,188,.22);stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
      .voip-flow{fill:none;stroke:#79edbc;stroke-width:2.4;stroke-dasharray:4 12;stroke-linecap:round;stroke-linejoin:round;animation:voipFlow 2.3s linear infinite}
      .voip-node rect,.voip-node circle{fill:#071723;stroke:rgba(121,237,188,.25);stroke-width:1.4}
      .voip-node.main circle{stroke:rgba(66,199,255,.45);fill:#081c2b}
      .voip-node text{fill:#e7f4fb;text-anchor:middle;font:600 9px var(--mono);letter-spacing:.06em}
      .voip-node .sub{fill:#6c8798;font:500 5.8px var(--mono)}
      .voip-details{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:rgba(180,215,240,.07);border-top:1px solid rgba(180,215,240,.07)}
      .voip-detail{padding:14px 15px;background:#04101a}
      .voip-detail strong{display:block;color:#dceff6;font:600 .6rem var(--mono)}
      .voip-detail span{display:block;margin-top:5px;color:#6e8899;font:500 .5rem/1.45 var(--mono)}
      .voip-proof{padding:12px 15px;border-top:1px solid rgba(180,215,240,.07);display:flex;flex-wrap:wrap;gap:6px;color:#7790a0;font:500 .49rem var(--mono)}
      .voip-proof span{padding:4px 6px;border:1px solid rgba(121,237,188,.11);border-radius:6px;background:rgba(121,237,188,.03)}
      @keyframes voipFlow{to{stroke-dashoffset:-64}}
      @keyframes voipPacket{0%{transform:translateX(0)}24%{transform:translateX(145px)}42%{transform:translateX(250px)}58%{transform:translateX(385px)}76%{transform:translate(515px,-60px)}100%{transform:translate(595px,60px)}}
      @media(max-width:900px){.voip-details{grid-template-columns:1fr 1fr}.voip-head{align-items:flex-start;flex-direction:column}}
      @media(max-width:620px){.voip-operations{width:min(1180px,calc(100% - 2 * var(--pad)));margin-top:14px}.voip-shell{border-radius:16px}.voip-head{padding:16px}.voip-title{font-size:1.25rem}.voip-details{grid-template-columns:1fr}.voip-map{padding:10px}.voip-svg{min-height:180px}}
    `;
    document.head.appendChild(style);

    const infra = document.querySelector('.infra-depth');
    if (!infra) return;

    const section = document.createElement('section');
    section.className = 'voip-operations';
    section.setAttribute('aria-label', 'VoIP and unified communications operations');
    section.innerHTML = `
      <div class="voip-shell">
        <div class="voip-head">
          <div>
            <div class="voip-kicker">VOICE / UNIFIED COMMUNICATIONS</div>
            <h2 class="voip-title">VoIP infrastructure across office and port operations.</h2>
            <p class="voip-copy">Implemented virtualized Issabel-based VoIP environments for Fardad Azarakhsh and Pejam Gulf, connecting Tehran, Bandar Abbas and two separate port-operation networks for container and vehicle logistics.</p>
          </div>
          <div class="voip-status">● PRODUCTION EXPERIENCE</div>
        </div>
        <div class="voip-map">
          <svg class="voip-svg" viewBox="0 0 900 250" aria-hidden="true">
            <path class="voip-line" d="M255 125 H352 M448 125 H545 M695 125 H710 M710 125 V65 H735 M710 125 V185 H735"/>
            <path class="voip-flow" d="M255 125 H352 M448 125 H545 M695 125 H710 M710 125 V65 H735 M710 125 V185 H735"/>
            <g class="voip-node"><rect x="65" y="83" width="190" height="84" rx="16"/><text x="160" y="112">TEHRAN</text><text x="160" y="131" class="sub">HEAD OFFICE / VOIP SITE</text><text x="160" y="146" class="sub">SIP · WAN · REMOTE USERS</text></g>
            <g class="voip-node main"><circle cx="400" cy="125" r="48"/><text x="400" y="120">ISSA​BEL</text><text x="400" y="136" class="sub">VIRTUAL PBX</text></g>
            <g class="voip-node"><rect x="545" y="83" width="150" height="84" rx="16"/><text x="620" y="112">BANDAR ABBAS</text><text x="620" y="131" class="sub">BRANCH / HQ</text><text x="620" y="146" class="sub">SIP / INTERNAL VOICE</text></g>
            <g class="voip-node"><rect x="735" y="36" width="140" height="58" rx="13"/><text x="805" y="60">PORT · CONTAINER</text><text x="805" y="77" class="sub">OPERATIONS VOICE</text></g>
            <g class="voip-node"><rect x="735" y="156" width="140" height="58" rx="13"/><text x="805" y="180">PORT · VEHICLE</text><text x="805" y="197" class="sub">OPERATIONS VOICE</text></g>
            <circle cx="183" cy="125" r="4" fill="#fff" style="filter:drop-shadow(0 0 6px rgba(255,255,255,.9));animation:voipPacket 4s linear infinite"/>
          </svg>
        </div>
        <div class="voip-details">
          <div class="voip-detail"><strong>Virtual PBX</strong><span>Issabel deployed as a virtualized voice platform.</span></div>
          <div class="voip-detail"><strong>Site Connectivity</strong><span>Tehran ↔ Bandar Abbas voice connectivity across the WAN.</span></div>
          <div class="voip-detail"><strong>Port Network 01</strong><span>Container-operation communications network.</span></div>
          <div class="voip-detail"><strong>Port Network 02</strong><span>Vehicle-operation communications network.</span></div>
        </div>
        <div class="voip-proof"><span>Issabel</span><span>SIP / VoIP</span><span>Virtualization</span><span>WAN Connectivity</span><span>Branch Telephony</span><span>Port Operations</span></div>
      </div>`;

    infra.insertAdjacentElement('afterend', section);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, {once:true});
  else boot();
})();
