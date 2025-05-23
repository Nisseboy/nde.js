let tex = {};
let texturePaths = [
  "duck/1"
];

/*
let aud = {};
let audioPaths = [
  "duck/step/1",
  "duck/step/2",
  "duck/step/3",
  "duck/step/4",
];*/

function preloadTextures() {
  for (let i = 0; i < texturePaths.length; i++) {
    tex[texturePaths[i]] = nde.loadImg("assets/textures/" + texturePaths[i] + ".png");
  }
  /*
  for (let i = 0; i < audioPaths.length; i++) {
    aud[audioPaths[i]] = nde.loadAud("assets/audio/" + audioPaths[i] + ".mp3");
  }*/
}