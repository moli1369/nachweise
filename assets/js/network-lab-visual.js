(() => {
  const compactCv = () => {
    document.querySelectorAll('#recruiter-cv-bar,#hero-cv-download,#recruiter-cv-style').forEach(el => el.remove());
    if (!document.getElementById('compact-cv-style')) {
      const style = document.createElement('style');
      style.id = 'compact-cv-style';
      style.textContent = `
        @media(max-width:700px){
          .nav{flex-wrap:nowrap!important;gap:8px!important}
          .nav .brand{flex:1 1 auto!important;min-width:0!important;gap:6px}
          .nav .brand-mark{width:30px;height:30px;flex-shrink:0}
          .nav .brand strong{font-size:.68rem;line-height:1.3;white-space:normal;overflow-wrap:anywhere}
          .nav .brand small{display:none}
          .nav .nav-actions{width:auto!important;flex:0 0 auto;gap:5px!important}
          .nav-actions #cv-link{display:inline-flex!important;flex:0 0 auto!important;width:auto!important;min-width:0!important;min-height:40px!important;padding:8px 11px!important;font-size:.74rem!important;line-height:1.2!important;box-shadow:none!important;border:1px solid rgba(66,199,255,.4)!important;background:rgba(66,199,255,.1)!important;color:#dff7ff!important}
          .nav-actions #cv-link:before{display:none!important}
          .nav-actions .lang button{min-width:32px!important;min-height:36px!important;padding:7px!important;font-size:.62rem}
        }`;
      document.head.appendChild(style);
    }
    const link = document.getElementById('cv-link');
    if (link && matchMedia('(max-width:700px)').matches) {
      const english = document.documentElement.lang.toLowerCase().startsWith('en');
      link.textContent = english ? 'CV ↓' : 'Lebenslauf ↓';
      link.setAttribute('aria-label', english ? 'Download CV (PDF)' : 'Lebenslauf herunterladen (PDF)');
    }
  };
  const loadScript = (src) => new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.defer = false;
    s.onload = resolve;
    s.onerror = reject;
    document.body.appendChild(s);
  });
  const loadCss = (href) => {
    if (document.querySelector(`link[data-refinement="${href}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.dataset.refinement = href;
    document.head.appendChild(link);
  };
  const boot = async () => {
    if (window.__networkVisualBooted) return;
    window.__networkVisualBooted = true;
    compactCv();
    new MutationObserver(compactCv).observe(document.documentElement, {attributes:true,attributeFilter:['lang']});
    try {
      loadCss('assets/css/lab-command-center.css?v=4');
      loadCss('assets/css/recruiter-refinement.css?v=5');
      await loadScript('assets/js/lab-command-center.js?v=4');
      loadCss('assets/css/infrastructure-depth.css?v=4');
      await loadScript('assets/js/network-lab-v3.js?v=8');
      await loadScript('assets/js/recruiter-polish.js?v=5');
      await loadScript('assets/js/infrastructure-depth.js?v=4');
      await loadScript('assets/js/portfolio-priority.js?v=4');
      await loadScript('assets/js/projects-showcase.js?v=4');
      await loadScript('assets/js/voip-packet-fix.js?v=1');
    } catch (err) {
      console.error('Portfolio enhancement loader failed', err);
    } finally {
      compactCv();
    }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
