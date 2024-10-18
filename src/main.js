import './css/reset.css';
import './css/style.css';
import header from './js/header';
import forms from './js/forms/forms.js';
import { globalMessageOnLoad, globalMessage } from './js/globalMessage.js';
import addToCartButtons from './js/addToCartButtons';

/**
 * DOM Load
 */
document.addEventListener('DOMContentLoaded', function onDOMLoad() {
  console.log(`-> main.js`);

  globalMessageOnLoad();
  header();
  forms();
  addToCartButtons();
});