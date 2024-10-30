import { registerComponent, initComponents } from "../../components/componentSystem";
import AddToCartButton from "../../components/AddToCartButton/AddToCartButton";

document.addEventListener('DOMContentLoaded', () => {
  // Cart Components
  registerComponent('addToCartButton', AddToCartButton);

  initComponents();
  console.log('-> product bundle loaded');
});