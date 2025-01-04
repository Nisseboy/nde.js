class RangeFill extends RangeBase {
  constructor(pos, size, style, min, max, value, events) {
    super(pos, size, style, min, max, value, events);

    this.defaultStyle.range = {
      
      fill: "rgba(255, 255, 255, 1)",
      stroke: "rgba(255, 255, 255, 1)",
    };
    
    this.fillStyle(style);
  }
  render() {
    super.render();

    renderer.applyStyles(this.hovered ? this.style.hover.range : this.style.range);

    if (this.value > this.min) renderer.rect(this.pos._add(this.style.padding), this.rangeSize);   
  }
}