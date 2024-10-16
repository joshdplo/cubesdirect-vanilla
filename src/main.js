import './css/reset.css';
import './css/style.css';
import header from './js/header';
import registerForm from './js/registerForm';
import loginForm from './js/loginForm';
import changePasswordForm from './js/changePasswordForm';
import addToCartButtons from './js/addToCartButtons';

/**
 * DOM Load
 */
document.addEventListener('DOMContentLoaded', function onDOMLoad() {
  console.log(`-> main.js`);

  header();
  registerForm();
  loginForm();
  changePasswordForm();
  addToCartButtons();
});