/* ==============================================
   Garden Maintenance – Main JavaScript
   ============================================== */

/* ---- Mobile Navigation ---- */
function initNav() {
  const toggle = document.querySelector('.nav-toggle');
  const links  = document.querySelector('.nav-links');
  if (!toggle || !links) return;
  const spans = toggle.querySelectorAll('span');

  function applyToggleState(isOpen) {
    toggle.setAttribute('aria-expanded', isOpen);
    spans[0].style.transform = isOpen ? 'rotate(45deg) translate(5px,5px)' : '';
    spans[1].style.opacity   = isOpen ? '0' : '1';
    spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px,-5px)' : '';
  }

  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
    applyToggleState(links.classList.contains('open'));
  });

  // Close menu when a nav link is clicked
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      applyToggleState(false);
    });
  });
}

/* ---- Image Carousel ---- */
function initCarousel() {
  const carousel = document.querySelector('.carousel');
  if (!carousel) return;

  const track  = carousel.querySelector('.carousel-track');
  const slides = carousel.querySelectorAll('.carousel-slide');
  const dots   = document.querySelectorAll('.carousel-dot');
  const prevBtn = carousel.querySelector('.carousel-btn.prev');
  const nextBtn = carousel.querySelector('.carousel-btn.next');

  let current = 0;
  let autoTimer;

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(next, 4500);
  }

  if (nextBtn) nextBtn.addEventListener('click', () => { next(); startAuto(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); startAuto(); });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); startAuto(); });
  });

  // Touch / swipe support
  let touchStartX = 0;
  carousel.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  carousel.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); startAuto(); }
  }, { passive: true });

  goTo(0);
  startAuto();
}

/* ---- Coverage Map (Leaflet) ---- */
function initMap() {
  const mapEl = document.getElementById('coverage-map');
  if (!mapEl || typeof L === 'undefined') return;

  // Centre between Wadebridge and Polzeath
  const map = L.map('coverage-map', { zoomControl: true, scrollWheelZoom: false })
    .setView([50.545, -4.877], 11);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18
  }).addTo(map);

  // Coverage area circle
  L.circle([50.545, -4.877], {
    radius: 12000,
    color: '#4a8c3f',
    fillColor: '#7abf6b',
    fillOpacity: 0.18,
    weight: 2,
    dashArray: '6 4'
  }).addTo(map);

  // Custom marker icon
  const greenIcon = L.divIcon({
    className: '',
    html: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">
      <path d="M16 0C7.2 0 0 7.2 0 16c0 11 16 24 16 24S32 27 32 16C32 7.2 24.8 0 16 0z" fill="#2d5a27"/>
      <circle cx="16" cy="16" r="7" fill="#7abf6b"/>
    </svg>`,
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -42]
  });

  const locations = [
    { lat: 50.5165, lng: -4.8348, name: 'Wadebridge', desc: 'Town centre & surrounding parishes' },
    { lat: 50.5748, lng: -4.9187, name: 'Polzeath', desc: 'Coastal village & Rock area' },
    { lat: 50.547,  lng: -4.863,  name: 'St Minver', desc: 'Village & rural surrounds' },
    { lat: 50.526,  lng: -4.804,  name: 'Bodmin Moor edge', desc: 'Eastern coverage boundary' },
    { lat: 50.585,  lng: -4.875,  name: 'Port Isaac area', desc: 'Northern coastal villages' },
  ];

  locations.forEach(loc => {
    L.marker([loc.lat, loc.lng], { icon: greenIcon })
      .addTo(map)
      .bindPopup(`<div class="map-popup-title">${loc.name}</div><div>${loc.desc}</div>`);
  });
}

/* ---- Contact Form ---- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Basic validation
    const required = form.querySelectorAll('[required]');
    let valid = true;
    required.forEach(field => {
      if (!field.value.trim()) {
        field.style.borderColor = '#c0392b';
        valid = false;
      } else {
        field.style.borderColor = '';
      }
    });
    if (!valid) return;

    // Simulate submission (static site – no back-end)
    const btn = form.querySelector('.form-submit');
    btn.disabled = true;
    btn.textContent = 'Sending…';

    setTimeout(() => {
      form.style.display = 'none';
      const success = document.getElementById('form-success');
      if (success) success.style.display = 'block';
    }, 900);
  });
}

/* ---- Active nav link ---- */
function markActiveNav() {
  const page = window.location.pathname.split('/').pop() || '';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}

/* ---- Init ---- */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initCarousel();
  initMap();
  initContactForm();
  markActiveNav();
});
