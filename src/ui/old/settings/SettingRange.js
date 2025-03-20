class SettingRange extends SettingBase {
  constructor(pos, size, style, args, events) {
    super(pos, size, events, args.default);

    this.defaultStyle.range = {
      fill: "rgba(255, 255, 255, 1)",
      stroke: "rgba(255, 255, 255, 1)",

      text: {
        margin: 10,
        width: 50,
        
        font: "50px monospace",
        textAlign: ["right", "middle"],
        fill: "rgba(255, 255, 255, 1)",
      },
    };
    
    this.fillStyle(style);
    
    this.rangeSizeTotal = new Vec(size.x - this.style.range.text.margin - this.style.range.text.width - this.style.padding, size.y);
    
    this.rangeSize = new Vec(size.y, size.y);

    this.min = args.min;
    this.max = args.max;
    this.step = args.step || 1;
    this.setValue(args.default);

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

  mousemove(e) {
    let mousePoint = new DOMPoint(nde.mouse.x, nde.mouse.y);
    let transformedMousePoint = mousePoint.matrixTransform(this.rendererTransform.inverse());
    
    let progress = Math.min(Math.max((transformedMousePoint.x - this.pos.x - this.style.padding) / this.rangeSizeTotal.x, 0), 1);
    this.setValue(progress * (this.max - this.min) + this.min);
  }

  mouseup(e) {
    this.forceHover = false;

    nde.unregisterEvent("mousemove", this.funcA);
    nde.unregisterEvent("mouseup", this.funcB);

    this.change();
  }

  setValue(newValue) {
    super.setValue(Math.round(newValue / this.step) * this.step);

    this.rangeSize.x = (this.value - this.min) / (this.max - this.min) * this.rangeSizeTotal.x;
  }

  render() {
    super.checkHovered();

    this.rendererTransform = renderer.getTransform();

    renderer.applyStyles(this.hovered ? this.style.hover : this.style);
    renderer.rect(this.pos, this.rangeSizeTotal._add(this.style.padding * 2));
    
    let numberPos = new Vec(this.pos.x + this.rangeSizeTotal.x + this.style.padding * 2 + this.style.range.text.margin, this.pos.y);
    renderer.rect(numberPos, new Vec(this.style.range.text.width, this.size.y).add(this.style.padding * 2));

    this.renderContent();

    renderer.applyStyles(this.hovered ? this.style.hover.range.text : this.style.range.text);
    renderer.text(this.value, numberPos._addV(new Vec(this.style.padding + this.style.range.text.width, this.size.y / 2 + this.style.padding)));
  }

  renderContent() {
    renderer.applyStyles(this.hovered ? this.style.hover.range : this.style.range);

    if (this.value > this.min) renderer.rect(this.pos._add(this.style.padding), this.rangeSize);   
  }
}