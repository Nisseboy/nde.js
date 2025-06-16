let tex = {};
let aud = {};

function preloadTextures() {
  for (let i = 0; i < texturesPaths.length; i++) {
    tex[texturesPaths[i]] = nde.loadImg("assets/textures/" + texturesPaths[i] + ".png");
  }

  for (let i = 0; i < audiosPaths.length; i++) {
    aud[audiosPaths[i]] = nde.loadAud("assets/audios/" + audiosPaths[i] + ".mp3");
  }
}