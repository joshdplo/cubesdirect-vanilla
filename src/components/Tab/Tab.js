import './Tab.css';
import { BaseComponent } from "../componentSystem.js";

export default class Tab extends BaseComponent {
  init() {
    this.isOpen = false;

    this.id = this.element.getAttribute('id');
    this.contentArea = this.element.parentNode.querySelector(`[aria-labeledby="${this.id}"]`);

    this.focusableChildren = this.getFocusableChildren();

    this.addEventListener(this.element, 'click', this.onButtonClick.bind(this));
    this.addEventListener(this.element, 'keydown', this.onTabKey.bind(this));
  }

  getFocusableChildren() {
    // return DOM list of children that are focusable ()
  }

  openTab() {
    this.element.setAttribute('aria-expanded', 'true');
    this.isOpen = true;
  }

  closeTab() {
    this.element.setAttribute('aria-expanded', 'false');
    this.isOpen = false;
  }

  onButtonClick() {
    this.isOpen ? this.closeTab() : this.openTab();
  }

  onTabKey(e) {
    if (e.key === 'Tab') console.log('tabered');
  }
}