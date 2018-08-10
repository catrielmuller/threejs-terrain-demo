// This object contains the state of the app
export default {
  isDev: true,
  mobile: false,
  isShowingStats: true,
  isLoaded: false,
  maxAnisotropy: 1,
  dpr: 1,
  interactions: {
    limitTaps: 5,
    render: true
  },
  fog: {
    color: 0xeeeeee,
    near: 0.0002
  },
  terrain: {
    deep: 512,
    color: 0x1f8824,
  },
  camera: {
    fov: 60,
    near: 1,
    far: 10000,
    aspect: 1,
    posX: 0,
    posY: 1500,
    posZ: 3000,
    speedMove: 1000
  }
};
