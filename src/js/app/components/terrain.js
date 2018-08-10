import * as THREE from 'three';

import Config from '../../data/config';

// Class that creates and updates the Terrain
export default class Terrain {
  constructor(scene) {
    this.scene = scene;
    this.width =  Config.terrain.deep;
    this.deep = Config.terrain.deep;

    this.generate();
  }
  generate() {
    // Remove Terrain Mesh from Scene if exist
    if(this.mesh){
      this.scene.remove(this.mesh);
    }

    // Generate Random Map Terrain Geometry
    this.data = this.generateHeight(this.width, this.deep);

    this.geometry = new THREE.PlaneBufferGeometry(15000, 15000, this.width - 1, this.deep - 1);
    this.geometry.rotateX( - Math.PI / 2 );
    this.vertices = this.geometry.attributes.position.array;
    for ( let i = 0, j = 0, l = this.vertices.length; i < l; i ++, j += 3 ) {
      this.vertices[ j + 1 ] = this.data[ i ] * 10;
    }
    // Generate Texture
    this.texture = new THREE.CanvasTexture( this.generateTexture( this.data, this.width, this.deep ));
    this.texture.wrapS = THREE.ClampToEdgeWrapping;
    this.texture.wrapT = THREE.ClampToEdgeWrapping;
    this.material = new THREE.MeshBasicMaterial( { map: this.texture } );
    this.material.color = new THREE.Color( Config.terrain.color);
    this.mesh = new THREE.Mesh( this.geometry, this.material);

    // Add Object3D to Scene
    this.scene.add( this.mesh );
  }

  improvedNoise () {
    // Generate Noise Function
    const p = [ 151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,
      23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,
      174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,
      133,230,220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,
      89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,
      202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,
      248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,
      178,185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,
      14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,
      93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180 ];
    for (let i = 0; i < 256 ; i ++) {
      p[256 + i] = p[i];
    }
    function fade(t) {
      return t * t * t * (t * (t * 6 - 15) + 10);
    }
    function lerp(t, a, b) {
      return a + t * (b - a);
    }
    function grad(hash, x, y, z) {
      const h = hash & 15;
      const u = h < 8 ? x : y, v = h < 4 ? y : h == 12 || h == 14 ? x : z;
      return ((h&1) == 0 ? u : -u) + ((h&2) == 0 ? v : -v);
    }
    return {
      noise: function (x, y, z) {
        const floorX = Math.floor(x), floorY = Math.floor(y), floorZ = Math.floor(z);
        const X = floorX & 255, Y = floorY & 255, Z = floorZ & 255;
        x -= floorX;
        y -= floorY;
        z -= floorZ;
        const xMinus1 = x - 1, yMinus1 = y - 1, zMinus1 = z - 1;
        const u = fade(x), v = fade(y), w = fade(z);
        const A = p[X] + Y, AA = p[A] + Z, AB = p[A + 1] + Z, B = p[X + 1] + Y, BA = p[B] + Z, BB = p[B + 1] + Z;
        return lerp(w, lerp(v, lerp(u, grad(p[AA], x, y, z),
          grad(p[BA], xMinus1, y, z)), lerp(u, grad(p[AB], x, yMinus1, z),
          grad(p[BB], xMinus1, yMinus1, z))), lerp(v, lerp(u, grad(p[AA + 1], x, y, zMinus1),
          grad(p[BA + 1], xMinus1, y, z - 1)), lerp(u, grad(p[AB + 1], x, yMinus1, zMinus1),
          grad(p[BB + 1], xMinus1, yMinus1, zMinus1))));
      }
    }
  }
  generateHeight(width, height) {
    // Generate Spikes
    const size = width * height;
    const data = new Uint8Array(size);
    const perlin = new this.improvedNoise();
    let quality = 1;
    const z = Math.random() * 100;
    for (let j = 0; j < 4; j++) {
      for (let i = 0; i < size; i++) {
        const x = i % width, y = ~~(i / width);
        data[i] += Math.abs(perlin.noise(x / quality, y / quality, z) * quality * 1.75);
      }
      quality *= 5;
    }
    return data;
  }
  generateTexture( data, width, height ) {
    // Generate Dynamic Texture
    let context, image, imageData, shade;
    const vector3 = new THREE.Vector3( 0, 0, 0 );
    const sun = new THREE.Vector3( 1, 1, 1 );
    sun.normalize();
    const canvas = document.createElement( 'canvas' );
    canvas.width = width;
    canvas.height = height;
    context = canvas.getContext( '2d' );
    context.fillStyle = '#000';
    context.fillRect( 0, 0, width, height );
    image = context.getImageData( 0, 0, canvas.width, canvas.height );
    imageData = image.data;
    for ( let i = 0, j = 0, l = imageData.length; i < l; i += 4, j ++ ) {
      vector3.x = data[ j - 2 ] - data[ j + 2 ];
      vector3.y = 2;
      vector3.z = data[ j - width * 2 ] - data[ j + width * 2 ];
      vector3.normalize();
      shade = vector3.dot( sun );
      imageData[ i ] = ( 96 + shade * 128 ) * ( 0.5 + data[ j ] * 0.007 );
      imageData[ i + 1 ] = ( 32 + shade * 96 ) * ( 0.5 + data[ j ] * 0.007 );
      imageData[ i + 2 ] = ( shade * 96 ) * ( 0.5 + data[ j ] * 0.007 );
    }
    context.putImageData( image, 0, 0 );
    // Scaled 4x
    const canvasScaled = document.createElement( 'canvas' );
    canvasScaled.width = width * 4;
    canvasScaled.height = height * 4;
    context = canvasScaled.getContext( '2d' );
    context.scale( 4, 4 );
    context.drawImage( canvas, 0, 0 );
    image = context.getImageData( 0, 0, canvasScaled.width, canvasScaled.height );
    imageData = image.data;
    for ( let i = 0, l = imageData.length; i < l; i += 4 ) {
      const v = ~~ ( Math.random() * 5 );
      imageData[ i ] += v;
      imageData[ i + 1 ] += v;
      imageData[ i + 2 ] += v;
    }
    context.putImageData( image, 0, 0 );
    return canvasScaled;
  }
}
