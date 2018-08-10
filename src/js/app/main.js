// Global imports -
import * as THREE from 'three';
import TWEEN from 'tween.js';

// Local imports -
// Components
import Renderer from './components/renderer';
import Camera from './components/camera';
import Terrain from './components/terrain';

// Helpers
import Stats from './helpers/stats';

// Managers
import Interaction from './managers/interaction';
import DatGUI from './managers/datGUI';

// Data
import Config from './../data/config';

// Helpers
import * as isMobile from 'ismobilejs';

// -- End of imports

// This class instantiates and ties all of the components together, starts the loading process and renders the main loop
export default class Main {
  constructor(container) {
    // Check Mobile
    if (isMobile.any) {
      Config.mobile = true;
    }
    // Set container property to container element
    this.container = container;

    // Start Three clock
    this.clock = new THREE.Clock();

    // Main scene creation
    this.scene = new THREE.Scene();

    if(Config.mobile){
      Config.fog.near = 0.00025
    }
    this.scene.fog = new THREE.FogExp2(Config.fog.color, Config.fog.near);

    // Main renderer constructor
    this.renderer = new Renderer(this.scene, container);

    // Components instantiations
    this.camera = new Camera(this.renderer.threeRenderer);


    if(Config.mobile){
      Config.terrain.deep = 256;
    }
    this.terrain = new Terrain(this.scene);

    if(!Config.mobile) {
      this.renderer.setupComposer(this.camera);
    }

    // Set up rStats if dev environment
    if(Config.isDev && Config.isShowingStats) {
      this.stats = new Stats(this.renderer);
      this.stats.setUp();
    }

    new Interaction(this.renderer.threeRenderer, this.scene, this.camera, this.container);
    // Add dat.GUI controls if dev
    if(Config.isDev && !Config.mobile) {
      new DatGUI(this);
    }
    // Everything is now fully loaded
    Config.isLoaded = true;
    this.container.querySelector('#loading').classList.remove('active');

    // Start render which does not wait for model fully loaded
    this.render();
  }

  render() {
    if(Config.interactions.render) {
      // Render rStats if Dev
      if(Config.isDev && Config.isShowingStats) {
        Stats.start();
      }

      // Call render function and pass in created scene and camera
      this.renderer.render(this.scene, this.camera.threeCamera);

      // rStats has finished determining render call now
      if(Config.isDev && Config.isShowingStats) {
        Stats.end();
      }

      // Delta time is sometimes needed for certain updates
      //const delta = this.clock.getDelta();

      // Call any vendor or module frame updates here
      TWEEN.update();
    }
    requestAnimationFrame(this.render.bind(this)); // Bind the main class instead of window object
  }


}
