// Simple accessible navigation toggle
(function(){
  const btn = document.querySelector('.nav-toggle');
  const nav = document.getElementById('main-navigation');
  if(!btn || !nav) return;

  function setOpen(open){
    nav.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(Boolean(open)));
  }

  btn.addEventListener('click', ()=>{
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    setOpen(!isOpen);
    if(!isOpen){
      // move focus to first link for accessibility
      const first = nav.querySelector('a');
      if(first) first.focus();
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape') setOpen(false);
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
    if(e.target.tagName === 'A') setOpen(false);
  });
})();
