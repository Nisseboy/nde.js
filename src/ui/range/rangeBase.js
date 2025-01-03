class RangeBase extends UIElementBase {
  constructor(pos, size, style, min, max, value, events) {
    super(pos, size, events);

    this.defaultStyle.range = {
      fill: "rgba(255, 255, 255, 1)",
      stroke: "rgba(255, 255, 255, 1)",
    };
    
    this.fillStyle(style);

    this.rangeSize = new Vec(size.y, size.y);

    this.min = min;
    this.max = max;
    this.value = value;
    this.rangeSize.x = (value - min) / (max - min) * size.x;

    this.rendererTransform = undefined;

    this.funcA = e=>this.mousemove(e);
    this.funcB = e=>this.mouseup(e);

    this.registerEvent("mousedown", e=>{
      this.mousemove(e);

      nde.registerEvent("mousemove", this.funcA);
      nde.registerEvent("mouseup", this.funcB);
    });
  }

  mousemove(e) {
    if (!nde.pressed["mouse0"]) return;

    let mousePoint = new DOMPoint(nde.mouse.x, nde.mouse.y);
    let transformedMousePoint = mousePoint.matrixTransform(this.rendererTransform.inverse());
    
    let progress = Math.min(Math.max((transformedMousePoint.x - this.pos.x - this.style.padding) / this.size.x, 0), 1);
    this.value = progress * (this.max - this.min) + this.min;
    this.rangeSize.x = progress * this.size.x;
  }

  mouseup(e) {
    nde.unregisterEvent("mousemove", this.funcA);
    nde.unregisterEvent("mouseup", this.funcB);

    this.fireEvent("change", this.value);
  }

  render() {
    super.render();  
    this.rendererTransform = renderer.getTransform();

    renderer.applyStyles(this.hovered ? this.style.hover.range : this.style.range);

    if (this.value > this.min) renderer.rect(this.pos._add(this.style.padding), this.rangeSize);   
  }
}