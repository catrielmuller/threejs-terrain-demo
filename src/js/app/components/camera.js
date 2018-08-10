import * as THREE from 'three';
import TWEEN from 'tween.js';

import Config from '../../data/config';

// Class that creates and updates the main camera
export default class Camera {
  constructor(renderer) {
    const width = renderer.domElement.width;
    const height = renderer.domElement.height;
    this.moving = false;

    // Create and position a Perspective Camera
    if(Config.mobile){
      Config.camera.far = Config.camera.far / 1.5;
    }

    this.threeCamera = new THREE.PerspectiveCamera(Config.camera.fov, width / height, Config.camera.near, Config.camera.far);
    this.threeCamera.position.set(Config.camera.posX, Config.camera.posY, Config.camera.posZ);
    this.threeCamera.rotation.x = -90 * Math.PI / 180;
    this.threeCamera.rotation.y = 0;
    this.threeCamera.rotation.x = 0;
    this.threeCamera.updateProjectionMatrix();

    // Initial sizing
    this.updateSize(renderer);
    
    // Listeners
    window.addEventListener('resize', () => this.updateSize(renderer), false);
  }

  updateSize(renderer) {
    this.threeCamera.aspect = renderer.domElement.width / renderer.domElement.height;
    // Always call updateProjectionMatrix on camera change
    this.threeCamera.updateProjectionMatrix();
  }

  move() {
    this.moving = true;
    const move = new TWEEN.Tween(this.threeCamera.position).to(
      {
        z: this.threeCamera.position.z - 1000,
        y: this.threeCamera.position.y + 200
      }
      , Config.camera.speedMove);
    move.start().onComplete(()=>{
      this.moving = false;
    });
    const rotation = new TWEEN.Tween(this.threeCamera.rotation).to(
      {
        x: this.threeCamera.rotation.x - (5 * Math.PI / 180)
      }
      , Config.camera.speedMove);
    rotation.start()
  }
}
