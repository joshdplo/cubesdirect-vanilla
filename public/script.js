// Header Mock
const Header = {
  isActive: false, //document.windowWidth > xxx etc. for the desktop, skipping for now FIX IT IN POST

  elements: {
    hamburger: document.querySelector('#hamburger'),
    menu: document.querySelector('header nav')
  },

  onHamburgerClick: () => {
    const menuIsHidden = Header.elements.menu.getAttribute('aria-hidden') === 'true';
    Header.elements.menu.setAttribute('aria-hidden', menuIsHidden ? 'false' : 'true');
  },

  addEventListeners: () => {
    Header.elements.hamburger.addEventListener('click', Header.onHamburgerClick);
  },

  init: () => {
    Header.addEventListeners();
  }
}

// DOM Loaded
document.addEventListener('DOMContentLoaded', function onDOMLoad() {
  console.log(`-> script.js`);
  Header.init();
});