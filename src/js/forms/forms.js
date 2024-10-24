import FormHandler from './FormHandler.js';
import { userSchema } from '../../../validation/userSchema.js';
import { cartItemSchema } from '../../../validation/cartItemSchema.js';
import { accountResendEmailVerificationButton } from '../account/accountForms.js';

/**
 * Export forms
 */
export default function forms() {
  // Form elements
  const registerForm = document.querySelector('form#register');
  const loginForm = document.querySelector('form#login');
  const changePasswordForm = document.querySelector('form#change-password');
  const resetPasswordRequestForm = document.querySelector('form#reset-password-request');
  const resetPasswordForm = document.querySelector('form#reset-password');
  const cartItemUpdateForm = document.querySelectorAll('form.cart-item-update');
  const cartItemRemoveForm = document.querySelectorAll('form.cart-item-remove');
  const newAddressForm = document.querySelector('form#new-address');
  const updateAddressForm = document.querySelectorAll('form.update-address');
  const removeAddressForm = document.querySelectorAll('form.remove-address');

  // Auth forms
  if (registerForm) new FormHandler(registerForm, userSchema, '/api/auth/register');
  if (loginForm) new FormHandler(loginForm, userSchema, '/api/auth/login');
  if (changePasswordForm) new FormHandler(changePasswordForm, userSchema, '/api/auth/change-password');
  if (resetPasswordRequestForm) new FormHandler(resetPasswordRequestForm, userSchema, '/api/auth/reset-password-request');
  if (resetPasswordForm) new FormHandler(resetPasswordForm, userSchema, '/api/auth/reset-password', { useGetParamOnPost: true });

  // Address forms
  if (newAddressForm) new FormHandler(newAddressForm, userSchema, '/api/addresses/add', { isAddress: true });
  if (updateAddressForm.length) [...updateAddressForm].map((formEl) => new FormHandler(formEl, userSchema, '/api/addresses/update', { isAddress: true }));
  if (removeAddressForm.length) [...removeAddressForm].map((formEl) => new FormHandler(formEl, userSchema, '/api/addresses/remove', { isAddress: true }));

  // Cart forms
  if (cartItemUpdateForm.length) [...cartItemUpdateForm].map((formEl) => new FormHandler(formEl, cartItemSchema, '/api/cart/update'));
  if (cartItemRemoveForm.length) [...cartItemRemoveForm].map((formEl) => new FormHandler(formEl, cartItemSchema, '/api/cart/remove'));

  // Misc forms
  accountResendEmailVerificationButton();
}