let nde;
let scenes;
let renderer;

let settingsName = "ndeSettings";
let settings = JSON.parse(localStorage.getItem(settingsName)) || {};

document.body.onload = e => {
  nde = new NDE(document.getElementsByTagName("main")[0]);
  renderer = nde.renderer;
  preloadTextures();

  nde.debug = true;

  //nde.targetFPS = 60;

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

  scenes = {
    game: new SceneGame(), 
    mainMenu: new SceneMainMenu(),
    settings: new SceneSettings(),
  };

  nde.registerEvent("keydown", e => {
    if (nde.getKeyEqual(e.key,"Debug Mode")) nde.debug = !nde.debug;
    if (nde.getKeyEqual(e.key,"UI Debug Mode")) nde.uiDebug = !nde.uiDebug;
  });

  nde.registerEvent("afterSetup", () => {
    scenes.game.loadWorld();
    nde.setScene(scenes.mainMenu);
  });

  nde.registerEvent("update", dt => {
    renderer.set("font", "16px monospace");
    renderer.set("imageSmoothing", false);
  });

  nde.registerEvent("resize", e => {
    return nde.w * settings.renderResolution / 100;
    //return 432; //new width
  });
};


//https://gist.github.com/yomotsu/165ba9ee0dc991cb6db5
var getDeltaAngle = function () {
  var TAU = 2 * Math.PI;
  var mod = function (a, n) { return ( a % n + n ) % n; } // modulo
  var equivalent = function (a) { return mod(a + Math.PI, TAU) - Math.PI } // [-π, +π]
  return function (current, target) {
    return equivalent(target - current);
  }
}();