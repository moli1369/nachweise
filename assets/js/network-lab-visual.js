(() => {
  const loadCleanLab = () => {
    if (window.__cleanLabLoaded) return;
    window.__cleanLabLoaded = true;
    const s = document.createElement('script');
    s.src = 'assets/js/network-lab-clean.js?v=1';
    s.defer = true;
    document.body.appendChild(s);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', loadCleanLab, { once:true });
  else loadCleanLab();
})();
