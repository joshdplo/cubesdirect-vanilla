import { getOrCreateCartToken } from "./cartUtils.js";

/**
 * Add to Cart Buttons Mock
 */
export default function addToCartButtons() {
  const cartButtons = document.querySelectorAll('button.add-to-cart');
  const cartToken = getOrCreateCartToken();

  const onAddToCartClick = (e) => {
    const productId = parseInt(e.target.getAttribute('data-productId'), 10);
    const productQuantity = 1;

    // Add to cart POST request
    fetch('/api/cart/add', {
      method: 'POST',
      body: JSON.stringify({ productId, productQuantity, cartToken }),
      headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json())
      .then(response => {
        console.log(response);
        if (response.error) {
          // error on add to cart

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