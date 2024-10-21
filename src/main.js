import './js/globalSetup.js';
import './css/reset.css';
import './css/style.css';
import header from './js/header';
import forms from './js/forms/forms.js';
import addToCartButtons from './js/cart/addToCartButtons.js';
import './js/globalMessages.js';

/**
 * DOM Load
 */
document.addEventListener('DOMContentLoaded', function onDOMLoad() {
  console.log(`-> main.js`);

  header();
  forms();
  addToCartButtons();
});