// Account: Resend Email Verification
export function accountResendEmailVerificationButton() {
  const buttonEl = document.querySelector('.page-account button#send-email-verification');
  const infoEl = document.querySelector('.page-account .send-email-verification-info');

  if (!buttonEl || !infoEl) return;

  buttonEl.addEventListener('click', async () => {
    try {
      const response = await fetch('/api/auth/send-email-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // body: JSON.stringify({ some: data }) // don't need to send anything
      });

      if (!response.ok) {
        let errorMessage = 'Error with form response';
        if (response.status === 429) {
          const result = await response.json();
          errorMessage = result.error ? result.error : 'Error re-sending email verification';
        };
        throw new Error(errorMessage);
      }

      const result = await response.json();
      infoEl.innerText = result.message;
    } catch (error) {
      console.error('Error re-sending verification email', error);
      infoEl.innerText = error.message;
    }
  });
}