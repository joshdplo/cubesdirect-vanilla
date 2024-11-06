import './CubeCustomizer.css';
import { BaseComponent } from "../componentSystem.js";

export default class CubeCustomizer extends BaseComponent {
  init() {
    this.dom = {
      scene: this.element.querySelector('.scene'),
      cube: this.element.querySelector('.cube'),
      allFaces: this.element.querySelectorAll('.cube .face'),
      frontFace: this.element.querySelector('.cube .face.front'),
      backFace: this.element.querySelector('.cube .face.back'),
      leftFace: this.element.querySelector('.cube .face.left'),
      rightFace: this.element.querySelector('.cube .face.right'),
      topFace: this.element.querySelector('.cube .face.top'),
      bottomFace: this.element.querySelector('.cube .face.bottom'),
    };

    this.isPointerDown = false;

    this.addEventListener(this.dom.scene, 'pointerdown', this.onPointerDown.bind(this));
    this.addEventListener(this.dom.scene, 'pointerup', this.onPointerUp.bind(this));
    this.addEventListener(this.dom.scene, 'pointermove', this.onPointerMove.bind(this));
  }

  onPointerDown(e) { this.isPointerDown = true; }
  onPointerUp(e) { this.isPointerDown = false; }

  onPointerMove(e) {
    if (this.isPointerDown) {
      const rect = this.dom.scene.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      this.dom.cube.style.transform = `translateZ(-100px) rotateX(${deltaY}deg) rotateY(${deltaX}deg)`;
    }
  }
}