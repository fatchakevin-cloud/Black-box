// Simple animation helpers: reveal on scroll + smooth scroll for anchors
document.addEventListener('DOMContentLoaded', function(){
  // Reveal on scroll - SIMPLIFIED: content is visible by default, just add light fade animation
  const reveals = document.querySelectorAll('.reveal-hidden');
  reveals.forEach(el => el.classList.add('fade-in-up'));

  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e){
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if(target) target.scrollIntoView({behavior:'smooth', block:'start'});
    });
  });

  // FAQ accordion
  const faqItems = document.querySelectorAll('.faq .item');
  console.log('FAQ items found:', faqItems.length);
  faqItems.forEach(item => {
    const q = item.querySelector('.question');
    const a = item.querySelector('.answer');
    console.log('FAQ item:', {q, a});
    if(q && a){
      // Use CSS max-height animation by toggling .open on the item
      item.classList.remove('open');
      q.setAttribute('role','button');
      q.setAttribute('aria-expanded','false');
      q.style.cursor = 'pointer';
      q.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Question clicked');
        const isOpen = item.classList.toggle('open');
        q.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        console.log('FAQ toggled:', isOpen);
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

