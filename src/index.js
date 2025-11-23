/*
scene: the current active scene, is set by setScene, see engine/scenes/scene.js for base class

w: how many pixels are across the screen, is updated automatically on resize

targetFPS: if this is not undefined, the game will try to run at that fps and the deltaTime will be fixed so it will be deterministic

controls: map of control names along with key codes, set by you and used in getKeyPressed
pressed: array of all the currently pressed key codes, accessed with getKeyPressed

mouse: a vector of the mouse position
hoveredUIElement: the currently hovered ui element, but you can't see which one it is sucker

timers: array of all currently active timers, to add a timer call new TimerWhatever, see engine/timers/timerWhatever.js for details

transition: the currently active transition, set this to a new TransitionWhatever which usually takes (newScene, timerWhatever) and it will transition, see engine/transitions/transitionBase.js for base class

debug: if debugStats are shown
debugStats: map thats cleared each frame where you can put debug info

renderer: which renderer to use, pass all drawing code into this pls, see engine/renderers/rendererBase.js for base class



Events:
beforeSetup
afterSetup
keydown
keyup
mousemove
mousedown
mouseup
wheel
resize
update
afterUpdate
render
afterRender



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
  nde.js
  scenes:
    sceneGame.js
    sceneMainMenu.js
    ...
  ui:
    UIElementCustom.js
    ...
  index.js
  index.html
  style.css
  ...

*/  

class NDE {
  constructor(mainElem) {
    this.scene = undefined;
    this.w = undefined;
    this.ar = 9 / 16;
    this.targetFPS = undefined;
    this.transition = undefined;
    this.renderer = new Img(vecOne);

    this.events = {};

    this.mouse = new Vec(0, 0);
    this.mainElemBoundingBox = new Vec(0, 0, 1, 1);

    this.controls = {};
    this.pressed = {};

    this.timers = [];

    this.debug = false;
    this.debugStats = {};

    this.hoveredUIElement = undefined;
    this.hoveredUIRoot = undefined;
    this.uiDebug = false;
    
    this.mainElem = mainElem;
    this.mainImg = new Img(new Vec(1, 1));
    this.unloadedAssets = [];

    this.lastFrameTime = 0;
    this.lastGameDt = 1;
    this.latestDts = [];

    this.setScene(new Scene());

    let i = 0;
    let lastLength = Infinity;
    let interval = setInterval(e => {
      if (this.unloadedAssets.length == 0) {
        clearInterval(interval);
        
        this.fireEvent("beforeSetup");

        this.mainElem.appendChild(this.mainImg.canvas);
        this.resize();
      
        this.renderer.set("font", "16px monospace");
        this.renderer.set("textAlign", ["left", "top"]);
        this.renderer.set("imageSmoothing", false);
        
        this.fireEvent("afterSetup");


        this.setupHandlers();

        requestAnimationFrame(time => {this.draw(time)});
      }
      if (i >= 100) {
        if (this.unloadedAssets.length < lastLength) {
          i = 0;
          lastLength = this.unloadedAssets.length;
        } else {
          clearInterval(interval); 
          console.error("assets could not be loaded: " + this.unloadedAssets.map(e => e.path))
        }
      }
      
      i++;
    }, 50);
  }

  setupHandlers() {
    window.addEventListener("resize", e => {this.resize(e)});

    document.addEventListener("keydown", e => {
      if (this.debug) console.log(e.key);

      
      if (this.hoveredUIElement && !this.transition) {
        if (this.hoveredUIElement.fireEvent("keydown", e) == false) return;
        if (this.hoveredUIElement.fireEvent("inputdown", e.key.toLowerCase(), e) == false) return;
      }
    
      if (this.fireEvent("keydown", e))
        if (this.fireEvent("inputdown", e.key.toLowerCase(), e))
          this.pressed[e.key.toLowerCase()] = true;
    
      
    });
    document.addEventListener("keyup", e => {
      if (this.hoveredUIElement && !this.transition) {
        if (this.hoveredUIElement.fireEvent("keyup", e) == false) return;
        if (this.hoveredUIElement.fireEvent("inputup", e.key.toLowerCase(), e) == false) return;
      }

      this.fireEvent("keyup", e);
      this.fireEvent("inputup", e.key.toLowerCase(), e);

      delete this.pressed[e.key.toLowerCase()];
    
    });
    
    document.addEventListener("mousemove", e => {
      this.mouse.x = (e.clientX - this.mainElemBoundingBox.x) / this.mainImg.size.x * this.w;
      this.mouse.y = (e.clientY - this.mainElemBoundingBox.y) / this.mainImg.size.x * this.w;


      if (this.hoveredUIElement) {
        if (!this.transition) this.hoveredUIElement.fireEvent("mousemove", e);
      }
      
      this.fireEvent("mousemove", e);
    });
    document.addEventListener("mousedown", e => {
      if (this.hoveredUIElement) {
        if (!this.transition) this.hoveredUIElement.fireEvent("mousedown", e);
        if (!this.transition) this.hoveredUIElement.fireEvent("inputdown", "mouse" + e.button, e);
        return;
      }
    
      if (this.debug) console.log("mouse" + e.button);

      this.pressed["mouse" + e.button] = true;
      this.fireEvent("mousedown", e);
      this.fireEvent("inputdown", "mouse" + e.button, e);
    });
    document.addEventListener("mouseup", e => {
      delete this.pressed["mouse" + e.button];

      if (this.hoveredUIElement) {
        if (!this.transition) this.hoveredUIElement.fireEvent("mouseup", e);
        if (!this.transition) this.hoveredUIElement.fireEvent("inputup", "mouse" + e.button, e);
      }
      
      this.fireEvent("mouseup", e);
      this.fireEvent("inputup", "mouse" + e.button, e);
    });
    document.addEventListener("wheel", e => {
      if (this.hoveredUIElement) {
        if (!this.transition) {
          if (this.hoveredUIElement.fireEvent("wheel", e) == false) return;
          if (this.hoveredUIRoot?.wheel(e) == false) return;
        }
      }

      this.fireEvent("wheel", e);      
    });

    
    window.oncontextmenu = (e) => {
      e.preventDefault(); 
      e.stopPropagation(); 
      return false;
    };
  }

  setScene(newScene) {
    if (this.scene) this.scene.stop();
    this.scene = newScene;
    this.scene.start();
    this.scene.hasStarted = true;
  }

  registerEvent(eventName, func, isPriority = false) {
    if (!this.events[eventName]) this.events[eventName] = [];
    if (isPriority) {
      this.events[eventName].unshift(func);
    } else {
      this.events[eventName].push(func);
    }
  }
  unregisterEvent(eventName, func) {
    let events = this.events[eventName];
    if (!events) return false;

    let index = events.indexOf(func);
    if (index == -1) return false;

    events.splice(index, 1);
    return;
  }

  fireEvent(eventName, ...args) {
    if (this.transition) return;
    
    let events = this.events[eventName];
    if (events) {
      for (let e of events) {
        if (e(...args) == false) return false;
      }
    }
    
    if (this.scene[eventName](...args) == false) return false;
      
    return true;
  }

  resize(e) {
    this.w = Math.min(window.innerWidth, window.innerHeight / this.ar);
    this.mainImg.resize(new Vec(this.w, this.w * this.ar));

    let box = this.mainElem.getBoundingClientRect();
    this.mainElemBoundingBox.set(box.x, box.y, box.width, box.height);
  

    let result = undefined;
    if  (this.events["resize"]) {
      for (let ee of this.events["resize"]) {
        let res = ee(e); if (res) result = res
      };
    }

    this.w = result || this.w;
    
    this.renderer.resize(new Vec(this.w, this.w * this.ar));
    
    this.scene.resize(e);
    //this.fireEvent("resize", e);
  }

  /**
   * Gets keycode of a control
   * 
   * @param {string} controlName
   * @return {string} keyCode
   */
  getKeyCode(controlName) {
    return this.controls[controlName].toLowerCase();
  }
  /**
   * Gets if a key is pressed
   * 
   * @param {string} controlName
   * @return {boolean} pressed
   */
  getKeyPressed(controlName) {
    return !!this.pressed[this.getKeyCode(controlName)];
  }
  /**
   * Gets if keycode is equal to control keycode
   * 
   * @param {string} keyCode
   * @param {string} controlName
   * @return {boolean} equal
   */
  getKeyEqual(keyCode, controlName) {
    return keyCode.toLowerCase() == this.getKeyCode(controlName);
  }

  draw(time) {
    requestAnimationFrame(time => {this.draw(time)});
  
    if (time == undefined) time = performance.now();
    
    let dt = Math.min(time - this.lastFrameTime, 200);
    
    if (this.targetFPS != undefined) {
      if ((time + 0.1) - this.lastFrameTime < 1000 / this.targetFPS) return; 
    }
  
    this.lastFrameTime = time;
  
    this.updateGame(dt);
  }

  updateGame(dt) {
    let t1 = performance.now();
    this.hoveredUIElement = undefined;
    this.hoveredUIRoot = undefined;

    let gameDt = (this.targetFPS == undefined) ? dt * 0.001 : 1 / this.targetFPS;
    let last = this.lastGameDt;
    this.lastGameDt = gameDt;

    gameDt = Math.min(gameDt, last * 10);
    this.debugStats = {};
  
    this.renderer._(()=>{      
      for (let i = 0; i < this.timers.length; i++) this.timers[i].tick(gameDt);
      
      if (!this.transition) this.scene.lastIndex = 0; 
      this.fireEvent("update", gameDt);
      this.fireEvent("afterUpdate", gameDt);

      let t2 = performance.now();
    
      this.fireEvent("render");
      if (this.transition) this.transition.render();
      this.fireEvent("afterRender");


      this.latestDts.push(dt);
      if (this.latestDts.length > 10) this.latestDts.shift();
      let averageDt = this.latestDts.reduce((partialSum, a) => partialSum + a, 0) / this.latestDts.length;

      let debugStats2 = {};
      
      debugStats2["updateTime"] = Math.round((t2 - t1) * 10) / 10;
      debugStats2["renderTime"] = Math.round((performance.now() - t2) * 10) / 10;
      debugStats2["fps"] = Math.round(1000 / averageDt);
    
      if (this.targetFPS != undefined) {
        debugStats2["target frameTime"] = 1000 / this.targetFPS;
        debugStats2["target fps"] = this.targetFPS;
      }


    
      this.renderer.set("fill", 255);
      this.renderer.set("stroke", 0);
      let textSize = 0.012 * this.w;
      this.renderer.set("font", `${textSize}px monospace`);
      this.renderer.set("textAlign", ["left", "top"]);
      if (this.debug) {
        let n = 0;
        for (let i in debugStats2) {
          this.renderer.text(`${i}: ${JSON.stringify(debugStats2[i])}`, new Vec(0, n * textSize));
          n++;
        }
        for (let i in this.debugStats) {
          this.renderer.text(`${i}: ${JSON.stringify(this.debugStats[i])}`, new Vec(0, n * textSize));
          n++;
        }
      }
    });
    
  
    this.mainImg.ctx.imageSmoothingEnabled = false;
    this.mainImg.image(this.renderer, vecZero, this.mainImg.size);
  }

  loadImg(path) {
    let img = new Img(new Vec(1, 1));
    let image = new Image();
    image.src = path;

    img.loading = true;
    img.path = path;
    this.unloadedAssets.push(img);

    image.onload = e => {
      img.resize(new Vec(image.width, image.height));
      img.ctx.drawImage(image, 0, 0);
      img.loading = false;
      if (img.onload) img.onload();

      this.unloadedAssets.splice(this.unloadedAssets.indexOf(img));
    };
    image.onerror = e => {
      console.error(`"${path}" not found`);

      this.unloadedAssets.splice(this.unloadedAssets.indexOf(img));
    };

    return img;
  }

  loadAud(path) {
    let aud = new Aud();
    aud.loading = true;
    aud.path = path;
    this.unloadedAssets.push(aud);

    fetch(path).then(res => {
      res.arrayBuffer().then(arrayBuffer => {
        audioContext.decodeAudioData(arrayBuffer).then(audioBuffer => {
          aud.audioBuffer = audioBuffer;
          aud.loading = false;
          aud.duration = audioBuffer.duration;
          if (aud.onload) aud.onload();
          
          this.unloadedAssets.splice(this.unloadedAssets.indexOf(aud));
        });
      });
    }).catch(e => {
      console.error(`"${path}" not found`);

      this.unloadedAssets.splice(this.unloadedAssets.indexOf(asset));
    });

    return aud;
  }
}