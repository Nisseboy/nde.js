let defaultStyle = {
  minSize: new Vec(0, 0),
  growX: false,
  growY: false,

  align: new Vec(0, 0), //0: left, 1: center, 2: right,    0: top, 1: middle, 2: bottom

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

        nde.debugStats.uiPos = this.pos;
        nde.debugStats.uiSize = this.size;
      }
    }
  }

  render() {
    nde.renderer.applyStyles(this.hovered ? this.style.hover : this.style);

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