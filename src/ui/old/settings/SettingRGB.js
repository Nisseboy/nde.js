class SettingRGB extends SettingBase {
  constructor(pos, size, style, args, events) {
    super(pos, size, events, args.default);

    this.defaultStyle.collection = {

    };
    
    this.fillStyle(style);

    this.setValue(args.default);
  }

  setValue(newValue) {
    let old = this.value.copy();
    this.value = newValue;

    if (old.x != this.value.x || old.y != this.value.y || old.z != this.value.z) this.fireEvent("input", this.value);
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

  render() {

  }
}