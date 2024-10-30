import { BaseComponent } from "../componentSystem.js";

export default class AccountVerificationResend extends BaseComponent {
  init() {
    this.dom = {
      button: this.element.querySelector('button'),
      messageContainer: this.element.querySelector('.messages')
    }

    this.addEventListener(this.dom.button, 'click', this.click.bind(this));
  }

  updateStatus(message) {
    this.dom.messageContainer.innerText = message;
  }

  click() {
    // Resend email verification POST request
    fetch('/api/auth/send-email-verification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // body: JSON.stringify({}) // no body data to send
    }).then(res => res.json())
      .then(response => {
        let message = '';

        if (response.error) {
          // error
          console.log('error resending email verification:', response.error);
          message = response.error;
        } else {
          // success
          console.log('email verification resend success');
          message = response.message;
        }

        this.updateStatus(message);
        if (response.redirect) window.location.href = response.redirect;
      })
      .catch(error => {
        console.error('Error on email verification resend', error);
      });
  }
}