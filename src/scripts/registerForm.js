/**
 * Register Form Mock
 */
export default function registerForm() {
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