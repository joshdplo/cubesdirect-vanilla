/**
 * Change Password Form Mock
 */
export default function changePasswordForm() {
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