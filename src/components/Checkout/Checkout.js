import './Checkout.css';
import { BaseComponent } from "../componentSystem.js";

export default class Checkout extends BaseComponent {
  init() {
    this.dom = {
      userAddressForm: this.element.querySelector('form#checkout-user-address'),
      userAddressFormSelect: this.element.querySelector('form#checkout-user-address select'),
      userAddressFormSubmit: this.element.querySelector('form#checkout-user-address input[type="submit"]'),
      userAddressesList: this.element.querySelector('form#checkout-user-address .checkout_user-addresses'),
      userAddressesItems: this.element.querySelectorAll('form#checkout-user-address .checkout_user-addresses [data-index]'),
      userAddressFormMessages: this.element.querySelector('form#checkout-user-address .messages'),
      newAddressWrapper: this.element.querySelector('.checkout_new-address'),
      enterNewAddressButton: this.element.querySelector('button.checkout_show-address-form')
    }

    if (this.dom.userAddressForm && this.dom.newAddressWrapper && this.dom.userAddressFormMessages) {
      this.addEventListener(this.dom.enterNewAddressButton, 'click', this.onEnterNewAddressClick.bind(this));
      this.addEventListener(this.dom.userAddressForm, 'change', this.onUserAddressChange.bind(this));
      this.addEventListener(this.dom.userAddressForm, 'submit', this.onUserAddressSubmit.bind(this));
    }
  }

  toggleUserAddressVisibility(isNewAddress = true, selectedIndex = 'new') {
    this.dom.newAddressWrapper.classList[isNewAddress ? 'remove' : 'add']('hide');
    this.dom.enterNewAddressButton.classList[isNewAddress ? 'add' : 'remove']('hide');
    this.dom.userAddressFormSubmit.classList[isNewAddress ? 'add' : 'remove']('hide');
    this.dom.userAddressesList.classList[isNewAddress ? 'add' : 'remove']('hide');

    if (!isNewAddress) this.dom.userAddressesItems.forEach((el) => {
      const isSelectedAddress = el.getAttribute('data-index') === selectedIndex;
      el.classList[isSelectedAddress ? 'remove' : 'add']('hide');
    });
  }

  onEnterNewAddressClick() {
    this.dom.userAddressFormSelect.value = 'new';
    this.toggleUserAddressVisibility();
  }

  onUserAddressChange(e) {
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
          if (response.redirect) window.location.href = response.redirect;
        }
      })
      .catch(error => {
        console.error('Error on add to cart post:', error);
      });
  }
}