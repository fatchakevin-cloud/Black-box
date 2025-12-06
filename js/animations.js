// Advanced animation helpers: reveal on scroll + smooth scroll for anchors
document.addEventListener('DOMContentLoaded', function(){
  // Intersection Observer for scroll animations - Amélioré
  const isMobile = window.innerWidth <= 560;
  const observerOptions = {
    threshold: isMobile ? 0.05 : 0.1,
    rootMargin: isMobile ? '0px 0px -30px 0px' : '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach((entry, index) => {
      if(entry.isIntersecting) {
        const element = entry.target;
        const delay = index * 0.1;
        
        requestAnimationFrame(() => {
          setTimeout(() => {
            element.classList.add('reveal-visible');
            
            // Add specific animation classes based on element type
            if(element.classList.contains('feature')) {
              element.style.animationDelay = `${delay}s`;
              element.classList.add('fade-in-up');
            } else if(element.classList.contains('card')) {
              element.style.animationDelay = `${delay}s`;
              element.classList.add('scale-in');
            } else if(element.classList.contains('image-animate')) {
              element.classList.add('fade-in-up');
            } else {
              element.classList.add('fade-in-up');
            }
          }, delay * 100);
        });
        
        observer.unobserve(element);
      }
    });
  }, observerOptions);

  // Observe all reveal-hidden elements
  function observeElements() {
    const reveals = document.querySelectorAll('.reveal-hidden, .image-animate');
    reveals.forEach((el, index) => {
      if(el.classList.contains('reveal-visible')) return;
      
      // Stagger animations for grid items
      if(el.parentElement && el.parentElement.classList.contains('grid')) {
        const gridItems = Array.from(el.parentElement.children);
        const itemIndex = gridItems.indexOf(el);
        el.style.transitionDelay = `${itemIndex * 0.1}s`;
      }
      observer.observe(el);
    });

    // Animate features with stagger effect
    const features = document.querySelectorAll('.feature');
    features.forEach((feature, index) => {
      if(!feature.classList.contains('reveal-visible')) {
        feature.style.animationDelay = `${index * 0.15}s`;
        observer.observe(feature);
      }
    });

    // Animate cards with stagger effect
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
      if(!card.classList.contains('reveal-visible')) {
        card.style.animationDelay = `${index * 0.1}s`;
        observer.observe(card);
      }
    });
  }

  // Initialiser immédiatement et après chargement
  if(document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observeElements);
  } else {
    observeElements();
  }
  
  // Réobserver après un délai pour s'assurer que tout est chargé
  setTimeout(observeElements, 200);
  
  // Réobserver après resize pour gérer le changement mobile/desktop
  let resizeTimer;
  window.addEventListener('resize', function(){
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function(){
      observeElements();
    }, 250);
  });

  // Smooth scroll for internal links - Amélioré
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e){
      const href = this.getAttribute('href');
      if(href === '#' || href === '#!') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      if(target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        
        // Add animation trigger
        setTimeout(() => {
          target.classList.add('reveal-visible');
        }, 500);
      }
    });
  });

  // Add scroll-triggered header animation
  let lastScroll = 0;
  const header = document.querySelector('.site-header');
  if(header) {
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      if(currentScroll > 100) {
        header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
        header.style.transform = 'translateY(0)';
      } else {
        header.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
      }
      lastScroll = currentScroll;
    });
  }

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

  /* Compteurs animés pour les statistiques */
  (function initAnimatedCounters(){
    const counters = document.querySelectorAll('.stat-number');
    if(counters.length === 0) return;

    const animateCounter = (counter) => {
      const target = parseInt(counter.getAttribute('data-target')) || 0;
      const duration = 2000; // 2 secondes
      const increment = target / (duration / 16); // 60fps
      let current = 0;

      const updateCounter = () => {
        current += increment;
        if(current < target) {
          counter.textContent = Math.floor(current);
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target;
        }
      };

      updateCounter();
    };

    // Observer pour déclencher l'animation quand la section est visible
    const statsSection = document.querySelector('.stats-section');
    if(statsSection) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if(entry.isIntersecting) {
            counters.forEach(counter => {
              if(!counter.classList.contains('animated')) {
                counter.classList.add('animated');
                animateCounter(counter);
              }
            });
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
      });

      observer.observe(statsSection);
    }
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