import { showMessage } from "../globalMessages.js";

/**
 * Add to Cart Buttons Mock
 */
export default function addToCartButtons() {
  const cartButtons = document.querySelectorAll('button.add-to-cart');

  const onAddToCartClick = (e) => {
    const productId = parseInt(e.target.getAttribute('data-productId'), 10);
    const productQuantity = 1;

    // Add to cart POST request
    fetch('/api/cart/add', {
      method: 'POST',
      body: JSON.stringify({ productId, productQuantity }),
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

  cartButtons.forEach((el) => el.addEventListener('click', onAddToCartClick));
}