// Navigation améliorée avec animations et détection de page active
(function(){
  const btn = document.querySelector('.nav-toggle');
  const nav = document.getElementById('main-navigation');
  const header = document.querySelector('.site-header');
  if(!nav) return;

  // Détecter la page active
  function setActivePage(){
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';
    const links = nav.querySelectorAll('a');
    
    links.forEach(link => {
      const linkPath = link.getAttribute('href');
      const linkPage = linkPath.split('/').pop() || 'index.html';
      
      if(linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')){
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // Effet de scroll sur le header
  function handleScroll(){
    if(!header) return;
    if(window.scrollY > 50){
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  // Créer l'overlay pour le menu mobile
  let overlay = document.querySelector('.nav-overlay');
  if(!overlay){
    overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);
  }

  // Gestion du menu mobile
  if(btn && nav){
    function setOpen(open){
      nav.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(Boolean(open)));
      if(overlay) overlay.classList.toggle('active', open);
      // Empêcher le scroll du body quand le menu est ouvert
      if(open){
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }

    // Fermer le menu en cliquant sur l'overlay
    overlay.addEventListener('click', () => {
      if(nav.classList.contains('open')){
        setOpen(false);
      }
    });

    btn.addEventListener('click', (e)=>{
      e.stopPropagation();
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      setOpen(!isOpen);
      if(!isOpen){
        // move focus to first link for accessibility
        const first = nav.querySelector('a');
        if(first) setTimeout(() => first.focus(), 100);
      }
    });

    // Close on Escape
    document.addEventListener('keydown', (e)=>{
      if(e.key === 'Escape' && nav.classList.contains('open')){
        setOpen(false);
        btn.focus();
      }
    });

    // Close when clicking outside the nav on small screens
    document.addEventListener('click', (e)=>{
      if(!nav.classList.contains('open')) return;
      const target = e.target;
      if(target === btn || nav.contains(target)) return;
      setOpen(false);
    });

    // Close when a nav link is activated (useful on mobile)
    nav.addEventListener('click', (e)=>{
      if(e.target.tagName === 'A'){
        // Petit délai pour voir l'animation
        setTimeout(() => setOpen(false), 150);
      }
    });
  }

  // Initialiser
  setActivePage();
  
  // Écouter le scroll
  let ticking = false;
  window.addEventListener('scroll', function(){
    if(!ticking){
      window.requestAnimationFrame(function(){
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  });

  // Vérifier au chargement
  handleScroll();
})();
