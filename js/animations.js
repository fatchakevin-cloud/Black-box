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

  // FAQ accordion - SIMPLIFIED APPROACH
  (function initFAQ() {
    function setupFAQ() {
      const faqItems = document.querySelectorAll('.faq .item');
      if(faqItems.length === 0) return;
      
      faqItems.forEach(item => {
        const question = item.querySelector('.question');
        if (!question) return;
        
        // Vérifier si déjà initialisé
        if(question.dataset.faqInitialized === 'true') return;
        question.dataset.faqInitialized = 'true';
        
        question.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          item.classList.toggle('open');
        });
        
        // Support tactile pour mobile
        question.addEventListener('touchend', function(e) {
          e.preventDefault();
          e.stopPropagation();
          item.classList.toggle('open');
        });
      });
    }
    
    // Essayer immédiatement si DOM est prêt
    if(document.readyState === 'loading'){
      document.addEventListener('DOMContentLoaded', setupFAQ);
    } else {
      setupFAQ();
    }
    
    // Essayer aussi après un court délai
    setTimeout(setupFAQ, 200);
  })();
  
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

  /* Carousel des boîtes postales */
  (function initBoxCarousel(){
    const carousel = document.querySelector('.box-carousel');
    if(!carousel) return;
    const slides = carousel.querySelectorAll('.carousel-slide');
    const indicators = carousel.querySelectorAll('.indicator');
    const total = slides.length;
    if(total === 0) return;

    let currentIndex = 0;
    let intervalId = null;
    let touchStartX = 0;
    let touchEndX = 0;
    let isSwiping = false;

    function showSlide(index){
      if(index < 0 || index >= total) return;
      
      // Remove active class from all slides and indicators
      slides.forEach(slide => slide.classList.remove('active'));
      indicators.forEach(indicator => indicator.classList.remove('active'));
      
      // Add active class to current slide and indicator
      if(slides[index]) {
        slides[index].classList.add('active');
      }
      if(indicators[index]) {
        indicators[index].classList.add('active');
      }
      
      currentIndex = index;
    }

    function nextSlide(){
      const next = (currentIndex + 1) % total;
      showSlide(next);
    }

    function prevSlide(){
      const prev = (currentIndex - 1 + total) % total;
      showSlide(prev);
    }

    function goToSlide(index){
      if(index >= 0 && index < total){
        showSlide(index);
        resetInterval();
      }
    }

    function startInterval(){
      if(intervalId) clearInterval(intervalId);
      if(total > 1) {
        intervalId = setInterval(function(){
          if(!isSwiping) nextSlide();
        }, 3000);
      }
    }

    function resetInterval(){
      startInterval();
    }

    // Add click/touch handlers to indicators
    indicators.forEach((indicator, index) => {
      function handleIndicatorClick(e){
        e.preventDefault();
        e.stopPropagation();
        goToSlide(index);
      }
      indicator.addEventListener('click', handleIndicatorClick);
      indicator.addEventListener('touchend', handleIndicatorClick);
    });

    // Touch swipe support for mobile
    carousel.addEventListener('touchstart', function(e){
      isSwiping = true;
      touchStartX = e.changedTouches[0].screenX;
      if(intervalId) clearInterval(intervalId);
    }, {passive: true});

    carousel.addEventListener('touchmove', function(e){
      isSwiping = true;
    }, {passive: true});

    carousel.addEventListener('touchend', function(e){
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
      setTimeout(function(){
        isSwiping = false;
        resetInterval();
      }, 100);
    }, {passive: true});

    function handleSwipe(){
      const swipeThreshold = 50;
      const diff = touchStartX - touchEndX;
      
      if(Math.abs(diff) > swipeThreshold){
        if(diff > 0){
          // Swipe left - next slide
          nextSlide();
        } else {
          // Swipe right - previous slide
          prevSlide();
        }
      }
    }

    // Pause on hover (desktop only)
    carousel.addEventListener('mouseenter', function(){
      if(intervalId) clearInterval(intervalId);
    });

    carousel.addEventListener('mouseleave', function(){
      resetInterval();
    });

    // Start the carousel
    showSlide(0);
    startInterval();
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
  })()
});