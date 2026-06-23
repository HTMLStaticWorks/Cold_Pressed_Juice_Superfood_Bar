/**
 * Verde & Vita - Animation Script
 * Handles Interactive Cursor, Card 3D Tilt, Scroll Reveals, Countdown Timers, and Tab Filters.
 */

document.addEventListener('DOMContentLoaded', () => {
  initCustomCursor();
  initTiltCards();
  initScrollReveals();
  initRandomFloating();
  initMenuFilters();
  initGalleryFilters();
  initCountdownTimer();
  initReadingProgressBar();
});

/* ==========================================================================
   1. Interactive Magnetic Custom Cursor
   ========================================================================== */
function initCustomCursor() {
  const cursor = document.querySelector('.custom-cursor');
  if (!cursor) return;

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;

  // Track mouse coordinates
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Smooth lerp follow loop
  const tick = () => {
    const dx = mouseX - cursorX;
    const dy = mouseY - cursorY;
    cursorX += dx * 0.15;
    cursorY += dy * 0.15;
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
    requestAnimationFrame(tick);
  };
  tick();

  // Expand cursor on active buttons/links hover
  const hoverables = document.querySelectorAll('a, button, .btn, [role="button"], .gallery-item, .glass-card, .timeline-content');
  hoverables.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });
}

/* ==========================================================================
   2. 3D Tilt Effect on Juice / Product Cards
   ========================================================================== */
function initTiltCards() {
  const cards = document.querySelectorAll('.glass-card, .pricing-card');
  
  // Disable 3D tilt on touch devices for performance
  if (window.matchMedia('(hover: none)').matches) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within element
      const y = e.clientY - rect.top;  // y position within element
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate rotation angles
      const rotateX = ((centerY - y) / centerY) * 10; // Max 10deg rotation
      const rotateY = ((x - centerX) / centerX) * 10;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      card.style.transition = 'none';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
      card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    });
  });
}

/* ==========================================================================
   3. Scroll Reveal via Intersection Observer
   ========================================================================== */
function initScrollReveals() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target); // Trigger only once
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    // Fallback if IntersectionObserver is not supported
    revealElements.forEach(el => el.classList.add('active'));
  }
}

/* ==========================================================================
   4. Staggered Float Offsets for Leaf/Fruit Elements
   ========================================================================== */
function initRandomFloating() {
  const elements = document.querySelectorAll('.floating-element, .floating-element-reverse');
  elements.forEach((el, index) => {
    // Stagger animation starts and durations slightly
    el.style.animationDelay = `${index * 0.4}s`;
    el.style.animationDuration = `${5 + (index % 3) * 2}s`;
  });
}

/* ==========================================================================
   5. Interactive Category Filters (Menu Page)
   ========================================================================== */
function initMenuFilters() {
  const filterPills = document.querySelectorAll('.menu-nav-pills .nav-link');
  const menuItems = document.querySelectorAll('.menu-item-card');
  const searchInput = document.getElementById('menu-search-input');

  if (filterPills.length === 0 || menuItems.length === 0) return;

  let activeCategory = 'all';
  let searchQuery = '';

  const filterItems = () => {
    menuItems.forEach(item => {
      const category = item.getAttribute('data-category');
      const title = item.querySelector('.juice-title')?.textContent.toLowerCase() || '';
      const ingredients = item.querySelector('.ingredients-list')?.textContent.toLowerCase() || '';
      
      const matchesCategory = activeCategory === 'all' || category === activeCategory;
      const matchesSearch = title.includes(searchQuery) || ingredients.includes(searchQuery);

      if (matchesCategory && matchesSearch) {
        item.style.display = 'block';
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
        }, 50);
      } else {
        item.style.opacity = '0';
        item.style.transform = 'scale(0.9)';
        setTimeout(() => {
          item.style.display = 'none';
        }, 300);
      }
    });
  };

  filterPills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.preventDefault();
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeCategory = pill.getAttribute('data-filter');
      filterItems();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      filterItems();
    });
  }
}

/* ==========================================================================
   6. Gallery Filters & Lightbox (Gallery Page)
   ========================================================================== */
function initGalleryFilters() {
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  
  if (galleryItems.length === 0) return;

  // Filter Logic
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filter = btn.getAttribute('data-filter');
      
      galleryItems.forEach(item => {
        const cat = item.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Lightbox overlay logic
  if (!lightboxModal || !lightboxImg) return;

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('.gallery-img');
      if (img) {
        lightboxImg.src = img.src;
        const modal = new bootstrap.Modal(lightboxModal);
        modal.show();
      }
    });
  });
}

/* ==========================================================================
   7. Launch Countdown (Coming Soon Page)
   ========================================================================== */
function initCountdownTimer() {
  const daysEl = document.getElementById('countdown-days');
  const hoursEl = document.getElementById('countdown-hours');
  const minsEl = document.getElementById('countdown-minutes');
  const secsEl = document.getElementById('countdown-seconds');

  if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

  // Launch in 30 days from current date
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 30);

  const updateCountdown = () => {
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff <= 0) {
      clearInterval(interval);
      document.querySelector('.countdown-wrap').innerHTML = '<h3 class="text-brand-primary">Our juices are officially flowing!</h3>';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minsEl.textContent = String(minutes).padStart(2, '0');
    secsEl.textContent = String(seconds).padStart(2, '0');
  };

  const interval = setInterval(updateCountdown, 1000);
  updateCountdown();
}

/* ==========================================================================
   8. Blog Reading Progress Tracker
   ========================================================================== */
function initReadingProgressBar() {
  const progressBar = document.querySelector('.blog-progress-bar');
  const article = document.querySelector('.blog-details-article');

  if (!progressBar || !article) return;

  const updateProgress = () => {
    const rect = article.getBoundingClientRect();
    const articleHeight = article.offsetHeight;
    const windowHeight = window.innerHeight;
    
    // Calculate how much of the article has been scrolled past the viewport
    let scrolled = 0;
    
    if (rect.top <= 0) {
      const parsedTop = Math.abs(rect.top);
      scrolled = (parsedTop / (articleHeight - windowHeight)) * 100;
    }
    
    progressBar.style.width = `${Math.min(Math.max(scrolled, 0), 100)}%`;
  };

  window.addEventListener('scroll', updateProgress);
  updateProgress();
}
