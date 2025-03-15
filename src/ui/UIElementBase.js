class UIElementBase {
  constructor(pos, size, events) {
    this.pos = pos;
    this.size = size;
    this.events = events;

    this.hovered = false;
    this.forceHover = false;

    this.defaultStyle = {
      padding: 0,

      fill: "rgba(0, 0, 0, 1)",
      stroke: "rgba(0, 0, 0, 1)",
    };

    this.style = {hover: {}};
  }

  fillStyle(style) {
    nestedObjectAssign(this.style, this.defaultStyle, style);

    delete this.style.hover;
    this.style.hover = nestedObjectAssign({}, this.style, style.hover);
  }

  registerEvent(eventName, func) {
    if (!this.events[eventName]) this.events[eventName] = [];
    this.events[eventName].push(func);
  }
  fireEvent(eventName, ...args) {    
    let events = this.events[eventName];
    if (events) 
      for (let e of events) e(...args);
  }

  checkHovered() {
    this.hovered = false;
    
    let mousePoint = new DOMPoint(nde.mouse.x, nde.mouse.y);
    let transformedMousePoint = mousePoint.matrixTransform(renderer.getTransform().inverse());
    if (
      transformedMousePoint.x > this.pos.x && 
      transformedMousePoint.x < this.pos.x + this.size.x + this.style.padding * 2 &&
      transformedMousePoint.y > this.pos.y && 
      transformedMousePoint.y < this.pos.y + this.size.y + this.style.padding * 2
    ) {
      this.hovered = true;
      nde.hoveredUIElement = this;
    }

    if (this.forceHover) this.hovered = true;
  }

  render() {
    renderer.applyStyles(this.hovered ? this.style.hover : this.style);
    
    renderer.rect(this.pos, this.size._add(this.style.padding * 2));    
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