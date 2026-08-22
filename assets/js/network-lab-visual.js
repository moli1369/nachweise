(() => {
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
    try {
      loadCss('assets/css/recruiter-refinement.css?v=5');
      loadCss('assets/css/infrastructure-depth.css?v=4');
      await loadScript('assets/js/network-lab-v3.js?v=8');
      await loadScript('assets/js/recruiter-polish.js?v=5');
      await loadScript('assets/js/infrastructure-depth.js?v=4');
      await loadScript('assets/js/portfolio-priority.js?v=4');
      await loadScript('assets/js/projects-showcase.js?v=3');
      await loadScript('assets/js/voip-packet-fix.js?v=1');
    } catch (err) {
      console.error('Portfolio enhancement loader failed', err);
    }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
