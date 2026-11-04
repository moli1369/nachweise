(() => {
  const ensureCv = () => {
    if (!document.getElementById('recruiter-cv-style')) {
      const style = document.createElement('style');
      style.id = 'recruiter-cv-style';
      style.textContent = `
        #recruiter-cv-bar{display:none}
        #hero-cv-download{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:12px 18px;border-radius:10px;background:#42c7ff;color:#02111b;font:700 15px/1.4 system-ui,sans-serif;text-decoration:none;box-sizing:border-box}
        #hero-cv-download:focus-visible,#recruiter-cv-bar a:focus-visible{outline:3px solid #fff;outline-offset:3px}
        @media(max-width:700px){
          body{padding-bottom:calc(86px + env(safe-area-inset-bottom,0px))!important}
          #hero-cv-download{width:100%;order:-1}
          #recruiter-cv-bar{display:flex!important;position:fixed!important;inset:auto 0 0!important;z-index:2147483647!important;gap:10px;align-items:center;padding:12px 16px calc(12px + env(safe-area-inset-bottom,0px));background:#07101c;border-top:1px solid #42c7ff;box-shadow:0 -6px 24px rgba(0,0,0,.3);box-sizing:border-box}
          #recruiter-cv-bar a{display:flex!important;align-items:center;justify-content:center;width:100%;min-height:48px;border-radius:10px;background:#42c7ff;color:#02111b;font:700 15px/1.4 system-ui,sans-serif;text-decoration:none;padding:10px 14px;box-sizing:border-box}
        }` ;
      document.head.appendChild(style);
    }
    if (!document.getElementById('recruiter-cv-bar')) {
      const bar = document.createElement('div');
      bar.id = 'recruiter-cv-bar';
      const link = document.createElement('a');
      link.dataset.recruiterCv = 'true';
      link.setAttribute('download', '');
      bar.appendChild(link);
      document.body.appendChild(bar);
    }
    const actions = document.querySelector('.hero-actions');
    if (actions && !document.getElementById('hero-cv-download')) {
      const link = document.createElement('a');
      link.id = 'hero-cv-download';
      link.dataset.recruiterCv = 'true';
      link.setAttribute('download', '');
      actions.prepend(link);
    }
    const english = document.documentElement.lang.toLowerCase().startsWith('en');
    document.querySelectorAll('[data-recruiter-cv]').forEach(link => {
      link.href = english ? 'assets/docs/CV_Mohammad_Askari_Dehestani_EN.pdf' : 'assets/docs/Lebenslauf_Mohammad_Askari_Dehestani.pdf';
      link.textContent = english ? 'Download CV (PDF) ↓' : 'Lebenslauf herunterladen (PDF) ↓';
    });
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
    ensureCv();
    new MutationObserver(ensureCv).observe(document.documentElement, {attributes:true,attributeFilter:['lang']});
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
      ensureCv();
    }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
