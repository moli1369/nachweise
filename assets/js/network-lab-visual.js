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
      loadCss('assets/css/recruiter-refinement.css?v=1');
      await loadScript('assets/js/network-lab-v3.js?v=4');
      await loadScript('assets/js/recruiter-polish.js?v=1');
    } catch (err) {
      console.error('Portfolio enhancement loader failed', err);
    }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
