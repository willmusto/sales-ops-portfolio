// Sticky header
const header = document.querySelector('.site-header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 8);
  }, { passive: true });
}

// Mobile nav toggle
const toggle = document.querySelector('.nav-toggle');
const navList = document.querySelector('.site-nav ul');
if (toggle && navList) {
  toggle.addEventListener('click', () => {
    const open = navList.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });

  // Close nav when a link is clicked
  navList.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navList.classList.remove('open');
      toggle.setAttribute('aria-expanded', false);
    });
  });
}
