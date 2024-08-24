let tex = {};
let texturePaths = [
  "duck/1"
];

function preloadTextures() {
  for (let i = 0; i < texturePaths.length; i++) {
    tex[texturePaths[i]] = loadImg("assets/textures/" + texturePaths[i] + ".png");
    /*
    let path = texturePaths[i].split("/");
    
    let node = tex;
    while (path.length > 1) {
      let nodeName = path.shift();
      if (!node[nodeName]) node[nodeName] = {};
      node = node[nodeName];
    }
    node[path[0]] = loadImage("assets/textures/" + texturePaths[i] + ".png");
    */
  }
}