import './CubeCustomizer.css';
import { BaseComponent } from "../componentSystem.js";

export default class CubeCustomizer extends BaseComponent {
  init() {
    this.dom = {
      scene: this.element.querySelector('.scene'),
      cube: this.element.querySelector('.cube'),
      resetButton: this.element.querySelector('button.reset'),
      allFaces: this.element.querySelectorAll('.cube .face'),
      frontFace: this.element.querySelector('.cube .face.front'),
      backFace: this.element.querySelector('.cube .face.back'),
      leftFace: this.element.querySelector('.cube .face.left'),
      rightFace: this.element.querySelector('.cube .face.right'),
      topFace: this.element.querySelector('.cube .face.top'),
      bottomFace: this.element.querySelector('.cube .face.bottom'),
    };

    this.defaultTransform = 'translateZ(-100px) rotateY(30deg)';
    this.isPointerDown = false;
    this.currentX = 0;
    this.currentY = 0;
    this.lastX = 0;
    this.lastY = 0;

    this.addEventListener(this.dom.resetButton, 'click', this.onResetClick.bind(this));
    this.addEventListener(this.dom.scene, 'pointerdown', this.onPointerDown.bind(this));
    this.addEventListener(this.dom.scene, 'pointerup', this.onPointerUp.bind(this));
    this.addEventListener(this.dom.scene, 'pointermove', this.onPointerMove.bind(this));
  }

  // Selections
  onResetClick() {
    this.dom.cube.classList.add('animating');
    this.dom.cube.style.transform = this.defaultTransform;
    this.currentX = 0;
    this.currentY = 0;
    this.lastX = 0;
    this.lastY = 0;
  }

  // Pointer Logic
  onPointerDown(e) {
    this.isPointerDown = true;
    this.lastX = e.clientX;
    this.lastY = e.clientY;
  }
  onPointerUp(e) { this.isPointerDown = false; }
  onPointerMove(e) {
    if (this.isPointerDown) {
      this.dom.cube.classList.remove('animating');

      // Calculate the change in X and Y
      const deltaX = e.clientX - this.lastX;
      const deltaY = this.lastY - e.clientY;

      // Update current rotation values
      this.currentX += deltaY * 0.5; // Adjust multiplier for sensitivity
      this.currentY += deltaX * 0.5;

      this.dom.cube.style.transform = `translateZ(-100px) rotateX(${this.currentX}deg) rotateY(${this.currentY}deg)`;

      // Update last positions
      this.lastX = e.clientX;
      this.lastY = e.clientY;
    }
  }
}