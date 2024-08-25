/*
This engine uses NDV (Nils Delicious Vectors), see engine/ndv.js


scene: the current active scene, is set by setScene, see engine/scenes/scene.js for base class

w: how many pixels are across the screen, is updated automatically on resize

targetFPS: if this is not undefined, the game will try to run at that fps and the deltaTime will be fixed so it will be deterministic

controls: map of control names along with key codes, set by you and used in getKeyPressed
pressed: array of all the currently pressed key codes, accessed with getKeyPressed

mouse: a vector of the mouse position
hoveredButton: the currently hovered button, but you can't see which one it is sucker

timers: array of all currently active timers, to add a timer call new TimerWhatever, see engine/timers/timerWhatever.js for details

transition: the currently active transition, set this to a new TransitionWhatever which usually takes (newScene, timerWhatever) and it will transition, see engine/transitions/transitionBase.js for base class

debug: if debugStats are shown
debugStats: map thats cleared each frame where you can put debug info

renderer: which renderer to use, pass all drawing code into this pls, see engine/renderers/rendererBase.js for base class

preload: called before anything else to load assets

beforeSetup: called before canvas has been initialized and framerate set
afterSetup: after
beforeUpdate: called before the scene gets updated every frame
afterUpdate: after
beforeRender: called before the scene gets rendered every frame
afterRender: after
beforeResize: called before screen gets resized, you can return a value for the width here to render at a lower resolution
afterResize: after


use these to handle key input:
getKeyCode: Get keycode from control name
getKeyPressed: Get if key corresponding to control name is pressed
getKeyEqual: Get if keycode is same as controlName



important classes:
SceneBase: base class of all scenes, new SceneGame()
RendererBase: base class of all renderers, new RendererCanvas()
TimerBase: base class of all timers, new TimerTime(seconds, callback)
TransitionBase: base class of all transitions, new TransitionSlide(newScene, timer)

Vec: vector, see ndv.js

Img: image, see img.js

Camera: an object that can transform points and apply transformations to renderer, new Camera(pos), see camera.js



Recommended project structure:

Project:
  engine:
    ...
  game:
    scenes:
      sceneGame.js
      sceneMainMenu.js
      ...
    buttons:
      buttomCustom.js
      ...
    timers:
      timerCustom.js
      ...
    transitions:
      transitionCustom.js
      ...
    renderers:
      rendererCustom.js
      ...
    index.js
    ...
  index.html
  style.css
  ...

*/  



let scene;

let w;

let targetFPS;

let controls = {};
let pressed = {};

let mouse;
let hoveredButton;

let timers = [];

let transition;

let debug = true;
let debugStats = {};

let renderer;



let mainElem = document.getElementsByTagName("main")[0];
let mainImg = new Img(new Vec(1, 1));
let unloadedAssets = [];

let lastFrameTime = 0;

document.body.onload = e => {
  setScene(new Scene());
  mouse = new Vec(0, 0);

  preload();

  let i = 0;
  let interval = setInterval(e => {
    if (unloadedAssets.length == 0) {clearInterval(interval); setup();}
    if (i >= 200) {clearInterval(interval); console.error("assets could not be loaded: " + unloadedAssets.map(e => e.path))}
    
    i++;
  }, 16);
};

function setup() {
  beforeSetup();

  renderer = new RendererCanvas();
  mainElem.appendChild(mainImg.canvas);
  windowResized();

  renderer.set("renderer.", "16px monospace");
  renderer.set("textAlign", ["left", "top"]);
  renderer.set("imageSmoothing", false);
  
  afterSetup();

  requestAnimationFrame(draw);
}

function setScene(newScene) {
  if (scene) scene.stop();
  scene = newScene;
  scene.start();
  scene.hasStarted = true;
}

function windowResized(e) {
  w = Math.min(window.innerWidth, window.innerHeight / 9 * 16);
  mainImg.resize(new Vec(w, w / 16 * 9));

  w = beforeResize(e) || w;
  
  renderer.img.resize(new Vec(w, w / 16 * 9));
  
  if (!transition) scene.windowResized(e);

  afterResize(e);
}
window.addEventListener("resize", windowResized);

document.addEventListener("keydown", e => {
  if (debug) console.log(e.key);

  pressed[e.key.toLowerCase()] = true;

  if (!transition) scene.keydown(e);
  
});
document.addEventListener("keyup", e => {
  delete pressed[e.key.toLowerCase()];

  if (!transition) scene.keyup(e);
});

document.addEventListener("mousemove", e => {
  mouse.x = e.clientX / mainImg.size.x * w;
  mouse.y = e.clientY / mainImg.size.x * w;
  
  if (!transition) scene.mousemove(e);
});
document.addEventListener("mousedown", e => {
  if (hoveredButton) {
    if (!transition) hoveredButton.callback();
    return;
  }
  if (!transition) scene.mousedown(e);
});
document.addEventListener("mouseup", e => {
  if (!transition) scene.mouseup(e);
});
document.addEventListener("scroll", e => {
  if (!transition) scene.scroll(e);
});

/* Get keycode from control name */
function getKeyCode(controlName) {
  return controls[controlName].toLowerCase();
}
/* Get if key corresponding to control name is pressed */
function getKeyPressed(controlName) {
  return !!pressed[getKeyCode(controlName)];
}
/* Get if keycode is same as controlName */
function getKeyEqual(keyCode, controlName) {
  return keyCode.toLowerCase() == getKeyCode(controlName);
}

function draw() {
  requestAnimationFrame(draw);

  let time = performance.now();
  let dt = Math.min(time - lastFrameTime, 200);

  if (targetFPS != undefined && time - lastFrameTime < 1000 / targetFPS) return; 
  lastFrameTime = time;

  hoveredButton = undefined;
  debugStats = {};
  debugStats["fps"] = Math.round(1000 / dt);
  
  renderer.set("textAlign", ["left", "top"]);

  let gameDt = (targetFPS == undefined) ? dt * 0.001 : 1 / targetFPS;

  beforeUpdate();
  if (!transition) scene.update(gameDt);  

  for (let i = 0; i < timers.length; i++) timers[i].tick(gameDt);
  afterUpdate();

  beforeRender();
  if (!transition) renderGame();
  else transition.render();
  afterRender();

  renderer.set("fill", 255);
  renderer.set("stroke", 0);
  renderer.set("font", "16px monospace");
  if (debug) {
    let n = 0;
    for (let i in debugStats) {
      renderer.text(`${i}: ${JSON.stringify(debugStats[i])}`, new Vec(0, n * 16));
      n++;
    }
  }

  renderer.display(mainImg);
}

function renderGame() {
  scene.render();
}

window.oncontextmenu = (e) => {
  e.preventDefault(); 
  e.stopPropagation(); 
  return false;
};