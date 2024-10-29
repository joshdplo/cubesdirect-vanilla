import { registerComponent, initComponents } from "../componentSystem";
import Header from "../Header/Header";

export default function globalBundle() {
  registerComponent('header', Header);

  initComponents();
  console.log('-> global bundle loaded');
}