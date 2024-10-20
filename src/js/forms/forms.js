import FormHandler from './FormHandler.js';
import { userSchema } from '../../../validation/userSchema.js';

export default function forms() {
  const registerForm = document.querySelector('form#register');
  const loginForm = document.querySelector('form#login');
  const changePasswordForm = document.querySelector('form#change-password');

  if (registerForm) new FormHandler(registerForm, userSchema, '/api/auth/register');
  if (loginForm) new FormHandler(loginForm, userSchema, '/api/auth/login');
  if (changePasswordForm) new FormHandler(changePasswordForm, userSchema, '/api/auth/change-password');
}