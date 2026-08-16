(() => {
  // Network Lab v3 is the final renderer. It replaces the legacy lab markup.
  const loadLab = () => {
    if (window.__networkLabV3Loaded) return;
    window.__networkLabV3Loaded = true;
    const s = document.createElement('script');
    s.src = 'assets/js/network-lab-v3.js?v=3';
    s.defer = false;
    document.body.appendChild(s);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', loadLab, { once: true });
  else loadLab();
})();
