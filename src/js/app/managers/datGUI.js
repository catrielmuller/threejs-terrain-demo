import Config from '../../data/config';

// Manages all dat.GUI interactions
export default class DatGUI {
  constructor(main) {
    const gui = new dat.GUI();

    this.camera = main.camera.threeCamera;
    this.stats = main.stats;
    this.terrain = main.terrain;

    this.events = {
      generate: () => {
        this.terrain.generate();
      },
      restart: () => {
        window.location.reload();
      }
    };

    /* Global */
    //gui.close();

    /* Debug */
    const debugFolder = gui.addFolder('Debug');
    debugFolder.add(this.events, 'restart').name('<b>Restart</b>');

    debugFolder.open();

    /* Terrain */
    const terrainFolder = gui.addFolder('Terrain');
    const terrainDeepGui = terrainFolder.add(Config.terrain, 'deep', 32, 1024).name('Deep');
    terrainDeepGui.onChange((value) => {
      this.terrain.width = parseInt(value);
      this.terrain.deep = parseInt(value);
    });
    const terrainColorGui = terrainFolder.addColor(Config.terrain, 'color').name('Color');
    terrainColorGui.onChange((value) => {
      Config.terrain.color = value;
    });
    terrainFolder.add(this.events, 'generate').name('<b>Generate</b>');

    /* Camera */
    const cameraFolder = gui.addFolder('Camera');
    const cameraFOVGui = cameraFolder.add(Config.camera, 'fov', 0, 180).name('Camera FOV');
    cameraFOVGui.onChange((value) => {
      this.camera.fov = value;
    });
    cameraFOVGui.onFinishChange(() => {
      this.camera.updateProjectionMatrix();
    });

    const cameraAspectGui = cameraFolder.add(Config.camera, 'aspect', 0, 4).name('Camera Aspect');
    cameraAspectGui.onChange((value) => {
      this.camera.aspect = value;
    });
    cameraAspectGui.onFinishChange(() => {
      this.camera.updateProjectionMatrix();
    });

    const cameraFogColorGui = cameraFolder.addColor(Config.fog, 'color').name('Fog Color');
    cameraFogColorGui.onChange((value) => {
      main.scene.fog.color.setHex(value);
    });
    const cameraFogNearGui = cameraFolder.add(Config.fog, 'near', 0.0000, 0.0006).name('Fog Near');
    cameraFogNearGui.onChange((value) => {
      main.scene.fog.density = value;
    });
  }
}
