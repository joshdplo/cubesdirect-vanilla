import './AddToCartButton.css';
import { BaseComponent } from "../componentSystem.js";

export default class AddToCartButton extends BaseComponent {
  init() {
    this.productId = this.element.getAttribute('data-productId');
    this.quantity = 1;

    this.addEventListener(this.element, 'click', this.click.bind(this));
  }

  click() {
    // Add to cart POST request
    fetch('/api/cart/add', {
      method: 'POST',
      body: JSON.stringify({ productId: this.productId, productQuantity: this.quantity }),
      headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json())
      .then(response => {
        if (response.error) {
          // error on add to cart
          console.log('error adding item to cart:', response.error);
          showMessage(response.error, 'error');
        } else {
          // success on add to cart
          console.log('add to cart success');
          if (response.redirect) window.location.href = response.redirect;
        }
      })
      .catch(error => {
        console.error('Error on add to cart post:', error);
      });
  }
}