(() => {
  const load = (src) => new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.defer = false;
    s.onload = resolve;
    s.onerror = reject;
    document.body.appendChild(s);
  });

  const boot = async () => {
    if (window.__networkVisualBooted) return;
    window.__networkVisualBooted = true;
    try {
      await load('assets/js/network-lab-v3.js?v=4');
      await load('assets/js/recruiter-polish.js?v=1');
    } catch (err) {
      console.error('Portfolio enhancement loader failed', err);
    }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
