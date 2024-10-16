/**
 * Add to Cart Buttons Mock
 */
export default function addToCartButtons() {
  const cartButtons = document.querySelectorAll('button.add-to-cart');
  const onAddToCartClick = (e) => {
    const productId = parseInt(e.target.getAttribute('data-productId'), 10);
    const productQuantity = 1;

    // Add to cart POST request
    fetch('/api/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, productQuantity }),
      headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json())
      .then(response => {
        console.log(response);
        if (response.error) {
          globalMessage(response.error, 'red');
        } else {
          globalMessage(response.message, 'green');
          if (response.redirect) window.location.href = response.redirect;
        }
      })
      .catch(error => {
        console.error('Error:', error);
        globalMessage('ERROR ADDING TO CART!', 'red');
      });
  }

  cartButtons.forEach((el) => el.addEventListener('click', onAddToCartClick));
}