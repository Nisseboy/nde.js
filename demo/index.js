let scenes = {
  game: new SceneGame(), 
  mainMenu: new SceneMainMenu(),
};

function preload() {
  renderer = new RendererCanvas();

  preloadTextures();

  debug = true;

  //targetFPS = 30;

  controls = {
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
}
document.addEventListener("keydown", e => {
  if (getKeyEqual(e.key,"Debug Mode")) debug = !debug;
});

function beforeSetup() {

}
function afterSetup() {
  initEntityTypes();

  scenes.game.loadWorld();

  setScene(scenes.mainMenu);
}

function beforeUpdate() {
  renderer.set("font", "16px monospace");
  renderer.set("imageSmoothing", false);
}
function afterUpdate() {
  
}

function beforeRender() {
  
}
function afterRender() {
  
}

function beforeResize(e) {
  //return 432; //new width
  
  return w;
}
function afterResize(e) {
  
}