import { validateForm } from './utils';
import userSchema from '../../validation/userSchema';

export default function registerForm() {
  // Form elements
  const registrationForm = document.querySelector('form#register');
  const emailInput = registrationForm.querySelector('input#email-register');
  const passwordInput = registrationForm.querySelector('input#password-register');
  const passwordConfirmInput = registrationForm.querySelector('input#password-register-confirm');
  const errorContainer = registrationForm.querySelector('.error-text');

  // Handle form submission
  registrationForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Collect form data
    const formData = {
      email: emailInput.ariaValueMax,
      password: passwordInput.value
    };

    // Validate form data with Joi schema
    const { value, errors } = await validateForm(userSchema, formData);

    if (errors) {
      errorContainer.innerHTML = Object.values(errors)
        .map((err) => `<p>${err}</p>`)
        .join('');
    } else {
      errorContainer.innerHTML = 'FORM IS VALID!!';

      // Register POST request
      // fetch('/api/auth/register', {
      //   method: 'POST',
      //   body: JSON.stringify(formData),
      //   headers: { 'Content-Type': 'application/json' }
      // }).then(res => res.json())
      //   .then(response => {
      //     console.log(response);
      //     if (response.error) {
      //       errorContainer.innerHTML = response.error;
      //     } else {
      //       errorContainer.innerHTML = response.message;
      //       if (response.redirect) window.location.href = response.redirect;
      //     }
      //   })
      //   .catch(error => {
      //     console.error('Error:', error);
      //     errorContainer.innerHTML = 'ERROR SUBMITTING REGISTRATION!';
      //   });
    }
  });
}