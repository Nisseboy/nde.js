let nde;
let scenes;
let renderer;

let ndeSettings = JSON.parse(localStorage.getItem("ndeSettings")) || {};

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
  };

  scenes = {
    game: new SceneGame(), 
    mainMenu: new SceneMainMenu(),
    settings: new SceneSettings(),
  };

  nde.registerEvent("keydown", e => {
    if (nde.getKeyEqual(e.key,"Debug Mode")) nde.debug = !nde.debug;
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
    return nde.w * ndeSettings.renderResolution / 100;
    //return 432; //new width
  });
};