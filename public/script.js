// Header Mock
function header() {
  const hamburger = document.querySelector('#hamburger');
  const menu = document.querySelector('header nav');

  hamburger.addEventListener('click', () => {
    const isHidden = menu.getAttribute('aria-hidden') === 'true';
    hamburger.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
    menu.setAttribute('aria-hidden', isHidden ? 'false' : 'true');
  });
}

// DOM Loaded
document.addEventListener('DOMContentLoaded', function onDOMLoad() {
  console.log(`-> script.js`);

  header();
});