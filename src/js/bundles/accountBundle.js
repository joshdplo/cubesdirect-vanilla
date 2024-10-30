import FormHandler from '../FormHandler.js';
import { userSchema } from '../../../validation/userSchema.js';

document.addEventListener('DOMContentLoaded', () => {
  // Account Forms
  const changePasswordForm = document.querySelector('form#change-password');
  const newAddressForm = document.querySelector('form#new-address');
  const updateAddressForm = document.querySelectorAll('form.update-address');
  const removeAddressForm = document.querySelectorAll('form.remove-address');

  if (changePasswordForm) new FormHandler(changePasswordForm, userSchema, '/api/auth/change-password');
  if (newAddressForm) new FormHandler(newAddressForm, userSchema, '/api/addresses/add', { isAddress: true });
  if (updateAddressForm.length) [...updateAddressForm].map((formEl) => new FormHandler(formEl, userSchema, '/api/addresses/update', { isAddress: true }));
  if (removeAddressForm.length) [...removeAddressForm].map((formEl) => new FormHandler(formEl, userSchema, '/api/addresses/remove', { isAddress: true }));

  console.log('-> account bundle loaded');
});