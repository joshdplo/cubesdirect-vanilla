import './Checkout.css';
import { BaseComponent } from "../componentSystem.js";

export default class Checkout extends BaseComponent {
  init() {
    this.dom = {
      // shipping address UI
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

      // change shipping address UI
      changeShippingAddressButton: this.element.querySelector('.checkout_change-shipping-address button'),
      changeShippingAddressMessages: this.element.querySelector('.checkout_change-shipping-address .messages'),

      // billing address UI

      // payment UI
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

  onPaymentSubmit(e) {
    e.preventDefault();

    const userAddressFormData = Object.fromEntries(new FormData(this.dom.userAddressForm));
    let newAddressFormData = Object.fromEntries(new FormData(this.dom.newAddressForm));
    const ccFormData = Object.fromEntries(new FormData(this.dom.paymentCCForm));

    const isNewAddress = userAddressFormData.addressIndex === 'new';
    if (!isNewAddress) newAddressFormData = null;

    const submitData = JSON.stringify({
      addressIndex: userAddressFormData.addressIndex,
      paymentData: ccFormData,
      newAddress: newAddressFormData
    });

    console.log('userAddressFormData:', userAddressFormData);
    console.log('newAddressFormData:', newAddressFormData);
    console.log('ccFormData:', ccFormData);
    console.log(`new address? ${isNewAddress}`)

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