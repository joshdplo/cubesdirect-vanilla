import './styles/reset.css';
import './styles/style.css';
import header from './scripts/header';
import registerForm from './scripts/registerForm';
import loginForm from './scripts/loginForm';
import changePasswordForm from './scripts/changePasswordForm';
import addToCartButtons from './scripts/addToCartButtons';

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