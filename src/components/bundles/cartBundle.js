import FormHandler from '../../js/forms/FormHandler.js';
import { cartItemSchema } from '../../../validation/cartItemSchema.js';

document.addEventListener('DOMContentLoaded', () => {
  // Cart Forms
  const cartItemUpdateForm = document.querySelectorAll('form.cart-item-update');
  const cartItemRemoveForm = document.querySelectorAll('form.cart-item-remove');
  if (cartItemUpdateForm.length) [...cartItemUpdateForm].map((formEl) => new FormHandler(formEl, cartItemSchema, '/api/cart/update'));
  if (cartItemRemoveForm.length) [...cartItemRemoveForm].map((formEl) => new FormHandler(formEl, cartItemSchema, '/api/cart/remove'));

  console.log('-> cart bundle loaded');
});