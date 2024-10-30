import FormHandler from "../FormHandler.js";
import { userSchema } from '../../../validation/userSchema.js';

document.addEventListener('DOMContentLoaded', () => {
  const resetPasswordRequestForm = document.querySelector('form#reset-password-request');
  const resetPasswordForm = document.querySelector('form#reset-password');

  if (resetPasswordRequestForm) new FormHandler(resetPasswordRequestForm, userSchema, '/api/auth/reset-password-request');
  if (resetPasswordForm) new FormHandler(resetPasswordForm, userSchema, '/api/auth/reset-password', { useGetParamOnPost: true });

  console.log('-> change password bundle loaded');
});