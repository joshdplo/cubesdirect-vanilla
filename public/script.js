/**
 * Header Mock
 */
function header() {
  const hamburger = document.querySelector('#hamburger');
  const menu = document.querySelector('header nav');

  hamburger.addEventListener('click', () => {
    const isHidden = menu.getAttribute('aria-hidden') === 'true';
    hamburger.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
    menu.setAttribute('aria-hidden', isHidden ? 'false' : 'true');
  });
}

/**
 * Register Form Mock
 */
function registerForm() {
  const form = document.querySelector('form#register');
  if (!form) return;
  const email = form.querySelector('input#email-register');
  const password1 = form.querySelector('input#password-register');
  const password2 = form.querySelector('input#password-register-confirm');
  const submitButton = form.querySelector('input#submit-register');
  const errorText = form.querySelector('.error-text');

  form.addEventListener('submit', function onFormSubmit(e) {
    e.preventDefault();
    let error = false;
    const pass1Value = password1.value.trim();
    const pass2Value = password2.value.trim();
    const emailValue = email.value.trim();

    const validatedPasswords = stringUtils.validatePasswords(pass1Value, pass2Value);
    const validatedEmail = stringUtils.validateEmail(emailValue);

    if (!validatedPasswords.valid) error = validatedPasswords.message;
    if (!validatedEmail.valid) error = validatedEmail.message;

    if (error) {
      errorText.innerText = error;
      return false;
    } else {
      console.log('submit!');
      console.log(emailValue, pass1Value);

      // Register POST request
      fetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email: emailValue, password: pass1Value }),
        headers: { 'Content-Type': 'application/json' }
      }).then(res => res.json())
        .then(response => {
          console.log(response);
          if (response.error) {
            errorText.innerText = response.error;
          } else {
            errorText.innerText = response.message;
            if (response.redirect) window.location.href = response.redirect;
          }
        })
        .catch(error => {
          console.error('Error:', error);
          errorText.innerText = 'ERROR SUBMITTING REGISTRATION!';
        });
    }
  });
}

/**
 * Login Form Mock
 */
function loginForm() {
  const form = document.querySelector('form#login');
  if (!form) return;
  const email = form.querySelector('input#email-login');
  const password = form.querySelector('input#password-login');
  const submitButton = form.querySelector('input#submit-login');
  const errorText = form.querySelector('.error-text');

  form.addEventListener('submit', function onFormSubmit(e) {
    e.preventDefault();
    let error = false;
    const passValue = password.value.trim();
    const emailValue = email.value.trim();

    const validatedPasswords = stringUtils.validatePasswords(passValue, passValue);
    const validatedEmail = stringUtils.validateEmail(emailValue);

    if (!validatedPasswords.valid) error = validatedPasswords.message;
    if (!validatedEmail.valid) error = validatedEmail.message;

    if (error) {
      errorText.innerText = error;
      return false;
    } else {
      console.log('submit!');
      console.log(emailValue, passValue);

      // Login POST request
      fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: emailValue, password: passValue }),
        headers: { 'Content-Type': 'application/json;charset=utf-8' }
      }).then(res => res.json())
        .then(response => {
          console.log(response);
          if (response.error) {
            errorText.innerText = response.error;
          } else {
            errorText.innerText = response.message;
            if (response.redirect) window.location.href = response.redirect;
          }
        })
        .catch(error => {
          console.error('Error:', error);
          errorText.innerText = 'ERROR LOGGING IN!';
        });
    }
  });
}

/**
 * Change Password Form Mock
 */
function changePasswordForm() {
  const form = document.querySelector('form#change-password');
  if (!form) return;
  const currentPassword = form.querySelector('input#password-current-password');
  const newPassword = form.querySelector('input#password-new-password');
  const newPasswordConfirm = form.querySelector('input#password-new-password-confirm');
  const submitButton = form.querySelector('input#submit-change-password');
  const errorText = form.querySelector('.error-text');

  form.addEventListener('submit', function onFormSubmit(e) {
    e.preventDefault();
    let error = false;
    const currentPassValue = currentPassword.value.trim();
    const newPassValue = newPassword.value.trim();
    const newPassConfirmValue = newPasswordConfirm.value.trim();

    const validatedCurrentPassword = stringUtils.validatePasswords(currentPassValue, currentPassValue);
    const validatedNewPassword = stringUtils.validatePasswords(newPassValue, newPassConfirmValue);

    if (currentPassValue === newPassValue) error = 'New password can\'t be the same as current password';
    if (!validatedNewPassword.valid) error = 'New ' + validatedNewPassword.message;
    if (!validatedCurrentPassword.valid) error = validatedCurrentPassword.message;

    if (error) {
      errorText.innerText = error;
      return false;
    } else {
      console.log('submit!');
      console.log(currentPassValue, newPassValue);

      // Change Password POST request
      fetch('/api/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({
          currentPassword: currentPassValue,
          newPassword: newPassValue,
          newPasswordConfirm: newPassConfirmValue
        }),
        headers: { 'Content-Type': 'application/json' }
      }).then(res => res.json())
        .then(response => {
          console.log(response);
          if (response.error) {
            errorText.innerText = response.error;
          } else {
            errorText.innerText = response.message;
            if (response.redirect) window.location.href = response.redirect;
          }
        })
        .catch(error => {
          console.error('Error:', error);
          errorText.innerText = 'ERROR SUBMITTING REGISTRATION!';
        });
    }
  });
}

/**
 * DOM Load
 */
document.addEventListener('DOMContentLoaded', function onDOMLoad() {
  console.log(`-> script.js`);

  header();
  registerForm();
  loginForm();
  changePasswordForm();
});