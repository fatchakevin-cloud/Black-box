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
    // Safety fallback: if observer doesn't trigger (rare), reveal after 1.5s
    setTimeout(() => {
      reveals.forEach(el => {
        if(!el.classList.contains('reveal-visible')){
          el.classList.add('reveal-visible');
          el.classList.add('fade-in-up');
        }
      });
    }, 1500);
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
      // Use CSS max-height animation by toggling .open on the item
      item.classList.remove('open');
      q.setAttribute('role','button');
      q.setAttribute('aria-expanded','false');
      q.addEventListener('click', () => {
        const isOpen = item.classList.toggle('open');
        q.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    }
  });
  
  /* Testimonials carousel (separate from FAQ) */
  (function initTestimonials(){
    const carousel = document.querySelector('.testimonials .grid');
    if(!carousel) return;
    const slides = carousel.querySelectorAll('.testimonial-slide');
    const total = slides.length;
    if(total === 0) return;

    // position slides horizontally
    slides.forEach((s, n) => { s.style.transform = `translateX(${n * 100}%)`; });

    let idx = 0;
    let intervalId = null;

    function show(i){
      slides.forEach((s, n) => { s.style.transform = `translateX(${(n - i) * 100}%)`; });
    }

    function start(){
      if(intervalId) return;
      intervalId = setInterval(() => { idx = (idx + 1) % total; show(idx); }, 5000);
    }

    function stop(){
      if(intervalId){ clearInterval(intervalId); intervalId = null; }
    }

    // start automatically
    show(idx);
    if(total > 1) start();

    // pause on hover
    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);
  })();

  /* Form submit: AJAX to Formspree + optional WhatsApp open */
  (function initContactForm(){
    const form = document.getElementById('contactForm');
    if(!form) return;
    form.addEventListener('submit', async function(e){
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      if(submitBtn) submitBtn.disabled = true;
      const data = new FormData(form);
      try{
        const res = await fetch(form.action, {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        });
        if(res.ok){
          alert('Message envoyé — nous vous contacterons bientôt.');
          const sendWA = document.getElementById('sendWhatsApp');
          if(sendWA && sendWA.checked){
            const waNumber = form.dataset.waNumber || '';
            const name = encodeURIComponent(data.get('name')||'');
            const subj = encodeURIComponent(data.get('subject')||'');
            const msg = encodeURIComponent(data.get('message')||'');
            const phone = encodeURIComponent(data.get('phone')||'');
            const text = `Nom:%20${name}%0ASujet:%20${subj}%0AT%C3%A9l:%20${phone}%0A%0A${msg}`;
            const waURL = `https://wa.me/${waNumber}?text=${text}`;
            window.open(waURL,'_blank');
          }
          form.reset();
        } else {
          alert('Une erreur est survenue. Veuillez réessayer ou nous contacter par email.');
        }
      } catch(err){
        console.error(err);
        alert('Erreur réseau. Veuillez réessayer.');
      } finally{
        if(submitBtn) submitBtn.disabled = false;
      }
    });
  })();

