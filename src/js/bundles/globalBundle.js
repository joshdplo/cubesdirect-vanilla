import { registerComponent, initComponents } from "../../components/componentSystem.js";
import Header from "../../components/Header/Header.js";
import AddToCartButton from "../../components/AddToCartButton/AddToCartButton";
import Checkout from "../../components/Checkout/Checkout.js";

import FormHandler from "../FormHandler.js";
import { userSchema } from '../../../validation/userSchema.js';

export default function globalBundle() {
  // Global Components
  registerComponent('header', Header);
  registerComponent('addToCartButton', AddToCartButton);
  registerComponent('checkout', Checkout);

  // Global Forms
  const registerForm = document.querySelector('form#register');
  const loginForm = document.querySelector('form#login');
  const checkoutNewAddressForm = document.querySelector('form#checkout-new-address');

  if (registerForm) new FormHandler(registerForm, userSchema, '/api/auth/register');
  if (loginForm) new FormHandler(loginForm, userSchema, '/api/auth/login');
  if (checkoutNewAddressForm) new FormHandler(checkoutNewAddressForm, userSchema, '/api/checkout/shipping', { isAddress: true })

  initComponents();
  console.log('-> global bundle loaded');
}