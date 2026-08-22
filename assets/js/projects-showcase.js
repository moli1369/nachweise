(() => {
  const PROJECTS = {
    de: [
      {tag:'Richtfunk / Backhaul',title:'180 km Multipoint: Bandar Abbas → Hajjiabad',text:'Aufbau einer Weitverkehrsverbindung zur انتقال داده von Bandar Abbas bis Hajjiabad über eine Multipoint-Richtfunkarchitektur. Planung der Funkstandorte, Routing und Überwachung der Strecke für die kontinuierliche Datenübertragung.',metrics:[['180 km','Strecke'],['Multipoint','Architektur'],['IP','Backhaul']]},
      {tag:'Rural Connectivity',title:'Datenversorgung für abgelegene Standorte im Raum Bandar Abbas',text:'Planung und Umsetzung von Datenverbindungen für Genu, Sarzeh, Rezvan, Fin und Siahú/Tang sowie weitere ländliche Standorte. Ziel war die zuverlässige Anbindung entfernter Standorte an die zentrale Infrastruktur.',metrics:[['5+','Standorte'],['Wireless','Backhaul'],['WAN','Connectivity']]},
      {tag:'VLAN + Wireless',title:'Bandar Abbas → Bastak: VLAN-Transport über Mimosa',text:'Übertragung von Daten aus Bandar Abbas zu Standorten im Raum Bastak über VLAN-basierte Netzarchitektur und Mimosa-Richtfunk. Layer-2/Layer-3-Übergänge, Routing und Funkstrecken für den verteilten Betrieb.',metrics:[['VLAN','Transport'],['Mimosa','Radio'],['WAN','Backhaul']]},
      {tag:'Hotspot / Wireless',title:'Hotspot-Infrastruktur im Thermalbad Genu',text:'Konzeption und Aufbau einer Hotspot-Lösung für das Genu Thermalbad, inklusive Wireless-Abdeckung, Netzwerksegmentierung und kontrolliertem Internetzugang für Besucher.',metrics:[['Wi-Fi','Coverage'],['Hotspot','Access'],['Network','Segmentation']]},
      {tag:'VoIP / Issabel',title:'Virtuelle VoIP-Infrastruktur für mehrere Standorte',text:'Aufbau und Virtualisierung einer VoIP-Infrastruktur mit Issabel für Fardad Azarakhsh und Pejam Gulf. Standortübergreifende Telefonie zwischen Tehran, Bandar Abbas und den Port Operations — einschließlich der getrennten Container- und Vehicle-Bereiche am Terminal.',metrics:[['Issabel','PBX'],['SIP','VoIP'],['Multi-site','Telephony']]},
      {tag:'Incident Response',title:'300 kompromittierte Netzwerkgeräte automatisiert bereinigt',text:'Nach einem Sicherheitsvorfall Entwicklung eines Python-Workflows für automatisierte Anmeldung, Bereinigung und Härtung von rund 300 Geräten — statt einer manuellen Bearbeitung über mehrere Wochen.',metrics:[['~300','Geräte'],['< 1 h','Automatisierung'],['Python','Remediation']]},
      {tag:'Virtualisierung',title:'Proxmox Cluster mit Ceph & High Availability',text:'Aufbau einer virtualisierten Cluster-Infrastruktur mit Proxmox VE, Ceph Distributed Storage und High Availability. Fokus auf Quorum, Failover und stabilem Betrieb von virtuellen Workloads.',metrics:[['Ceph','Storage'],['HA','Failover'],['Cluster','Proxmox']]},
      {tag:'Industrial IT',title:'SIMATIC / WinCC auf virtualisierter Plattform',text:'Virtualisierung und Absicherung Windows-basierter SIMATIC- und WinCC-Systeme für industrielle Container-Umschlagfahrzeuge und Überführung auf standardisierte Hardware.',metrics:[['80 t','Fahrzeuge'],['SCADA','WinCC'],['Virtual','Platform']]}
    ],
    en: [
      {tag:'Microwave / Backhaul',title:'180 km Multipoint: Bandar Abbas → Hajjiabad',text:'Built a long-distance data backhaul from Bandar Abbas to Hajjiabad using a multipoint microwave architecture. Covered radio-site planning, routing and monitoring for continuous production connectivity.',metrics:[['180 km','distance'],['Multipoint','architecture'],['IP','backhaul']]},
      {tag:'Rural Connectivity',title:'Rural data connectivity across the Bandar Abbas region',text:'Designed and deployed data connections for Genu, Sarzeh, Rezvan, Fin and Siahú/Tang plus other remote sites, connecting distributed locations back to the central infrastructure.',metrics:[['5+','sites'],['Wireless','backhaul'],['WAN','connectivity']]},
      {tag:'VLAN + Wireless',title:'Bandar Abbas → Bastak: VLAN transport over Mimosa',text:'Delivered data from Bandar Abbas to sites around Bastak using a VLAN-based network architecture and Mimosa microwave links, combining Layer 2/Layer 3 transport, routing and wireless backhaul.',metrics:[['VLAN','transport'],['Mimosa','radio'],['WAN','backhaul']]},
      {tag:'Hotspot / Wireless',title:'Hotspot infrastructure at Genu Thermal Bath',text:'Designed and deployed a hotspot solution for Genu Thermal Bath, including wireless coverage, network segmentation and controlled guest Internet access.',metrics:[['Wi-Fi','coverage'],['Hotspot','access'],['Network','segmentation']]},
      {tag:'VoIP / Issabel',title:'Virtual multi-site VoIP infrastructure',text:'Built and virtualised an Issabel-based VoIP platform for Fardad Azarakhsh and Pejam Gulf. Connected Tehran, Bandar Abbas and port operations, including separate container and vehicle operational areas at the terminal.',metrics:[['Issabel','PBX'],['SIP','VoIP'],['Multi-site','telephony']]},
      {tag:'Incident Response',title:'Automated remediation of ~300 compromised network devices',text:'After a security incident, developed a Python workflow for automated login, cleanup and hardening of around 300 devices instead of handling the remediation manually over several weeks.',metrics:[['~300','devices'],['< 1 h','automation'],['Python','remediation']]},
      {tag:'Virtualisation',title:'Proxmox cluster with Ceph & High Availability',text:'Built clustered infrastructure with Proxmox VE, Ceph distributed storage and High Availability, focusing on quorum, failover and stable production workloads.',metrics:[['Ceph','storage'],['HA','failover'],['Cluster','Proxmox']]},
      {tag:'Industrial IT',title:'SIMATIC / WinCC on a virtualised platform',text:'Virtualised and hardened Windows-based SIMATIC and WinCC systems for industrial container-handling vehicles, then moved them to standardised hardware.',metrics:[['80 t','vehicles'],['SCADA','WinCC'],['Virtual','platform']]}
    ]
  };

  const esc = v => String(v).replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));
  const render = () => {
    const grid = document.querySelector('#project-grid');
    if (!grid) return;
    const lang = (window.lang || localStorage.getItem('portfolio-lang') || ((navigator.language||'de').toLowerCase().startsWith('en')?'en':'de'));
    const items = PROJECTS[lang] || PROJECTS.de;
    grid.innerHTML = items.map((p,i)=>`<article class="project-card projects-showcase-card" tabindex="0" data-showcase-project="${i}"><div class="project-index">PROJECT / ${String(i+1).padStart(2,'0')}</div><div class="showcase-tag">${esc(p.tag)}</div><h3>${esc(p.title)}</h3><p>${esc(p.text)}</p><div class="project-tags">${p.metrics.map(([v,l])=>`<span>${esc(v)} · ${esc(l)}</span>`).join('')}</div></article>`).join('');
    grid.querySelectorAll('[data-showcase-project]').forEach(card=>{
      const open=()=>{
        const p=items[Number(card.dataset.showcaseProject)];
        const modal=document.querySelector('#modal');
        if(!modal)return;
        document.querySelector('#modal-kicker').textContent=p.tag;
        document.querySelector('#modal-title').textContent=p.title;
        document.querySelector('#modal-body').innerHTML=`<div class="modal-content"><p>${esc(p.text)}</p><div class="modal-proof">${p.metrics.map(([v,l])=>`<span>${esc(v)} · ${esc(l)}</span>`).join('')}</div></div>`;
        modal.hidden=false; document.body.style.overflow='hidden'; document.querySelector('#modal-close')?.focus();
      };
      card.addEventListener('click',open); card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}});
    });
  };
  const style=document.createElement('style');
  style.textContent='.showcase-tag{display:inline-block;margin-top:10px;color:#42c7ff;font:600 .54rem var(--mono);letter-spacing:.08em;text-transform:uppercase}.projects-showcase-card h3{margin-top:7px}.projects-showcase-card p{min-height:4.7em}.projects-showcase-card .project-tags span{font-size:.53rem}@media(max-width:700px){.projects-showcase-card p{min-height:0}}';
  document.head.appendChild(style);

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>setTimeout(render,30),{once:true}); else setTimeout(render,30);
  window.addEventListener('portfolio:language-change',render);
  document.addEventListener('click',e=>{if(e.target.closest('.lang button')) setTimeout(render,40)});
})();
