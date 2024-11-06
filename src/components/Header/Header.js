import './Header.css';
import { BaseComponent } from "../componentSystem.js";

export default class Header extends BaseComponent {
  init() {
    this.isOpen = false;

    this.dom = {
      hamburger: this.element.querySelector('#hamburger'),
      nav: this.element.querySelector('nav')
    };

    this.addEventListener(this.dom.hamburger, 'click', this.toggle.bind(this));
  }

  openMenu() {
    this.dom.nav.classList.add('showing');
    this.dom.nav.offsetHeight; // force reflow
    requestAnimationFrame(() => { this.dom.nav.classList.add('animated') });
  }

  closeMenu() {
    this.dom.nav.classList.remove('animated');
    this.dom.nav.addEventListener('transitionend', () => {
      this.dom.nav.classList.remove('showing');
    }, { once: true });
  }

  toggle() {
    const showing = this.dom.hamburger.getAttribute('aria-expanded') === 'true';
    this.isOpen = showing;

    this.dom.hamburger.setAttribute('aria-expanded', showing ? 'false' : 'true');
    showing ? this.closeMenu() : this.openMenu();
  }
}