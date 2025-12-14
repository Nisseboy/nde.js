class Scene {
  constructor() {
    this.hasStarted = false;    

    this.lastIndex = 0;
    this.last = [];
  }


  
  /**
   * 
   */
  useLast(val, _default) {
    let v = this.last[this.lastIndex];
    if (v == undefined) v = (_default == undefined ? 0 : _default);

    this.last[this.lastIndex] = val;

    this.lastIndex++;

    return v;
  }


    
  /**
   * 
   */
  beforeSetup() {}
    
/**
 * 
 */
  afterSetup() {}

  
/**
 * Scene started
 */
  start() {}
  
/**
 * Scene stopped
 */
  stop() {}
 
/**
 * @param {UIEvent} e
 */
  resize(e) {}
 
/**
 * @param {KeyboardEvent} e
 */
  keydown(e) {}
  
/**
 * @param {KeyboardEvent} e
 */
  keyup(e) {}
 
/**
 * @param {MouseEvent} e
 */
  mousemove(e) {}
  
/**
 * @param {MouseEvent} e
 */
  mousedown(e) {}
  
/**
 * @param {MouseEvent} e
 */
  mouseup(e) {}
  

  
/**
 * @param {string} key
 * @param {Event} e
 */
  inputdown(key, e) {}
  
  
/**
 * @param {string} key
 * @param {Event} e
 */
  inputup(key, e) {}
  


/**
 * Mouse scrolled
 * 
 * @param {WheelEvent} e
 */
  wheel(e) {}
 
/**
 * Update scene here, called every frame
 * 
 * @param {number} dt Time in seconds since last frame
 */
  update(dt) {}

 
  /**
   * 
   * 
   * @param {number} dt Time in seconds since last frame
   */
  afterUpdate(dt) {}
    
/**
 * Render scene here, called after update
 */
  render() {}

    
/**
 * 
 */
  afterRender() {}


/**
 * 
 */
  audioContextStarted() {}
}

