import { registerComponent, initComponents } from "../../components/componentSystem.js";
import Header from "../../components/Header/Header.js";
import CubeCustomizer from "../../components/CubeCustomizer/CubeCustomizer.js";
import AddToCartButton from "../../components/AddToCartButton/AddToCartButton";
import Checkout from "../../components/Checkout/Checkout.js";

import FormHandler from "../FormHandler.js";
import { userSchema } from '../../../validation/userSchema.js';
import { cartItemSchema } from "../../../validation/cartItemSchema.js";

export default function globalBundle() {
  // Global Components
  registerComponent('header', Header);
  registerComponent('cubeCustomizer', CubeCustomizer);
  registerComponent('addToCartButton', AddToCartButton);
  registerComponent('checkout', Checkout);

  // Global Forms
  const registerForm = document.querySelector('form#register');
  const loginForm = document.querySelector('form#login');
  const cartItemUpdateForm = document.querySelectorAll('form.cart-item-update');
  const cartItemRemoveForm = document.querySelectorAll('form.cart-item-remove');
  const checkoutNewAddressForm = document.querySelector('form#checkout-new-address');

  if (registerForm) new FormHandler(registerForm, userSchema, '/api/auth/register');
  if (loginForm) new FormHandler(loginForm, userSchema, '/api/auth/login');
  if (cartItemUpdateForm.length) [...cartItemUpdateForm].map((formEl) => new FormHandler(formEl, cartItemSchema, '/api/cart/update'));
  if (cartItemRemoveForm.length) [...cartItemRemoveForm].map((formEl) => new FormHandler(formEl, cartItemSchema, '/api/cart/remove'));
  if (checkoutNewAddressForm) new FormHandler(checkoutNewAddressForm, userSchema, '/api/checkout/shipping', { isAddress: true })

  initComponents();
  console.log('-> global bundle loaded');
}