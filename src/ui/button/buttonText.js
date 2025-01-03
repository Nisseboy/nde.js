class ButtonText extends ButtonBase {
  constructor(pos, text, style, events) {
    super(pos, new Vec(0, 0), events);

    this.defaultStyle.text = {
      fill: "rgba(255, 255, 255, 1)",
      stroke: "rgba(0, 0, 0, 1)",
      font: "16px monospace",
      textAlign: ["left", "top"],
    };

    this.fillStyle(style);

    this.text = text;
  }


  render() {
    renderer.applyStyles(this.hovered ? this.style.hover.text : this.style.text);
    let size = renderer.measureText(this.text);
    
    this.size = new Vec(size.width, size.fontBoundingBoxAscent + size.fontBoundingBoxDescent );
    
    
    super.render();
    
    renderer.applyStyles(this.hovered ? this.style.hover.text : this.style.text);
    
    renderer.text(this.text, this.pos._add(this.style.padding));
  }
}