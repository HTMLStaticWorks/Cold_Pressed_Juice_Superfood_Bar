/**
 * Verde & Vita - Main JavaScript
 * Handles Theme Toggling, RTL Support, Sticky Headers, Back-to-Top, and Cart Drawer.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initRtl();
  initStickyHeader();
  initMobileMenu();
  initCart();
  initBackToTop();
});

/* ==========================================================================
   1. Theme Management (Light / Dark)
   ========================================================================== */
function initTheme() {
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const savedTheme = localStorage.getItem('theme') || 'light';
  
  // Apply saved theme
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcons(savedTheme);

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcons(newTheme);
    });
  });
}

function updateThemeIcons(theme) {
  const icons = document.querySelectorAll('.theme-toggle-btn i');
  icons.forEach(icon => {
    if (theme === 'dark') {
      icon.className = 'bi bi-sun';
    } else {
      icon.className = 'bi bi-moon-stars';
    }
  });
}

/* ==========================================================================
   2. RTL / LTR Language Layout Support
   ========================================================================== */
function initRtl() {
  const rtlToggleBtns = document.querySelectorAll('.rtl-toggle-btn');
  const bootstrapCss = document.getElementById('bootstrap-css');
  const savedLayout = localStorage.getItem('layout') || 'ltr';

  // Apply saved layout
  applyLayout(savedLayout, bootstrapCss);

  rtlToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentLayout = document.documentElement.getAttribute('dir') || 'ltr';
      const newLayout = currentLayout === 'rtl' ? 'ltr' : 'rtl';
      applyLayout(newLayout, bootstrapCss);
    });
  });
}

function applyLayout(layout, bootstrapCss) {
  document.documentElement.setAttribute('dir', layout);
  document.documentElement.setAttribute('lang', layout === 'rtl' ? 'ar' : 'en');
  localStorage.setItem('layout', layout);

  // Swap Bootstrap CDN href if the element exists
  if (bootstrapCss) {
    if (layout === 'rtl') {
      bootstrapCss.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.rtl.min.css';
    } else {
      bootstrapCss.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css';
    }
  }

  // Update button texts/labels if required
  const rtlToggleBtns = document.querySelectorAll('.rtl-toggle-btn');
  rtlToggleBtns.forEach(btn => {
    btn.textContent = layout === 'rtl' ? 'LTR' : 'RTL';
  });
}

/* ==========================================================================
   3. Sticky Navbar Header
   ========================================================================== */
function initStickyHeader() {
  const navbar = document.querySelector('.navbar-custom');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Trigger immediately in case page is refreshed while scrolled
}

/* ==========================================================================
   4. Mobile Header Offcanvas Menu
   ========================================================================== */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger-custom');
  const offcanvas = document.getElementById('offcanvas-menu');
  const backdrop = document.querySelector('.offcanvas-backdrop-custom');
  
  if (!hamburger || !offcanvas) return;

  const toggleMenu = () => {
    const isOpen = offcanvas.classList.contains('open');
    if (isOpen) {
      offcanvas.classList.remove('open');
      hamburger.classList.remove('open');
      backdrop.classList.remove('show');
      document.body.style.overflow = '';
    } else {
      offcanvas.classList.add('open');
      hamburger.classList.add('open');
      backdrop.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
  };

  hamburger.addEventListener('click', toggleMenu);
  backdrop.addEventListener('click', toggleMenu);

  // Close menu when clicking links
  const links = offcanvas.querySelectorAll('.nav-link-custom');
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      if (link.classList.contains('dropdown-toggle')) {
        return; // Don't close menu if clicking a dropdown toggle
      }
      offcanvas.classList.remove('open');
      hamburger.classList.remove('open');
      backdrop.classList.remove('show');
      document.body.style.overflow = '';
    });
  });
}

/* ==========================================================================
   5. Interactive Client-Side Cart Drawer
   ========================================================================== */
let cartItems = [];

function initCart() {
  const cartDrawer = document.getElementById('cart-drawer');
  const cartToggleBtns = document.querySelectorAll('.cart-toggle-btn');
  const cartCloseBtn = document.getElementById('cart-close-btn');
  const cartBackdrop = document.querySelector('.offcanvas-backdrop-custom');
  const addCartBtns = document.querySelectorAll('.add-to-cart-btn');

  // Load cart items from localStorage
  const storedCart = localStorage.getItem('cart');
  if (storedCart) {
    try {
      cartItems = JSON.parse(storedCart);
      updateCartUI();
    } catch (e) {
      cartItems = [];
    }
  }

  // Toggle Cart Drawer
  const openCart = () => {
    if (cartDrawer) {
      cartDrawer.classList.add('open');
      if (cartBackdrop) cartBackdrop.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeCart = () => {
    if (cartDrawer) {
      cartDrawer.classList.remove('open');
      if (cartBackdrop && !document.getElementById('offcanvas-menu')?.classList.contains('open')) {
        cartBackdrop.classList.remove('show');
      }
      document.body.style.overflow = '';
    }
  };

  cartToggleBtns.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    openCart();
  }));

  if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCart);
  if (cartBackdrop) {
    cartBackdrop.addEventListener('click', () => {
      closeCart();
    });
  }

  // Bind Add to Cart Buttons
  addCartBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const productCard = btn.closest('.glass-card') || btn.closest('.product-detail-card') || btn.closest('[data-product-name]');
      if (!productCard) return;

      const name = productCard.getAttribute('data-product-name') || productCard.querySelector('h3, h4, .juice-title')?.textContent.trim();
      const price = parseFloat(productCard.getAttribute('data-product-price') || productCard.querySelector('.price')?.textContent.replace(/[^0-9.]/g, ''));
      const image = productCard.getAttribute('data-product-img') || productCard.querySelector('.juice-card-img, img')?.src;
      
      addToCart({ name, price, image });
      openCart();
    });
  });
}

function addToCart(product) {
  const existingItemIndex = cartItems.findIndex(item => item.name === product.name);
  if (existingItemIndex > -1) {
    cartItems[existingItemIndex].quantity += 1;
  } else {
    cartItems.push({
      ...product,
      quantity: 1
    });
  }

  localStorage.setItem('cart', JSON.stringify(cartItems));
  updateCartUI();
}

function updateCartUI() {
  const cartCountBadges = document.querySelectorAll('.cart-count-badge');
  const cartItemsContainer = document.getElementById('cart-items-container');
  const cartSubtotalEl = document.getElementById('cart-subtotal');
  
  // Total Quantity calculation
  const totalQty = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  cartCountBadges.forEach(badge => {
    badge.textContent = totalQty;
    badge.style.display = totalQty > 0 ? 'inline-flex' : 'none';
  });

  if (!cartItemsContainer) return;

  if (cartItems.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="text-center py-5 opacity-50">
        <i class="bi bi-cart3 display-1 mb-3 text-brand-primary"></i>
        <p>Your wellness cart is empty.</p>
      </div>
    `;
    if (cartSubtotalEl) cartSubtotalEl.textContent = '$0.00';
    return;
  }

  let htmlContent = '';
  let subtotal = 0;

  cartItems.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;
    
    htmlContent += `
      <div class="cart-item-row">
        <div class="d-flex align-items-center gap-3">
          <img src="${item.image || 'assets/images/green_detox.png'}" class="cart-item-img" alt="${item.name}">
          <div>
            <h6 class="mb-0 text-brand-primary font-weight-500">${item.name}</h6>
            <small class="text-muted">$${item.price.toFixed(2)} each</small>
            <div class="d-flex align-items-center gap-2 mt-1">
              <button class="btn btn-sm btn-light py-0 px-2" onclick="changeQuantity(${index}, -1)">-</button>
              <span>${item.quantity}</span>
              <button class="btn btn-sm btn-light py-0 px-2" onclick="changeQuantity(${index}, 1)">+</button>
            </div>
          </div>
        </div>
        <div class="text-end">
          <span class="font-weight-500">$${itemTotal.toFixed(2)}</span>
          <button class="btn text-danger btn-sm d-block ms-auto p-0 border-0 bg-transparent mt-1" onclick="removeItem(${index})">
            <i class="bi bi-trash-fill"></i>
          </button>
        </div>
      </div>
    `;
  });

  cartItemsContainer.innerHTML = htmlContent;
  if (cartSubtotalEl) cartSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
}

// Attach cart modification functions globally for quick inline template actions
window.changeQuantity = function(index, change) {
  cartItems[index].quantity += change;
  if (cartItems[index].quantity <= 0) {
    cartItems.splice(index, 1);
  }
  localStorage.setItem('cart', JSON.stringify(cartItems));
  updateCartUI();
};

window.removeItem = function(index) {
  cartItems.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cartItems));
  updateCartUI();
};

/* ==========================================================================
   6. Back-To-Top Button
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.querySelector('.btn-back-to-top');
  if (!backToTopBtn) return;

  const toggleBackToTop = () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  };

  window.addEventListener('scroll', toggleBackToTop);
  
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
