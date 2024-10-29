import { registerComponent, initComponents } from "../componentSystem";
import AddToCartButton from "../AddToCartButton/AddToCartButton";

document.addEventListener('DOMContentLoaded', () => {
  registerComponent('addToCartButton', AddToCartButton);

  initComponents();
  console.log('-> product bundle loaded');
});