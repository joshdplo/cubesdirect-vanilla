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

  toggle() {
    const showing = this.dom.hamburger.getAttribute('aria-expanded') === 'true';
    this.isOpen = showing;
    this.dom.hamburger.setAttribute('aria-expanded', showing ? 'false' : 'true');
    this.dom.nav.setAttribute('aria-hidden', showing ? 'true' : 'false');
  }
}