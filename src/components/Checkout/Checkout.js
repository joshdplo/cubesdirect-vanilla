import './Checkout.css';
import { BaseComponent } from "../componentSystem.js";

export default class Checkout extends BaseComponent {
  init() {
    this.dom = {
      // shipping address
      newAddressForm: this.element.querySelector('form#checkout-new-address'),
      newAddressFormMessages: this.element.querySelector('form#checkout-new-address .messages'),
      userAddressForm: this.element.querySelector('form#checkout-user-address'),
      userAddressFormSelect: this.element.querySelector('form#checkout-user-address select'),
      userAddressFormSubmit: this.element.querySelector('form#checkout-user-address input[type="submit"]'),
      userAddressesList: this.element.querySelector('form#checkout-user-address .checkout_user-addresses'),
      userAddressesItems: this.element.querySelectorAll('form#checkout-user-address .checkout_user-addresses [data-index]'),
      userAddressFormMessages: this.element.querySelector('form#checkout-user-address .messages'),
      newAddressWrapper: this.element.querySelector('.checkout_new-address'),
      enterNewAddressButton: this.element.querySelector('button.checkout_show-address-form'),

      // change shipping
      changeShippingAddressButton: this.element.querySelector('.checkout_change-shipping-address button'),
      changeShippingAddressMessages: this.element.querySelector('.checkout_change-shipping-address .messages'),

      // guest email
      guestEmailForm: this.element.querySelector('form#checkout-guest-email'),
      guestEmailFormMessages: this.element.querySelector('form#checkout-guest-email .messages'),

      // payment
      paymentCCForm: this.element.querySelector('form#checkout-credit-card'),
      paymentCCFormMessages: this.element.querySelector('form#checkout-credit-card .messages')
    }

    if (this.dom.userAddressForm && this.dom.newAddressWrapper && this.dom.userAddressFormMessages) {
      this.addEventListener(this.dom.enterNewAddressButton, 'click', this.onEnterNewAddressClick.bind(this));
      this.addEventListener(this.dom.userAddressForm, 'change', this.onUserAddressSelectChange.bind(this));
      this.addEventListener(this.dom.userAddressForm, 'submit', this.onUserAddressSubmit.bind(this));
    }

    if (this.dom.changeShippingAddressButton && this.dom.changeShippingAddressMessages) {
      this.addEventListener(this.dom.changeShippingAddressButton, 'click', this.onChangeShippingAddressClick.bind(this));
    }

    if (this.dom.guestEmailForm && this.dom.guestEmailFormMessages) {
      this.addEventListener(this.dom.guestEmailForm, 'submit', this.onGuestEmailSubmit.bind(this));
    }

    if (this.dom.paymentCCForm && this.dom.paymentCCFormMessages) {
      this.addEventListener(this.dom.paymentCCForm, 'submit', this.onPaymentSubmit.bind(this));
    }
  }

  toggleUserAddressVisibility(isNewAddress = true, selectedIndex = 'new') {
    const submitButton = this.dom.userAddressFormSubmit;
    this.dom.newAddressWrapper.classList[isNewAddress ? 'remove' : 'add']('hide');
    this.dom.enterNewAddressButton.classList[isNewAddress ? 'add' : 'remove']('hide');
    this.dom.userAddressesList.classList[isNewAddress ? 'add' : 'remove']('hide');
    if (submitButton) submitButton.classList[isNewAddress ? 'add' : 'remove']('hide');

    if (!isNewAddress) this.dom.userAddressesItems.forEach((el) => {
      const isSelectedAddress = el.getAttribute('data-index') === selectedIndex;
      el.classList[isSelectedAddress ? 'remove' : 'add']('hide');
    });
  }

  onEnterNewAddressClick() {
    this.dom.userAddressFormSelect.value = 'new';
    this.toggleUserAddressVisibility();
  }

  onUserAddressSelectChange(e) {
    const isNewAddress = e.target.value === 'new';
    this.toggleUserAddressVisibility(isNewAddress, e.target.value);
  }

  onUserAddressSubmit(e) {
    e.preventDefault();
    const formData = new FormData(this.dom.userAddressForm);

    // Submit user address POST
    fetch('/api/checkout/shipping', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(formData))
    }).then(res => res.json())
      .then(response => {
        if (response.error) {
          // error
          console.log('error submitting user address:', response.error);
          window._UTIL.showGlobalMessage(response.error, 'error');
        } else {
          // success
          console.log('user address submit success');
        }

        if (response.redirect) window.location.href = response.redirect;
      })
      .catch(error => {
        console.error('Error on add to cart post:', error);
      });
  }

  onChangeShippingAddressClick() {
    // Change Address POST
    fetch('/api/checkout/shipping', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ changeAddress: true })
    }).then(res => res.json())
      .then(response => {
        if (response.error) {
          // error
          console.log('error changing user address:', response.error);
          window._UTIL.showGlobalMessage(response.error, 'error');
        } else {
          // success
          console.log('change address submit success');
        }

        if (response.redirect) window.location.href = response.redirect;
      })
      .catch(error => {
        console.error('Error on change address:', error);
      });
  }

  onGuestEmailSubmit(e) {
    e.preventDefault();
  }

  onPaymentSubmit(e) {
    e.preventDefault();

    const ccFormData = Object.fromEntries(new FormData(this.dom.paymentCCForm));
    let newAddressFormData = Object.fromEntries(new FormData(this.dom.newAddressForm));
    let userAddressFormData = null;
    let guestEmailFormData = null;

    if (this.dom.userAddressForm) {
      userAddressFormData = Object.fromEntries(new FormData(this.dom.userAddressForm));
      if (userAddressFormData.addressIndex !== 'new') newAddressFormData = null;
    }

    if (this.dom.guestEmailForm) guestEmailFormData = Object.fromEntries(new FormData(this.dom.guestEmailForm));

    const submitData = JSON.stringify({
      paymentData: ccFormData,
      newAddress: newAddressFormData,
      addressIndex: userAddressFormData?.addressIndex,
      guestEmail: guestEmailFormData?.guestEmail
    });

    console.log('userAddressFormData:', userAddressFormData);
    console.log('newAddressFormData:', newAddressFormData);
    console.log('ccFormData:', ccFormData);
    console.log('guestEmail:', guestEmailFormData);

    // Submit payment + billing address POST
    fetch('/api/checkout/payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: submitData
    }).then(res => res.json())
      .then(response => {
        if (response.error) {
          if (response.newBillingAddressErrors) {
            // error with new billing address
            this.dom.newAddressFormMessages.innerHTML = Object.values(response.newBillingAddressErrors)
              .map((err) => `<p>${err}</p>`)
              .join('');
          } else if (response.guestEmailErrors) {
            console.log(response.guestEmailErrors);
            this.dom.guestEmailFormMessages.innerHTML = Object.values(response.guestEmailErrors)
              .map((err) => `<p>${err}</p>`)
              .join('');
          } else if (response.ccErrors) {
            // error with credit card info
            this.dom.paymentCCFormMessages.innerText = 'Ensure all payment credit card fields are filled in. This is just a mock credit card, so the values can be anything.';
          } else {
            // error
            console.log('error submitting user address:', response.error);
            window._UTIL.showGlobalMessage(response.error, 'error');
          }
        } else {
          // success
          console.log('user address submit success');
          console.log(response);
        }

        if (response.redirect) window.location.href = response.redirect;
      })
      .catch(error => {
        console.error('Error on add to cart post:', error);
      });
  }
}