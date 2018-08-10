import Config from '../../data/config';

// Manages all input interactions
export default class Interaction {
  constructor(renderer, scene, camera, container) {
    // Properties
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    this.container = container;
    this.countTaps = 0;
    this.limitTaps = Config.interactions.limitTaps;
    this.endgame = false;

    // Mouse events
    this.renderer.domElement.addEventListener('click', (event) => this.onMouseTap(event), false);
  }

  onMouseTap(event) {
    event.preventDefault();
    if(!this.camera.moving && !this.endgame){
      this.camera.move();
      this.countTaps++;
      if(this.countTaps >= Config.interactions.limitTaps) {
        setTimeout(()=>{
          this.container.querySelector('#end').classList.add('active');
          Config.interactions.render = false;
        },1000);
        this.endgame = true;
      }
    }
  }
}
