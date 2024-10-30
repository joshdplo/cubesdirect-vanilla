/**
 * Base Component Class
 */
export class BaseComponent {
  static isMobile = window.innerWidth < 768;
  static scrollY = window.scrollY || 0;
  static scrollDir = 'down';
  static components = [];

  constructor(element) {
    this.element = element;
    if (!this.element) throw new Error('BaseComponent was not passed an element');
    this.eventListeners = [];

    BaseComponent.components.push(this);

    this.init();
  }

  // static method to handle global window scroll
  static handleScroll() {
    BaseComponent.scrollDir = window.scrollY > BaseComponent.scrollY ? 'down' : 'up';
    BaseComponent.scrollY = window.scrollY;

    BaseComponent.components.forEach((component) => component.onScroll());
  }

  // static method to handle global window resize
  static handleResize() {
    const isNowMobile = window.innerWidth < 768;
    if (isNowMobile !== BaseComponent.isMobile) {
      BaseComponent.isMobile = isNowMobile;

      console.log(`isMobile changed: ${isNowMobile}`);
      BaseComponent.components.forEach((component) => component.onResize());
    }
  }

  // scroll handler per-component
  onScroll() {
    console.log(`Scroll detected in ${this.constructor.name}. y: ${BaseComponent.scrollY}, direction: ${BaseComponent.scrollDir}`);
  }

  // resize handler per-component
  onResize() {
    console.log(`Resize detected in ${this.constructor.name}. isMobile: ${BaseComponent.isMobile}`);
  }

  // register global resize listener once
  static registerGlobalResizeListener() {
    window.addEventListener('resize', BaseComponent.handleResize);
  }

  // initialize component
  init() {
    console.warn(`Component ${this.constructor.name} does not have an init method`);
  }

  // add event listener and track it for clean up
  addEventListener(target, event, handler) {
    target.addEventListener(event, handler);
    this.eventListeners.push({ target, event, handler });
  }

  // remove all tracked event listeners
  removeEventListeners() {
    this.eventListeners.forEach(({ target, event, handler }) => {
      target.removeEventListener(event, handler);
    });
    this.eventListeners = [];
  }

  // destroy component and clean up
  destroy() {
    this.removeEventListeners();
    console.log(`Component ${this.constructor.name} destroyed`);
  }
}

BaseComponent.registerGlobalResizeListener();

/**
 * Component Registry
 */
const componentRegistry = new Map();
export function registerComponent(name, componentClass) {
  if (componentRegistry.has(name)) {
    console.warn(`Component "${name}" is already registered`);
    return;
  }

  componentRegistry.set(name, componentClass);
}

/**
 * Component Initialization
 */
export function initComponents() {
  componentRegistry.forEach((ComponentClass, name) => {
    const elements = document.querySelectorAll(`[data-cmp="${name}"]`);
    elements.forEach((element) => new ComponentClass(element));
  });
}