let defaultStyle = {
  minSize: new Vec(0, 0),
  maxSize: new Vec(Infinity, Infinity),

  growX: false,
  growY: false,

  scroll: {
    x: true,
    y: true,
    alwaysShow: false,
    fill: "rgba(255, 255, 255, 255)",
    width: -1, //-1 to be padding size
  },

  align: new Vec(0, 0), //0: left, 1: center, 2: right,    0: top, 1: middle, 2: bottom

  position: "normal", //normal (from calculated pos, takes up space), relative (from parent element), absolute (from 0, 0)
  pos: new Vec(0, 0), //position offset
  selfPos: new Vec(0, 0), //position offset relative to size

  render: "normal", //normal, hidden, last

  padding: 0,

  direction: "row",
  gap: 0,

  fill: "rgba(0, 0, 0, 0)",
  stroke: "rgba(0, 0, 0, 0)",

  cursor: "auto",
}

class UIBase {
  constructor(props) {
    this.defaultStyle = {};
    this.style = undefined;

    this.parent = undefined;
    this.uiRoot = undefined;

    this.children = props.children || [];
    this.e = new EventHandler();
    if (props.events) this.e.events = props.events;

    this.interactable = false;
    
    this.hovered = false;
    this.trueHovered = false;
    this.trueHoveredBottom = false;
    this.pos = new Vec(0, 0);
    this.size = new Vec(1, 1);
    this.contentSize = new Vec(1, 1);
    this.scroll = new Vec(0, 0);

    this.debugColor = undefined;

    this.fillStyle(props.style);

  }

  on(...args) {return this.e.on(...args)}
  off(...args) {return this.e.off(...args)}
  fire(...args) {return this.e.fire(...args)}


  fillStyle(style) {
    this.style = {};
    
    if (!style) style = {};

    let temp = nestedObjectAssign({}, defaultStyle, this.defaultStyle);

    nestedObjectAssign(this.style, temp, style);

    if (this.style.size) {
      this.style.minSize = this.style.size._();
      this.style.maxSize = this.style.size._();
      delete this.style.size;
    }

    delete this.style.hover;
    this.style.hover = nestedObjectAssign({}, this.style, style.hover);
  }

  calculateSize() {
    let isRow = this.style.direction == "row";

    this.size.set(0, 0);

    let numChildren = 0;
    for (let c of this.children) {
      if (c.style.position != "normal") continue;

      if (isRow) {
        this.size.x += c.size.x;
        this.size.y = Math.max(this.size.y, c.size.y);
      } else {
        this.size.x = Math.max(this.size.x, c.size.x);
        this.size.y += c.size.y;
      }
      numChildren++;
    }
    
    this.size.add(this.style.padding * 2);

    let gap = this.style.gap * Math.max(numChildren - 1, 0);

    if (isRow) this.size.x += gap;
    else this.size.y += gap;

    this.contentSize.from(this.size);

    this.size.x = Math.min(Math.max(this.size.x, this.style.minSize.x), this.style.maxSize.x);
    this.size.y = Math.min(Math.max(this.size.y, this.style.minSize.y), this.style.maxSize.y);
  }

  growChildren() {
    let isRow = this.style.direction == "row";

    let numChildren = 0;
    for (let c of this.children) {
      if (c.style.position != "normal") continue;
      numChildren++;
    }

    for (let i = 0; i < 2; i++) {
      let isHor = i == 0;

      let remaining = isHor ? this.size.x : this.size.y;
      let growable = [];

      remaining -= this.style.padding * 2;

      if (isHor == isRow) {
        for (let c of this.children) {
          if (c.style.position != "normal") continue;

          if (isHor) {
            remaining -= c.size.x;
            if (c.style.growX) growable.push(c);
          } else {
            remaining -= c.size.y;
            if (c.style.growY) growable.push(c);
          }
        }
        if (growable.length == 0) continue;
  
        remaining -= this.style.gap * Math.max(numChildren - 1, 0);

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
          if ((isHor && !c.style.growX) || (!isHor && !c.style.growY) || c.style.position != "normal") continue;
  
          if (isHor) {
            c.size.x += remaining / growable.length;
          } else {
            c.size.y += remaining / growable.length;
          } 
        }


      } else {
        for (let c of this.children) {
          if ((isHor && !c.style.growX) || (!isHor && !c.style.growY) || c.style.position != "normal") continue;
  
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

    let numChildren = 0;
    for (let c of this.children) {
      if (c.style.position != "normal") continue;

      if (isRow) remaining -= c.size.x;
      else remaining -= c.size.y;

      numChildren++;
    }

    remaining -= this.style.gap * Math.max(numChildren - 1, 0);
    remaining *= (isRow ? this.style.align.x : this.style.align.y) / 2;
    
    let along = this.style.padding + remaining;

    for (let c of this.children) {
      switch (c.style.position) {
        case "normal":
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
          break;

        case "absolute":
          c.pos = this.uiRoot.pos._add(this.uiRoot.style.padding);
          break;

        case "relative":
          c.pos = this.pos._add(this.style.padding);
          break;
      }
      
      c.pos.subV(this.scroll);

      c.pos.addV(c.style.pos);

      c.pos.addV(c.style.selfPos._mulV(c.size));

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
        nde.debugStats.uiPos = this.pos.toString();
        nde.debugStats.uiSize = this.size.toString();
        nde.debugStats.uiContentSize = this.contentSize.toString();
        for (let style in this.style) {
          nde.debugStats[style] = this.style[style];
          if (this.style[style] instanceof Vec) nde.debugStats[style] = this.style[style].toString();
        }
      }
    }
  }

  render() {
    nde.renderer.setAll(this.hovered ? this.style.hover : this.style);

    this.renderDebug();

    nde.renderer.rect(this.pos, this.size);   
  }

  constrainScroll() {
    let maxScroll = this.contentSize._subV(this.size);
    this.scroll.x = Math.max(Math.min(this.scroll.x, maxScroll.x), 0);
    this.scroll.y = Math.max(Math.min(this.scroll.y, maxScroll.y), 0);
  }
  renderScrollbars() {
    let size = this.size._sub(this.style.padding * 2);
    let fraction = size._divV(this.contentSize);
    let scrollFraction = this.scroll._divV(this.contentSize._subV(this.size));

    let width = this.style.scroll.width;
    if (width == -1) width = this.style.padding;

    nde.renderer.set("stroke", "rgba(0, 0, 0, 0)");
    nde.renderer.set("fill", this.style.scroll.fill);
    
    
    if (this.style.scroll.x && fraction.x < 1) {
      let max = 1 - fraction.x;
      nde.renderer.rect(new Vec(this.pos.x + scrollFraction.x * max * this.size.x, this.pos.y + this.size.y - width), new Vec(this.size.x * fraction.x, width));      
    }
    
    if (this.style.scroll.y && fraction.y < 1) {
      let max = 1 - fraction.y;
      nde.renderer.rect(new Vec(this.pos.x + this.size.x - width, this.pos.y + scrollFraction.y * max * this.size.y), new Vec(width, this.size.y * fraction.y));
      
    }
    
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
