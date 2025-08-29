
/*
This is a built version of nde (Nils Delicious Engine) and is basically all the source files stitched together, go to the github for source


*/
/* src/Serializable.js */
class Serializable {
  constructor() {
    this.type = this.constructor.name;
  }

  from(data) {
    return this;
  }

  copy() {
    return cloneData(this);
  }

  serialize() {
    return JSON.stringify(this);
  }
}

/*
function createData(type, props) {
  if (typeof type != "string") type = eval(type);

  let data = new type(type.name);
  for (let p in props) data[p] = props[p];

  return data;
}*/

function cloneData(data, typeOverride = undefined) {
  if (typeof data == "string") data = JSON.parse(data);

  let type = data.type;
  if (!type) type = data.constructor.name;
  if (typeOverride) type = typeOverride;
  
  console.log(type);
  
  return new (eval(type))().from(data);
}





/* src/Vec.js */
/*

All of these are valid:
let v = new Vec();
let v = new Vec(0);
let v = new Vec(0, 0);
let v = new Vec(0, 0, 0);
let v = new Vec(0, 0, 0, 0);

generally operations on vectors follow this style:
  * add: adds a scalar to each dimension of the vector
  * addV: adds two vectors together one dimension at a time, X3 = X2 + X1, Y3 = Y2 + Y1, Z3 = Z2 + Z1
  * _add: performs add but instead of mutating the vector it creates a copy of it first so the original vector is unchanged
  * _addV: performs addV but instead of mutating the vector it creates a copy of it first so the original vector is unchanged

*/

class Vec extends Serializable {
  constructor(x, y, z, w) {
    super();
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  /**
   * Creates a copy of this vector
   * 
   * @return {Vec} new vector
   */
  copy() {
    return new Vec(this.x, this.y, this.z, this.w);
  }
  /**
   * Creates an array representation of this vector
   * 
   * @return {Array<number>} array
   */
  toArray() {
    let a = [];
    if (this.x != undefined) a.push(this.x);
    if (this.y != undefined) a.push(this.y);
    if (this.z != undefined) a.push(this.z);
    if (this.w != undefined) a.push(this.w);
    
    return a;
  }
  /**
   * Creates a string representation of this vector
   * 
   * @return {string} formatted string
   */
  toString() {
    let a = "(";
    if (this.x != undefined) a += this.x;
    if (this.y != undefined) a += ", " + this.y;
    if (this.z != undefined) a += ", " + this.z;
    if (this.w != undefined) a += ", " + this.w;
    
    return a + ")";
  }
  /**
   * Checks if other vector is equal to this vector
   * 
   * @param {Vec} other
   * @return {boolean} isEqual
   */
  isEqualTo(other) {
    return this.x == other.x && this.y == other.y && this.z == other.z && this.w == other.w
  }

  /**
   * Checks if this is within either bounding box vec(x, y, width, height)
   * 
   * @param {Vec} boundingBox
   * @return {boolean} isWithin
   */
  isWithin(boundingBox) {
    if (this.x < boundingBox.x || this.x > boundingBox.x + boundingBox.z) return false;
    if (this.y < boundingBox.y || this.y > boundingBox.y + boundingBox.w) return false;
    return true;
  }
  /**
   * Sets each axis of this vector to each axis of v
   * 
   * @param {Vec} v
   * @return {Vec} this
   */
  from(v) {
    super.from(v);
    this.x = v.x != undefined ? parseFloat(v.x) : v.x;
    this.y = v.y != undefined ? parseFloat(v.y) : v.y;
    this.z = v.z != undefined ? parseFloat(v.z) : v.z;
    this.w = v.w != undefined ? parseFloat(v.w) : v.w;
    return this;
  }
  /**
   * Sets each axis of this vector
   * 
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @param {number} w
   * @return {Vec} this
   */
  set(x = undefined, y = undefined, z = undefined, w = undefined) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    return this;
  }

  /**
   * Return the square length of this vector
   * 
   * @return {number} Square length
   */
  sqMag() {
    let m = 0;
    if (this.x) m += this.x ** 2;
    if (this.y) m += this.y ** 2;
    if (this.z) m += this.z ** 2;
    if (this.w) m += this.w ** 2;
    return m;
  }
  /**
   * Return the length of this vector
   * 
   * @return {number} Length
   */
  mag() {
    return Math.sqrt(this.sqMag());
  }

  /**
   * Performs dot poduct between this and v
   * 
   * @param {Vec} v
   * @return {number} dot
   */
  dot(v) {
    let result = 0;

    if (this.x) result += this.x * v.x;
    if (this.y) result += this.y * v.y;
    if (this.z) result += this.z * v.z;
    if (this.w) result += this.w * v.w;

    return result;
  }

  /**
   * Normalizes this vector
   * 
   * @return {Vec} this
   */
  normalize() {
    let mag = this.mag();
    if (mag != 0) this.div(mag);
    return this;
  }

  
  /**
   * Floors each axis of this vector
   * 
   * @return {Vec} this
   */
  floor() {
    if (this.x) this.x = Math.floor(this.x);
    if (this.y) this.y = Math.floor(this.y);
    if (this.z) this.z = Math.floor(this.z);
    if (this.w) this.w = Math.floor(this.w);
    return this;
  }

  /**
   * Ceils each axis of this vector
   * 
   * @return {Vec} this
   */
  ceil() {
    if (this.x) this.x = Math.ceil(this.x);
    if (this.y) this.y = Math.ceil(this.y);
    if (this.z) this.z = Math.ceil(this.z);
    if (this.w) this.w = Math.ceil(this.w);
    return this;
  }
  
  /**
   * Rounds each axis of this vector
   * 
   * @return {Vec} this
   */
  round() {
    if (this.x) this.x = Math.round(this.x);
    if (this.y) this.y = Math.round(this.y);
    if (this.z) this.z = Math.round(this.z);
    if (this.w) this.w = Math.round(this.w);
    return this;
  }

  /**
   * Adds each axis of this vector by val
   * 
   * @param {number} val Term
   * @return {Vec} this
   */
  add(val) {
    return this.addV(new Vec(val, val, val, val));
  }
  /**
   * Adds each axis of this vector by each axis of v
   * 
   * @param {Vec} v Terms
   * @return {Vec} this
   */
  addV(v) {
    if (this.x != undefined && v.x != undefined) this.x += v.x;
    if (this.y != undefined && v.y != undefined) this.y += v.y;
    if (this.z != undefined && v.z != undefined) this.z += v.z;
    if (this.w != undefined && v.w != undefined) this.w += v.w;

    return this;
  }

  /**
   * Subtracts each axis of this vector by val
   * 
   * @param {number} val Subtrahend
   * @return {Vec} this
   */
  sub(val) {
    return this.subV(new Vec(val, val, val, val));
  }
  /**
   * Subtracts each axis of this vector by each axis of v
   * 
   * @param {Vec} v Subtrahends
   * @return {Vec} this
   */
  subV(v) {
    if (this.x != undefined && v.x != undefined) this.x -= v.x;
    if (this.y != undefined && v.y != undefined) this.y -= v.y;
    if (this.z != undefined && v.z != undefined) this.z -= v.z;
    if (this.w != undefined && v.w != undefined) this.w -= v.w;

    return this;
  }

  /**
   * Multiplies each axis of this vector by val
   * 
   * @param {number} val Factor
   * @return {Vec} this
   */
  mul(val) {
    return this.mulV(new Vec(val, val, val, val));
  }
  /**
   * Multiplies each axis of this vector by each axis of v
   * 
   * @param {Vec} v Factors
   * @return {Vec} this
   */
  mulV(v) {
    if (this.x != undefined && v.x != undefined) this.x *= v.x;
    if (this.y != undefined && v.y != undefined) this.y *= v.y;
    if (this.z != undefined && v.z != undefined) this.z *= v.z;
    if (this.w != undefined && v.w != undefined) this.w *= v.w;

    return this;
  }

  /**
   * Divides each axis of this vector val
   * 
   * @param {number} val Divisor
   * @return {Vec} this
   */
  div(val) {
    val = 1 / val;
    return this.mulV(new Vec(val, val, val, val));
  }
  /**
   * Divides each axis of this vector by each axis of v
   * 
   * @param {Vec} v Divisors
   * @return {Vec} this
   */
  divV(v) {
    if (this.x != undefined && v.x != undefined) this.x /= v.x;
    if (this.y != undefined && v.y != undefined) this.y /= v.y;
    if (this.z != undefined && v.z != undefined) this.z /= v.z;
    if (this.w != undefined && v.w != undefined) this.w /= v.w;

    return this;
  }

  /**
   * Rotates this vector on the Y axis
   * 
   * @param {number} angle Angle in radians to rotate
   * @return {Vec} this
   */
  rotateYAxis(angle) {
    let x = this.x;
    let z = this.z;

    this.x = x * Math.cos(angle) - z * Math.sin(angle);
    this.z = x * Math.sin(angle) + z * Math.cos(angle);

    return this;
  }

  /**
   * Rotates this vector on the Z axis
   * 
   * @param {number} angle Angle in radians to rotate
   * @return {Vec} this
   */
  rotateZAxis(angle) {
    let x = this.x;
    let y = this.y;

    this.x = x * Math.cos(angle) - y * Math.sin(angle);
    this.y = x * Math.sin(angle) + y * Math.cos(angle);

    return this;
  }

  /**
   * Sets this vector to interpolation of this vector and v2
   * 
   * @param {Vec} v2
   * @param {number} i
   * @return {Vec} this
   */
  mix(v2, i) {
    if (this.x != undefined) this.x = this.x + (v2.x - this.x) * i;
    if (this.y != undefined) this.y = this.y + (v2.y - this.y) * i;
    if (this.z != undefined) this.z = this.z + (v2.z - this.z) * i;
    if (this.w != undefined) this.w = this.w + (v2.w - this.w) * i;
    return this;
  }


  _floor() {return this.copy().floor()}
  _ceil() {return this.copy().ceil()}
  _round() {return this.copy().round()}

  _normalize() {return this.copy().normalize()}

  _add(val) {return this.copy().add(val)}
  _addV(v) {return this.copy().addV(v)}
  
  _sub(val) {return this.copy().sub(val)}
  _subV(v) {return this.copy().subV(v)}
  
  _mul(val) {return this.copy().mul(val)}
  _mulV(v) {return this.copy().mulV(v)}
  
  _div(val) {return this.copy().div(val)}
  _divV(v) {return this.copy().divV(v)}

  _rotateYAxis(angle) {return this.copy().rotateYAxis(angle)}
  _rotateZAxis(angle) {return this.copy().rotateZAxis(angle)}

  _mix(v2, i) {return this.copy().mix(v2, i)}

  _() {return this.copy()}
}

let vecZero = new Vec(0, 0);
let vecHalf = new Vec(0.5, 0.5);
let vecOne = new Vec(1, 1); 





/* src/Camera.js */
class Camera extends Serializable {
  constructor(pos) {
    super();

    this.pos = pos || new Vec(0, 0);

    this.w = 16;

    this.dir = 0;

    this.renderW;
  }

  from(data) {
    super.from(data);
    if (data.pos) this.pos = new Vec().from(data.pos);
    if (data.w) this.w = data.w;
    if (data.dir) this.dir = data.dir;
    if (data.renderW) this.renderW = data.renderW;
    
    return this;
  }

  /**
   * Transforms vector from world space to screen space
   * 
   * @param {Vec} v World space
   * @return {Vec} Screen space
   */
  transformVec(v) {
    v = v._subV(this.pos);
    v.addV(new Vec(this.w / 2 / this.scale, this.w / 2 / 16 * 9));
    v.mul(this.renderW / this.w);

    return v;
  }
  /**
   * Transforms vector from screen space to world space
   * 
   * @param {Vec} v Screen space
   * @return {Vec} World space
   */
  untransformVec(v) {
    v = v._div(this.renderW / this.w);
    v.subV(new Vec(this.w / 2, this.w / 2 / 16 * 9));
    v.addV(this.pos);

    return v;
  }

  /**
   * Scales number from world space to screen space
   * 
   * @param {number} s World space
   * @return {number} Screen space
   */
  scale(s) {
    return s * (this.renderW / this.w);
  }
  /**
   * Scales number from screen space to world space
   * 
   * @param {number} s Screen space
   * @return {number} World space
   */
  unscale(s) {
    return s / (this.renderW / this.w);
  }

  /**
   * Scales vector from world space to screen space
   * 
   * @param {Vec} v World space
   * @return {Vec} Screen space
   */
  scaleVec(v) {
    return v._mul(this.renderW / this.w);
  }
  /**
   * Scales vector from screen space to world space
   * 
   * @param {Vec} v Screen space
   * @return {Vec} World space
   */
  unscaleVec(v) {
    return v._div(this.renderW / this.w);
  }

  /**
   * Scales renderer from world space to screen space
   * 
   * @param {Renderer} r renderer
   */
  scaleRenderer(r = renderer) {
    r.scale(new Vec(this.renderW / this.w, this.renderW / this.w));
  }
  /**
   * Scales renderer from screen space to world space
   * 
   * @param {Renderer} r renderer
   */
  unscaleRenderer(r = renderer) {
    r.scale(new Vec(1, 1)._div(this.renderW / this.w));
  }

  /**
   * Transforms renderer from world space to screen space
   * 
   * @param {Renderer} r renderer
   */
  transformRenderer(r = renderer) {
    this.scaleRenderer(r);
    r.translate(new Vec(this.w / 2, this.w / 2 / 16 * 9));

    r.rotate(-this.dir);
    r.translate(this.pos._mul(-1));
  }

  /**
   * Transforms renderer from screen space to world space
   * 
   * @param {Renderer} r renderer
   */
  untransformRenderer(r = renderer) {
    r.translate(this.pos._mul(1));
    r.rotate(this.dir);

    r.translate(new Vec(this.w / -2, this.w / -2 / 16 * 9));
    this.unscaleRenderer(r);
  }

  
  /**
   * Context where renderer is transformed
   * @param {Renderer} r renderer
   */

  _(r, context) {
    r._(()=>{
      this.transformRenderer(r);
      r.set("lineWidth", this.unscale(1));

      context();
    });
  }
}





/* src/scenes/Scene.js */
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
}







/* src/assets/Asset.js */
class Asset {
  constructor() {
    this.loading = false;
    this.path = "";

    this.onload = undefined;
  }

  destroy() {}
}





/* src/assets/Img.js */
class Img extends Asset {
  constructor(size) {
    super();

    this.size = size.copy();

    this.canvas = document.createElement("canvas");
    this.canvas.width = size.x;
    this.canvas.height = size.y;

    this.ctx = this.canvas.getContext("2d");
    if (this.ctx == null) throw new Error("2d context not supported?");
  }

  resize(size) {
    this.size = size.copy();

    this.canvas.width = size.x;
    this.canvas.height = size.y;
  }



  parseColor(...args) {
    if (args.length == 1) {
      if (typeof args[0] == "string") return args[0];
      if (typeof args[0] == "number") return `rgba(${args[0]},${args[0]},${args[0]},1)`;
      if (args[0] instanceof Vec) return `rgba(${args[0].x},${args[0].y},${args[0].z},${args[0][3] == undefined ? 1 : args[0].w})`;
      if (typeof args[0] == "object") return `rgba(${args[0][0]},${args[0][1]},${args[0][2]},${args[0][3] == undefined ? 1 : args[0][3]})`;
    }
    return `rgba(${args[0]},${args[1]},${args[2]},${args[3] == undefined ? 1 : args[3]})`;
  }

  set(property, value) {
    switch (property) {
      case "fill":
        this.ctx.fillStyle = this.parseColor(value);
        break;
      case "stroke":
        this.ctx.strokeStyle = this.parseColor(value);
        break;
      case "lineWidth":
        this.ctx.lineWidth = value;
        break;
      case "textAlign":
        this.ctx.textAlign = value[0];
        this.ctx.textBaseline = value[1];
        break;
      case "font":
        this.ctx.font = value;
        break;
      case "imageSmoothing":
        this.ctx.imageSmoothingEnabled = value;
        break;
      case "filter":
        this.ctx.filter = value;
        break;
    }
  }

  setAll(styles) {
    for (let s in styles) {      
      this.set(s, styles[s]);
    }
  }

  
  translate(pos) {
    this.ctx.translate(pos.x, pos.y);
  }
  rotate(radians) {
    this.ctx.rotate(radians);
  }
  scale(scale) {
    if (scale.x == undefined) scale = new Vec(scale, scale);
    this.ctx.scale(scale.x, scale.y);
  }
  getTransform() {
    return this.ctx.getTransform();
  }
  setTransform(transform) {
    this.ctx.setTransform(transform);
  }
  resetTransform() {
    this.ctx.resetTransform();
  }


  rect(pos, size) {    
    this.ctx.beginPath();    
    this.ctx.rect(pos.x, pos.y, size.x, size.y);
    this.ctx.fill();
    this.ctx.stroke();
  }
  ellipse(pos, size) {    
    this.ctx.beginPath();    
    this.ctx.ellipse(pos.x, pos.y, size.x, size.y, 0, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();
  }
  line(pos1, pos2) {    
    this.ctx.beginPath();
    this.ctx.moveTo(pos1.x, pos1.y);
    this.ctx.lineTo(pos2.x, pos2.y);
    this.ctx.stroke();
  }
  image(img, pos, size) {
    if (!img) {
      console.error("No image supplied to renderer.image()");
    }

    if (img.isWrapper) img = img.get();
    this.ctx.drawImage(img.canvas, pos.x, pos.y, size.x, size.y);
  }

  text(t, pos) {
    t = t + "";

    let lines = t.split("\n");
    let y = 0;
    let step = 0;

    if (lines.length > 1) step = this.measureText(lines[0]).y;
    
    for (let l of lines) {
      this.ctx.fillText(l, pos.x, pos.y + y);   
      y += step;
    } 
  }
  measureText(text) {
    text = text + "";

    let size = this.ctx.measureText(text);

    let lines = text.split("\n").length;
    
    return new Vec(size.width, (size.fontBoundingBoxAscent + size.fontBoundingBoxDescent) * lines);
  }
  
  

  save() {
    this.ctx.save();
  }
  restore() {
    this.ctx.restore();
  }
  _(context) {
    this.save();
    context();
    this.restore();
  }
}





/* src/assets/ImgWrapper/ImgWrapperBase.js */
class ImgWrapperBase {
  constructor() {
    this.isWrapper = true;
  }

  get() {}
}





/* src/assets/ImgWrapper/ImgAnimation.js */
class ImgAnimation extends ImgWrapperBase {
  constructor(texs, timer, loop) {
    super();

    this.texs = texs;
    this.timer = timer;
    this.timer.loop = loop;
  }

  get() {
    let p = Math.floor(this.timer.progress * this.texs.length);
    if (this.timer.progress == 1) p--;
    let t = this.texs[p];
    
    return t;
  }

  start() {
    this.timer.start();
  }
  stop() {
    this.timer.stop();
  }
}





/* src/assets/Aud.js */
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

class Aud extends Asset {
  constructor() {
    super();

    this.duration = undefined;

    this.panner = audioContext.createPanner();
    this.panner.panningModel = 'HRTF';
    this.panner.distanceModel = 'inverse';
    this.panner.positionX.value = 0;
    this.panner.positionY.value = 1;
    this.panner.positionZ.value = 0;
    this.position = new Vec(0, 1, 0);

    this.audioBuffer = undefined;
    this.currentSource = undefined;

    this.isPlaying = false;
  }

  copy() {
    const newAud = new Aud();
    newAud.path = this.path;
    newAud.audioBuffer = this.audioBuffer;
    newAud.setPosition(this.position);
    return newAud;
  }

  setPosition(xorpos, y, z) {
    if (xorpos.x != undefined) this.position.from(xorpos);
    else this.position.set(xorpos, y, z);
    
    this.panner.positionX.value = this.position.x;
    this.panner.positionY.value = this.position.y;
    this.panner.positionZ.value = this.position.z;
  }

  play() {
    if (!this.audioBuffer) {
      console.warn('Audio not loaded yet.');
      return;
    }
    
    const source = audioContext.createBufferSource();
    source.buffer = this.audioBuffer;
    source.connect(this.panner);
    this.panner.connect(audioContext.destination);
    source.start(0);
    this.currentSource = source;
    this.isPlaying = true;
    source.onended = () => {this.isPlaying = false;}
  }
  stop() {    
    this.isPlaying = false;
    if (this.currentSource) {
      try {
        this.currentSource.stop();
      } catch (e) {
          // Already stopped
      }
      this.currentSource.disconnect();
      this.currentSource = null;
    }
  }
}





/* src/assets/AudPool.js */
class AudPool {
  constructor(aud) {
    this.aud = aud;

    this.auds = [];
  }

  get() {
    for (let i = 0; i < this.auds.length; i++) {
      let aud = this.auds[i];

      if (aud.isPlaying) continue;

      return aud;
    }
    
    let aud = this.getNew();
    this.auds.push(aud);
    return aud;
  }
  getNew() {
    return this.aud.copy();
  }
}





/* src/ui/UIBase.js */
let defaultStyle = {
  minSize: new Vec(0, 0),
  growX: false,
  growY: false,

  align: new Vec(0, 0), //0: left, 1: center, 2: right,    0: top, 1: middle, 2: bottom
  offsetPos: new Vec(0, 0),

  padding: 0,

  direction: "row",
  gap: 0,

  fill: "rgba(0, 0, 0, 0)",
  stroke: "rgba(0, 0, 0, 0)",
}

class UIBase {
  constructor(props) {
    this.defaultStyle = {};
    this.style = undefined;
    this.uiRoot = undefined;

    this.fillStyle(props.style);

    this.children = props.children || [];
    this.events = props.events || {};

    this.interactable = false;
    
    this.hovered = false;
    this.trueHovered = false;
    this.trueHoveredBottom = false;
    this.pos = new Vec(0, 0);
    this.size = new Vec(1, 1);

    this.debugColor = undefined;

  }

  registerEvent(eventName, func) {
    if (!this.events[eventName]) this.events[eventName] = [];
    this.events[eventName].push(func);
  }
  unregisterEvent(eventName, func) {
    let events = this.events[eventName];
    if (!events) return;
    let index = events.indexOf(func);
    if (index == -1) return;

    events.splice(index, 1);
  }
  fireEvent(eventName, ...args) {    
    let events = this.events[eventName];
    if (events) 
      for (let e of events) e(...args);
  }


  fillStyle(style) {
    this.style = {};
    
    if (!style) style = {};

    let temp = nestedObjectAssign({}, defaultStyle, this.defaultStyle);

    nestedObjectAssign(this.style, temp, style);

    delete this.style.hover;
    this.style.hover = nestedObjectAssign({}, this.style, style.hover);
  }

  calculateSize() {
    let isRow = this.style.direction == "row";

    this.size.set(0, 0);

    for (let c of this.children) {
      if (isRow) {
        this.size.x += c.size.x;
        this.size.y = Math.max(this.size.y, c.size.y);
      } else {
        this.size.x = Math.max(this.size.x, c.size.x);
        this.size.y += c.size.y;
      }
    }
    
    this.size.add(this.style.padding * 2);

    if (this.size.x < this.style.minSize.x) this.size.x = this.style.minSize.x;
    if (this.size.y < this.style.minSize.y) this.size.y = this.style.minSize.y;

    let gap = this.style.gap * Math.max(this.children.length - 1, 0);

    if (isRow) this.size.x += gap;
    else this.size.y += gap;
  }

  growChildren() {
    let isRow = this.style.direction == "row";

    for (let i = 0; i < 2; i++) {
      let isHor = i == 0;

      let remaining = isHor ? this.size.x : this.size.y;
      let growable = [];

      remaining -= this.style.padding * 2;

      if (isHor == isRow) {
        for (let c of this.children) {
          if (isHor) {
            remaining -= c.size.x;
            if (c.style.growX) growable.push(c);
          } else {
            remaining -= c.size.y;
            if (c.style.growY) growable.push(c);
          }
        }
        if (growable.length == 0) continue;
  
        remaining -= this.style.gap * Math.max(this.children.length - 1, 0);

        while (remaining > 0.0001) {
          let smallestChild = growable[0];

          let smallest = isHor ? smallestChild.size.x : smallestChild.size.y;
          let secondSmallest = Infinity;
          let widthToAdd = remaining;

          for (let c of growable) {
            let w = isHor ? c.size.x : c.size.y;

            if (w < smallest) {
              secondSmallest = smallest;
              smallest = w;
            }
            if (w > smallest) {
              secondSmallest = Math.min(secondSmallest, w);
              widthToAdd = secondSmallest - smallest;
            }
          }

          widthToAdd = Math.min(widthToAdd, remaining / growable.length);

          for (let c of growable) {
            let w = isHor ? c.size.x : c.size.y;

            if (w == smallest) {
              if (isHor) {
                c.size.x += widthToAdd;
              } else {
                c.size.y += widthToAdd;
              }
              remaining -= widthToAdd;
            }
          }         

        }
        for (let c of this.children) {
          if ((isHor && !c.style.growX) || (!isHor && !c.style.growY)) continue;
  
          if (isHor) {
            c.size.x += remaining / growable.length;
          } else {
            c.size.y += remaining / growable.length;
          } 
        }


      } else {
        for (let c of this.children) {
          if ((isHor && !c.style.growX) || (!isHor && !c.style.growY)) continue;
  
          if (isHor) {
            c.size.x = remaining;
          } else {
            c.size.y = remaining;
          }             
        }
      }
    }



    for (let c of this.children) {
      c.growChildren();
    }
  }

  positionChildren() {
    let isRow = this.style.direction == "row";


    let remaining = isRow ? this.size.x : this.size.y;
    remaining -= this.style.padding * 2;

    for (let c of this.children) {
      if (isRow) remaining -= c.size.x;
      else remaining -= c.size.y;
    }

    remaining -= this.style.gap * Math.max(this.children.length - 1, 0);
    remaining *= (isRow ? this.style.align.x : this.style.align.y) / 2;
    
    let along = this.style.padding + remaining;

    for (let c of this.children) {
      let remaining;

      if (isRow) {
        remaining = this.size.y - this.style.padding * 2 - c.size.y;
        remaining *= this.style.align.y / 2;

        c.pos.x = this.pos.x + along;
        c.pos.y = this.pos.y + this.style.padding + remaining;

        along += c.size.x + this.style.gap;
      } else {
        remaining = this.size.x - this.style.padding * 2 - c.size.x;
        remaining *= this.style.align.x / 2;

        c.pos.x = this.pos.x + this.style.padding + remaining;
        c.pos.y = this.pos.y + along;

        along += c.size.y + this.style.gap;
      }

      c.pos.addV(c.style.offsetPos);

      c.positionChildren();
    }
  }

  renderDebug() {
    if (this.debugColor) {
      nde.renderer.set("fill", `rgb(${this.debugColor}, 0, 0)`);
      nde.renderer.set("stroke", `rgb(255, 255, 255)`);

      if (this.trueHovered) {
        nde.renderer.set("fill", `rgb(${this.debugColor}, ${this.debugColor}, 0)`);
      }

      if (this.trueHoveredBottom) {
        nde.renderer.set("fill", `rgb(0, 255, 0)`);

        nde.debugStats.uiClass = this.__proto__.constructor.name;
        nde.debugStats.uiPos = this.pos;
        nde.debugStats.uiSize = this.size;
      }
    }
  }

  render() {
    nde.renderer.setAll(this.hovered ? this.style.hover : this.style);

    this.renderDebug();

    nde.renderer.rect(this.pos, this.size);   
  }
}

function nestedObjectAssign(dest, target, source) {  
  Object.assign(dest, target, source);
  if (target == undefined || source == undefined) return dest;

  for (let key in dest) {
    let ob = dest[key];
    
    if (ob instanceof Vec) {
      dest[key] = new Vec().from(ob);
    }
    else if (Array.isArray(ob)) {
      
    }
    else if (ob instanceof Object) {
      dest[key] = nestedObjectAssign({}, target[key], source[key]);
    }
  }

  return dest;
}






/* src/ui/UIRoot.js */
class UIRoot extends UIBase {
  constructor(props) {
    super(props);

    this.defaultStyle = {
      direction: "column"
    };

    this.fillStyle(props.style);

    if (props.pos) this.pos.from(props.pos);

    this.initUI();
  }

  initUI() {
    this.depth = 0;

    this.fitSizePass();
    this.growSizePass();
    this.positionPass();
  }

  renderUI() {
    nde.renderer._(()=>{
      this.hoverPass();
      this.renderPass();
    });
  }





  fitSizePass() {
    this.fitSizePassHelper(this, 0);
  }
  fitSizePassHelper(element, depth) {
    for (let c of element.children) {
      this.fitSizePassHelper(c, depth + 1);
    }

    element.uiRoot = this;
    element.calculateSize();

    this.depth = Math.max(this.depth, depth);
  }



  growSizePass() {
    this.growChildren();
  }



  positionPass() {
    this.positionChildren();
  }



  hoverPass() {    
    let mousePoint = new DOMPoint(nde.mouse.x, nde.mouse.y);
    let transformedMousePoint = mousePoint.matrixTransform(nde.renderer.getTransform().inverse());

    this.hoverPassHelper(this, false, transformedMousePoint);
  }
  hoverPassHelper(element, found, pt) {
    element.hovered = false;
    element.trueHovered = false;

    let inBounds = (pt.x >= element.pos.x && 
                    pt.x <= element.pos.x + element.size.x && 
                    pt.y >= element.pos.y && 
                    pt.y <= element.pos.y + element.size.y);
    
    element.trueHovered = inBounds;
    element.trueHoveredBottom = inBounds;

    if (
      !found &&
      element.interactable && 
      inBounds) 
    {
      nde.hoveredUIElement = element;

      found = true;
    }

    if (found) {
      element.hovered = true;
    }

    if (element.forceHover) {
      element.hovered = true;
      found = true;
    }

    for (let c of element.children) {
      this.hoverPassHelper(c, found, pt);

      if (c.trueHovered) element.trueHoveredBottom = false;
    }
  }



  renderPass() {
    this.renderPassHelper(this, 0);
  }
  renderPassHelper(element, depth) {
    if (nde.uiDebug) {
      element.debugColor = 255 / (this.depth + 1) * (depth + 1);
    } else element.debugColor = undefined;

    element.render();
    for (let c of element.children) {
      this.renderPassHelper(c, depth + 1);
    }
  }
}





/* src/ui/UIText.js */
class UIText extends UIBase {
  constructor(props) {
    super(props);
    this.children = [];

    this.defaultStyle.text = {
      fill: "rgb(255, 255, 255)",

      font: "25px monospace",
      textAlign: ["left", "top"],
    };

    this.fillStyle(props.style);

    this.text = props.text;    
  }

  calculateSize() {
    nde.renderer.setAll(this.style.text);

    this.size = nde.renderer.measureText(this.text);    

    if (this.size.x < this.style.minSize.x) this.size.x = this.style.minSize.x;
    if (this.size.y < this.style.minSize.y) this.size.y = this.style.minSize.y;
  }

  render() {
    nde.renderer.setAll(this.hovered ? this.style.hover.text : this.style.text);

    super.renderDebug();

    nde.renderer.text(this.text, this.pos);
  }
}





/* src/ui/UIImage.js */
class UIImage extends UIBase {
  constructor(props) {
    super(props);
    this.children = [];

    this.defaultStyle.image = {
      imageSmoothing: false,
    };

    this.fillStyle(props.style);  

    this.image = props.image;
  }

  render() {
    nde.renderer.setAll(this.hovered ? this.style.hover.image : this.style.image);

    super.renderDebug();

    nde.renderer.image(this.image, this.pos, this.size);
  }
}





/* src/ui/buttons/UIButton.js */
class UIButton extends UIBase {
  constructor(props) {
    super(props);

    this.interactable = true;
  }
}





/* src/ui/buttons/UIButtonText.js */
class UIButtonText extends UIButton {
  constructor(props) {
    super(props);

    this.children = [new UIText({
      text: props.text,
      style: props.textStyle,
    })];
  }
}





/* src/ui/buttons/UIButtonImage.js */
class UIButtonImage extends UIButton {
  constructor(props) {
    super(props);

    this.children = [new UIImage({
      image: props.image,
      style: props.imageStyle,
    })];
  }
}





/* src/ui/settings/UISettingBase.js */
class UISettingBase extends UIBase {
  constructor(props) {
    super(props);
    this.interactable = true;

    this.value = props.value;

    this.name = props.name;
    this.displayName = props.displayName;
  }


  initChildren() {}


  setValue(newValue) {
    this.value = newValue;
  }

  fireInput() {
    this.fireEvent("input", this.value);
  }
  fireChange() {
    this.fireEvent("change", this.value);
  }
}





/* src/ui/settings/UISettingCollection.js */
class UISettingCollection extends UISettingBase {
  constructor(props) {
    super(props);
    this.interactable = false;

    this.defaultStyle = {
      direction: "column",

      row: {growX: true},
      label: {},
    };
    this.fillStyle(props.style);  

    this.value = props.value || {};

    for (let i = 0; i < this.children.length; i++) {
      let c = this.children[i];

      let rowChildren = [c];
      
      if (props.hasLabels && c.displayName) {
        rowChildren.unshift(new UIBase({
          style: {growX: true},
        }));

        rowChildren.unshift(new UIText({
          text: c.displayName,

          style: this.style.label,
        }));
      }

      this.children[i] = new UISettingCollectionRow({
        style: this.style.row,

        children: rowChildren,
      });

      let name = c.name;
      if (name && c.value != undefined) {
        if (this.value[name] != undefined) c.setValue(this.value[name]);
        else this.value[name] = c.value;
  
        c.registerEvent("input", value => {
          this.value[name] = value;
          this.fireEvent("input", this.value);
        });
        c.registerEvent("change", value => {
          this.value[name] = value;
          this.fireEvent("change", this.value);
        });
      }
    }
  }

  render() {
    for (let i in this.elements) {
      let elem = this.elements[i];      
      nde.renderer.setAll(this.style.text);
      nde.renderer.text(this.template[i].name || i, new Vec(this.pos.x, elem.pos.y));

      elem.render();
    }
  }
}


class UISettingCollectionRow extends UIBase {
  render() {
    if (this.children.length == 3) this.children[0].hovered = this.children[2].hovered;
    
    super.render();
  }
}






/* src/ui/settings/UISettingCheckbox.js */
class UISettingCheckbox extends UISettingBase {
  constructor(props) {
    super(props);

    this.defaultStyle.checkbox = {
      growX: true,
      growY: true,
        
      checked: {
        fill: "rgba(255, 255, 255, 1)",
        stroke: "rgba(255, 255, 255, 1)",
      },
    };
    this.fillStyle(props.style);

    this.initChildren();
    

    this.funcA = e=>this.mouseupGlobal(e);
    this.registerEvent("mouseup", e=>{this.mouseupLocal(e)});
    this.registerEvent("mousedown", e=>{
      this.forceHover = true;

      nde.registerEvent("mouseup", this.funcA);
    });

    

    this.setValue(props.value);
  }

  
  initChildren() {
    this.children = [new UIBase({
      
    })];
  }

  setValue(newValue) {
    super.setValue(newValue);

    let style = this.style.checkbox;
    if (this.value) style = {...style, ...this.style.checkbox.checked};

    let hoverStyle = this.style.hover.checkbox;
    if (this.value) hoverStyle = {...hoverStyle, ...this.style.hover.checkbox.checked};

    style.hover = hoverStyle;
    
    this.children[0].fillStyle(style);
  }

  mouseupLocal(e) {
    if (!this.forceHover) return;

    this.setValue(!this.value);
    this.fireInput();
    this.fireChange();
  }

  mouseupGlobal(e) {
    this.forceHover = false;

    nde.unregisterEvent("mouseup", this.funcA);
  }
}





/* src/ui/settings/UISettingRange.js */
class UISettingRange extends UISettingBase {
  constructor(props) {
    super(props);

    this.defaultStyle = {
      gap: 10,

      slider: {
        padding: 5,
        minSize: new Vec(300, 30),

        fill: "rgb(0, 0, 0)",
  
        active: {
          fill: "rgb(255, 255, 255)",
        },
      },

      number: {
        align: new Vec(2, 1),

        fill: "rgb(0, 0, 0)",
        
        text: {
          fill: "rgb(255, 255, 255)",
          font: "25px monospace",
        },
      },
    };
    this.fillStyle(props.style);
    

    this.min = props.min;
    this.max = props.max;
    this.step = props.step || 1;


    this.initChildren();

    this.rangeSizeTotal = new Vec(0, 0);
    this.setValue(this.value);
    

    this.rendererTransform = undefined;

    this.funcA = e=>this.mousemove(e);
    this.funcB = e=>this.mouseup(e);

    this.registerEvent("mousedown", e=>{
      this.forceHover = true;

      this.mousemove(e);

      nde.registerEvent("mousemove", this.funcA);
      nde.registerEvent("mouseup", this.funcB);
    });
  }


  initChildren() {
    this.slider = new UIBase({
      style: {...this.style.slider.active,
        hover: this.style.hover.slider.active,
      },
    });
    this.range = new UIBase({
      style: {...this.style.slider,
        hover: this.style.hover.slider,
      },

      children: [this.slider],
    });
    this.numberText = new UIText({
      text: "",

      style: {text: {...this.style.number.text,
        hover: this.style.hover.number.text,
      }},
    });
    this.number = new UIBase({
      style: {...this.style.number,
        hover: this.style.hover.number,
      },

      children: [this.numberText],
    });

    this.children = [this.range, this.number];

    let size;
    nde.renderer._(()=>{
      nde.renderer.setAll(this.style.number.text);
      size = nde.renderer.measureText(this.max);
    });

    this.number.style.minSize.x = size.x;
    
  }



  calculateSize() {
    super.calculateSize();

    this.rangeSizeTotal.from(this.range.size).sub(this.range.style.padding * 2);

    this.sizeSlider();
  }

  mousemove(e) {
    let mousePoint = new DOMPoint(nde.mouse.x, nde.mouse.y);
    let transformedMousePoint = mousePoint.matrixTransform(this.rendererTransform.inverse());
    
    let progress = Math.min(Math.max((transformedMousePoint.x - this.pos.x - this.style.padding) / this.rangeSizeTotal.x, 0), 1);

    this.setValue(progress * (this.max - this.min) + this.min);
    this.fireInput();
  }

  mouseup(e) {
    this.forceHover = false;

    nde.unregisterEvent("mousemove", this.funcA);
    nde.unregisterEvent("mouseup", this.funcB);

    this.fireChange();
  }

  setValue(newValue) {
    super.setValue(Math.round(newValue / this.step) * this.step);

    this.sizeSlider();
    
    this.numberText.text = this.value;
    this.numberText.calculateSize();
    this.number.positionChildren();
    
  }

  sizeSlider() {
    this.slider.size.x = (this.value - this.min) / (this.max - this.min) * this.rangeSizeTotal.x;
    this.slider.size.y = this.rangeSizeTotal.y;
  }

  render() {    
    super.render();
    
    this.rendererTransform = nde.renderer.getTransform();
  }
}





/* src/ui/settings/UISettingRGB.js */
class UISettingRGB extends UISettingCollection {
  
}





/* src/timers/TimerBase.js */
class TimerBase {
  constructor(callback = (timer) => {}) {
    this.elapsedFrames = 0;
    this.elapsedTime = 0;
    this.progress = 0;

    this.playing = false;
    this.loop = false;

    this.callback = callback;

    this.start();
  }

  calculateProgress() {}

  tick(dt) {
    this.elapsedFrames++; 
    this.elapsedTime += dt;
    
    this.calculateProgress();

    this.callback(this);

    if (this.progress == 1 && this.playing) {
      this.stop();

      if (!this.loop) return

      if (this.lengthFrames) this.elapsedFrames -= this.lengthFrames; else this.elapsedFrames = 0;
      if (this.lengthTime) this.elapsedTime -= this.lengthTime; else this.elapsedTime = 0;
      this.progress = this.calculateProgress();
      this.start();
    }
  }
  
  stop() {
    let index = nde.timers.indexOf(this);
    if (index != -1) nde.timers.splice(index, 1);
    this.playing = false;
  }
  start() {
    nde.timers.push(this);
    this.playing = true;
  }

  reset() {
    this.elapsedFrames = 0;
    this.elapsedTime = 0;
    this.progress = 0;

    this.stop();
    this.start();
  }
}





/* src/timers/TimerFrames.js */
class TimerFrames extends TimerBase {
  constructor(frames, callback) {
    super(callback);

    this.lengthFrames = frames;
  }

  calculateProgress() {
    this.progress = Math.min(this.elapsedFrames / this.lengthFrames, 1);
    return this.progress;
  }
}





/* src/timers/TimerTime.js */
class TimerTime extends TimerBase {
  constructor(seconds, callback) {
    super(callback);

    this.lengthTime = seconds;
  }

  calculateProgress() {
    this.progress = Math.min(this.elapsedTime / this.lengthTime, 1);
    return this.progress;
  }
}





/* src/transitions/TransitionBase.js */
class TransitionBase {
  constructor(newScene, timer) {
    this.oldImg = new Img(new Vec(nde.w, nde.w / 16 * 9));
    this.newImg = new Img(this.oldImg.size);

    this.timer = timer;

    nde.fireEvent("render");
    this.oldImg.ctx.imageSmoothingEnabled = false;
    this.oldImg.image(nde.renderer, vecZero, this.oldImg.size);

    nde.setScene(newScene);
    newScene.update(1/60);
    nde.fireEvent("render");
    this.newImg.ctx.imageSmoothingEnabled = false;
    this.newImg.image(nde.renderer, vecZero, this.newImg.size);
  }

  render() {
    nde.renderer.set("fill", 0);
    nde.renderer.rect(new Vec(0, 0), nde.mainImg.size);

    if (this.timer.progress == 1) nde.transition = undefined;
  }
}





/* src/transitions/TransitionFade.js */
class TransitionFade extends TransitionBase {
  constructor(newScene, timer) {
    super(newScene, timer);
  }

  render() {
    super.render();
    
    nde.renderer._(()=>{
      nde.renderer.set("filter", `opacity(${(1-this.timer.progress) * 100}%)`);
      nde.renderer.image(this.oldImg, new Vec(0, 0), this.oldImg.size);
      nde.renderer.set("filter", `opacity(${this.timer.progress * 100}%)`);
      nde.renderer.image(this.newImg, new Vec(0, 0), this.newImg.size);
    });
  }
}





/* src/transitions/TransitionSlide.js */
class TransitionSlide extends TransitionBase {
  constructor(newScene, timer) {
    super(newScene, timer);
  }

  render() {
    super.render();

    let a = this.oldImg.size.x * this.timer.progress;
    let b = this.oldImg.size.x * (1 - this.timer.progress);

    let ctx = nde.renderer.ctx;
    
    nde.renderer._(()=>{
      ctx.beginPath();
      ctx.rect(0, 0, a, this.oldImg.size.y);
      ctx.clip();
      nde.renderer.image(this.newImg, new Vec(0, 0), this.oldImg.size);
    });
    nde.renderer._(()=>{
      ctx.beginPath();
      ctx.rect(a, 0, b, this.oldImg.size.y);
      ctx.clip();
      nde.renderer.image(this.oldImg, new Vec(0, 0), this.oldImg.size);
    });
  }
}





/* src/transitions/TransitionNoise.js */
class TransitionNoise extends TransitionBase {
  constructor(newScene, timer) {
    super(newScene, timer);
  }

  render() {
    super.render();

    let a = this.oldImg.ctx.getImageData(0, 0, this.oldImg.size.x, this.oldImg.size.y);
    let b = this.newImg.ctx.getImageData(0, 0, this.newImg.size.x, this.newImg.size.y);

    let lastRandom = 0;
    const random = () => {
      lastRandom = (1103515245  * lastRandom + 12345) % (2 ** 31);
      return lastRandom / 10000000 % 1;
    };

    let i = 0;
    while (i < a.data.length) {
      if (random() < this.timer.progress) {
        a.data[i  ] = b.data[i  ];
        a.data[i+1] = b.data[i+1];
        a.data[i+2] = b.data[i+2];
        a.data[i+3] = b.data[i+3];
      }
      i += 4;
    }

    nde.renderer.ctx.putImageData(a, 0, 0);

  }
}





/* src/index.js */
/*
This engine uses NDV (Nils Delicious Vectors), see engine/ndv.js


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
    this.targetFPS = undefined;
    this.hoveredUIElement = undefined;
    this.transition = undefined;
    this.renderer = new Img(vecOne);

    this.events = {};

    this.mouse = new Vec(0, 0);

    this.controls = {};
    this.pressed = {};

    this.timers = [];

    this.debug = false;
    this.uiDebug = false;
    this.debugStats = {};

    
    this.mainElem = mainElem;
    this.mainImg = new Img(new Vec(1, 1));
    this.unloadedAssets = [];

    this.lastFrameTime = 0;
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

      
        this.lastFrameTime = performance.now();
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
    
      this.pressed[e.key.toLowerCase()] = true;
    
      this.fireEvent("keydown", e);
      
    });
    document.addEventListener("keyup", e => {
      delete this.pressed[e.key.toLowerCase()];
    
      this.fireEvent("keyup", e);
    });
    
    document.addEventListener("mousemove", e => {
      this.mouse.x = e.clientX / this.mainImg.size.x * this.w;
      this.mouse.y = e.clientY / this.mainImg.size.x * this.w;


      if (this.hoveredUIElement) {
        if (!this.transition) this.hoveredUIElement.fireEvent("mousemove", e);
      }
      
      this.fireEvent("mousemove", e);
    });
    document.addEventListener("mousedown", e => {
      if (this.hoveredUIElement) {
        if (!this.transition) this.hoveredUIElement.fireEvent("mousedown", e);
        return;
      }
    
      if (this.debug) console.log("mouse" + e.button);

      this.pressed["mouse" + e.button] = true;
      this.fireEvent("mousedown", e);
    });
    document.addEventListener("mouseup", e => {
      delete this.pressed["mouse" + e.button];

      if (this.hoveredUIElement) {
        if (!this.transition) this.hoveredUIElement.fireEvent("mouseup", e);
      }
      
      this.fireEvent("mouseup", e);
    });
    document.addEventListener("wheel", e => {
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

  registerEvent(eventName, func) {
    if (!this.events[eventName]) this.events[eventName] = [];
    this.events[eventName].push(func);
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
    if (events) 
      for (let e of events) e(...args);
    
    this.scene[eventName](...args);
      
  }

  resize(e) {
    this.w = Math.min(window.innerWidth, window.innerHeight / 9 * 16);
    this.mainImg.resize(new Vec(this.w, this.w / 16 * 9));
  

    let result = undefined;
    if  (this.events["resize"]) {
      for (let ee of this.events["resize"]) {
        let res = ee(e); if (res) result = res
      };
    }
    this.scene.resize(e);

    this.w = result || this.w;
    
    this.renderer.resize(new Vec(this.w, this.w / 16 * 9));
    
    if (!this.transition) this.scene.resize(e);
  
    this.fireEvent("resize", e);
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
    this.latestDts.push(dt);
    if (this.latestDts.length > 10) this.latestDts.shift();
    let averageDt = this.latestDts.reduce((partialSum, a) => partialSum + a, 0) / this.latestDts.length;
    

    this.hoveredUIElement = undefined;
    this.debugStats = {};
    this.debugStats["frameTime"] = Math.round(averageDt);
    this.debugStats["fps"] = Math.round(1000 / averageDt);
  
    if (this.targetFPS != undefined) {
      this.debugStats["target frameTime"] = 1000 / this.targetFPS;
      this.debugStats["target fps"] = this.targetFPS;
    }
  
    let gameDt = (this.targetFPS == undefined) ? dt * 0.001 : 1 / this.targetFPS;
  
  
    this.renderer._(()=>{
      for (let i = 0; i < this.timers.length; i++) this.timers[i].tick(gameDt);
      
      if (!this.transition) this.scene.lastIndex = 0; 
      this.fireEvent("update", gameDt);
      this.fireEvent("afterUpdate", gameDt);
    
      this.fireEvent("render");
      if (this.transition) this.transition.render();
      this.fireEvent("afterRender");
    
      this.renderer.set("fill", 255);
      this.renderer.set("stroke", 0);
      let textSize = 0.012 * this.w;
      this.renderer.set("font", `${textSize}px monospace`);
      this.renderer.set("textAlign", ["left", "top"]);
      if (this.debug) {
        let n = 0;
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





