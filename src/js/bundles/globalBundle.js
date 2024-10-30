import { registerComponent, initComponents } from "../../components/componentSystem.js";
import Header from "../../components/Header/Header.js";

import FormHandler from "../FormHandler.js";
import { userSchema } from '../../../validation/userSchema.js';

export default function globalBundle() {
  // Global Components
  registerComponent('header', Header);

  // Global Forms
  const registerForm = document.querySelector('form#register');
  const loginForm = document.querySelector('form#login');

  if (registerForm) new FormHandler(registerForm, userSchema, '/api/auth/register');
  if (loginForm) new FormHandler(loginForm, userSchema, '/api/auth/login');

  initComponents();
  console.log('-> global bundle loaded');
}