import './Header.css';
import { BaseComponent } from "../componentSystem.js";

export default class Header extends BaseComponent {
  init() {
    this.isOpen = false;
    this.isToggling = false;

    this.dom = {
      hamburger: this.element.querySelector('#hamburger'),
      nav: this.element.querySelector('nav'),
      pageOverlay: document.querySelector('#page-overlay')
    };

    this.addEventListener(this.dom.hamburger, 'click', this.toggle.bind(this));
    this.addEventListener(this.dom.pageOverlay, 'click', this.toggle.bind(this));
    this.addEventListener(document, 'keyup', this.onDocumentKeyup.bind(this));
  }

  openMenu() {
    this.dom.nav.classList.add('showing');
    this.dom.nav.offsetHeight; // force reflow
    requestAnimationFrame(() => {
      this.dom.nav.classList.add('animated');
      document.body.classList.add('nav-open');
      this.isToggling = false;
      this.isOpen = true;
    });
  }

  closeMenu() {
    document.body.classList.remove('nav-open');
    this.dom.nav.classList.remove('animated');
    this.dom.nav.addEventListener('transitionend', () => {
      this.dom.nav.classList.remove('showing');
      this.isToggling = false;
      this.isOpen = false;
    }, { once: true });
  }

  toggle() {
    if (this.isToggling) {
      console.log('too slow, cowpoke!');
      return;
    }
    const showing = this.dom.hamburger.getAttribute('aria-expanded') === 'true';

    this.isToggling = true;
    this.dom.hamburger.setAttribute('aria-expanded', showing ? 'false' : 'true');
    showing ? this.closeMenu() : this.openMenu();
  }

  onDocumentKeyup(e) {
    if (e.key === 'Escape' && this.isOpen) this.toggle();
  }
}