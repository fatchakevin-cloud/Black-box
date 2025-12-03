// Simple animation helpers: reveal on scroll + smooth scroll for anchors
document.addEventListener('DOMContentLoaded', function(){
  // Reveal on scroll using IntersectionObserver
  const reveals = document.querySelectorAll('.reveal-hidden');
  if('IntersectionObserver' in window){
    const obs = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('reveal-visible');
          entry.target.classList.add('fade-in-up');
          observer.unobserve(entry.target);
        }
      });
    }, {threshold: 0.12});
    reveals.forEach(el => obs.observe(el));
  } else {
    // Fallback: show all
    reveals.forEach(el => el.classList.add('reveal-visible'));
  }

  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e){
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if(target) target.scrollIntoView({behavior:'smooth', block:'start'});
    });
  });

  // FAQ accordion
  document.querySelectorAll('.faq .item').forEach(item => {
    const q = item.querySelector('.question');
    const a = item.querySelector('.answer');
    if(q && a){
      a.style.display = 'none';
      q.addEventListener('click', () => {
        const isVisible = a.style.display === 'block';
        a.style.display = isVisible ? 'none' : 'block';
      });
    }
  });
});
