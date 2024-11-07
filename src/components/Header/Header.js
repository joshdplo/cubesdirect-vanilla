import './Header.css';
import { BaseComponent } from "../componentSystem.js";

export default class Header extends BaseComponent {
  init() {
    this.isOpen = false;
    this.isToggling = false;

    this.dom = {
      hamburger: this.element.querySelector('#hamburger'),
      nav: this.element.querySelector('nav')
    };

    this.addEventListener(this.dom.hamburger, 'click', this.toggle.bind(this));
  }

  openMenu() {
    this.dom.nav.classList.add('showing');
    this.dom.nav.offsetHeight; // force reflow
    requestAnimationFrame(() => {
      this.dom.nav.classList.add('animated');
      document.body.classList.add('nav-open');
      this.isToggling = false;
    });
  }

  closeMenu() {
    this.dom.nav.classList.remove('animated');
    document.body.classList.remove('nav-open');
    this.dom.nav.addEventListener('transitionend', () => {
      this.dom.nav.classList.remove('showing');
      this.isToggling = false;
    }, { once: true });
  }

  toggle() {
    if (this.isToggling) {
      console.log('too slow, cowpoke!');
      return;
    }
    const showing = this.dom.hamburger.getAttribute('aria-expanded') === 'true';
    this.isOpen = showing;

    this.isToggling = true;
    this.dom.hamburger.setAttribute('aria-expanded', showing ? 'false' : 'true');
    showing ? this.closeMenu() : this.openMenu();
  }
}