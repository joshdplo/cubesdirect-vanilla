import FormHandler from './FormHandler.js';
import { userSchema } from '../../../validation/userSchema.js';
import { accountResendEmailVerificationButton } from '../account/accountForms.js';

/**
 * Export forms
 */
export default function forms() {
  const registerForm = document.querySelector('form#register');
  const loginForm = document.querySelector('form#login');
  const changePasswordForm = document.querySelector('form#change-password');
  const resetPasswordRequestForm = document.querySelector('form#reset-password-request');
  const resetPasswordForm = document.querySelector('form#reset-password');

  if (registerForm) new FormHandler(registerForm, userSchema, '/api/auth/register');
  if (loginForm) new FormHandler(loginForm, userSchema, '/api/auth/login');
  if (changePasswordForm) new FormHandler(changePasswordForm, userSchema, '/api/auth/change-password');
  if (resetPasswordRequestForm) new FormHandler(resetPasswordRequestForm, userSchema, '/api/auth/reset-password-request');
  if (resetPasswordForm) new FormHandler(resetPasswordForm, userSchema, '/api/auth/reset-password', { useGetParamOnPost: true });

  accountResendEmailVerificationButton();
}