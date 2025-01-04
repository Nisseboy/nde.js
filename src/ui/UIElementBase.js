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
    function f(style, parent, defaultStyle) {
      for (let i in defaultStyle) {
        let s = style[i];
        parent[i] = s;

        if (typeof s == "object" && !Array.isArray(s) && i != "hover") {
          f(s, parent[i], defaultStyle[i]);
        } else {
          if (parent[i] == undefined) parent[i] = defaultStyle[i];
        }
      }
    }

    f(style, this.style, this.defaultStyle);

    f(style.hover, this.style.hover, this.style);
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

  render() {
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

    renderer.applyStyles(this.hovered ? this.style.hover : this.style);
    
    renderer.rect(this.pos, this.size._add(this.style.padding * 2));    
  }
}