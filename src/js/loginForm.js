/**
 * Login Form Mock
 */
export default function loginForm() {
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