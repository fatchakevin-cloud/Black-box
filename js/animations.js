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

      /* Testimonials carousel (if present) */
      const carousel = document.querySelector('.testimonials .grid');
      if(carousel){
        let idx = 0;
        const slides = carousel.querySelectorAll('.card');
        const total = slides.length;
        function show(i){
          slides.forEach((s, n) => {
            s.style.transform = `translateX(${(n - i) * 100}%)`;
          });
        }
        show(idx);
        setInterval(() => { idx = (idx+1) % total; show(idx); }, 5000);
      }

      /* Form submit: AJAX to Formspree + optional WhatsApp open */
      const form = document.getElementById('contactForm');
      if(form){
        form.addEventListener('submit', async function(e){
          e.preventDefault();
          const submitBtn = form.querySelector('button[type="submit"]');
          submitBtn.disabled = true;
          const data = new FormData(form);
          try{
            const res = await fetch(form.action, {
              method: 'POST',
              body: data,
              headers: { 'Accept': 'application/json' }
            });
            if(res.ok){
              // show success message
              alert('Message envoyé — nous vous contacterons bientôt.');
              // if checked, open WhatsApp prefilled for visitor to send
              const sendWA = document.getElementById('sendWhatsApp');
              if(sendWA && sendWA.checked){
                const waNumber = form.dataset.waNumber; // e.g. 2250714606562
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
            submitBtn.disabled = false;
          }
        });
      }
    }
  });
});
