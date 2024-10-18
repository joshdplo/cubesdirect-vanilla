import FormHandler from './FormHandler.js';
import { userSchema } from '../../../validation/userSchema.js';

export default function forms() {
  const registerForm = document.querySelector('form#register');
  const loginForm = document.querySelector('form#login');
  const changePasswordForm = document.querySelector('form#change-password');

  if (registerForm) new FormHandler(registerForm, userSchema, '/api/auth/register');
  if (loginForm) console.log('on the login page, need some JS now =}');
  if (changePasswordForm) console.log('on the change password page, need some JS now =}');
}