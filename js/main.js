/**
 * AlignED Paper Site — Main JavaScript
 * Handles mobile navigation toggle and active link highlighting.
 */
document.addEventListener('DOMContentLoaded', function() {
  /* Mobile nav toggle */
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('nav');

  if (navToggle && nav) {
    navToggle.addEventListener('click', function() {
      nav.classList.toggle('active');
    });
  }

  /* Close nav when clicking outside */
  document.addEventListener('click', function(e) {
    if (nav && nav.classList.contains('active') &&
        !nav.contains(e.target) &&
        navToggle && !navToggle.contains(e.target)) {
      nav.classList.remove('active');
    }
  });

  /* Set active nav link based on current page */
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('nav a');

  navLinks.forEach(function(link) {
    const href = link.getAttribute('href');
    if (currentPath.endsWith(href)) {
      link.classList.add('active');
    }
  });
});
