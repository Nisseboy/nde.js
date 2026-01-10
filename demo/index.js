let nde = new NDE(document.getElementsByTagName("main")[0]); //nde needs to be defined globally and be the single instance of NDE
nde.debug = true;
nde.uiDebug = false;
//nde.targetFPS = 60;

let renderer = nde.renderer;
for (let asset of assetPaths) {
  nde.loadAsset(asset);
}

let settingsName = "ndeSettings";
let settings = JSON.parse(localStorage.getItem(settingsName)) || {};

let scenes = {};
nde.controls = {
  "Move Up": "w",
  "Move Down": "s",
  "Move Left": "a",
  "Move Right": "d",

  "Move Camera Up": "ArrowUp",
  "Move Camera Down": "ArrowDown",
  "Move Camera Left": "ArrowLeft",
  "Move Camera Right": "ArrowRight",
  
  "Run": "Shift",
  "Interact": "f",
  "Pause": "Escape",
  "Debug Mode": "l",
  "UI Debug Mode": "k",
};


nde.on("keydown", e => {
  if (nde.getKeyEqual(e.key,"Debug Mode")) nde.debug = !nde.debug;
  if (nde.getKeyEqual(e.key,"UI Debug Mode")) nde.uiDebug = !nde.uiDebug;
});

nde.on("afterSetup", () => {
  initStyles();
  
  for (let path of scenePaths) {
    let name = path.split("Scene")[1];
    name = name[0].toLowerCase() + name.slice(1);
    scenes[name] = new (eval(path))();
  }


  scenes.game.loadWorld(nde.assets.world);
  nde.setScene(scenes.mainMenu);
});

nde.on("update", dt => {
  renderer.set("font", "16px monospace");
  renderer.set("imageSmoothing", false);
});

nde.on("resize", e => {  
  return nde.w * settings.renderResolution / 100;
  //return 432; //new width
});




//For nde-Editor
function getContext() {
  return {
    nde,
    scenes,
  }
}