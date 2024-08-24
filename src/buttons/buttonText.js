class ButtonText extends ButtonBase {
  constructor(pos, text, style, callback) {
    super(pos, new Vec(0, 0), callback);

    this.defaultStyle.text = {
      fill: 255,
      stroke: 0,
      font: "16px monospace",
    };

    this.fillStyle(style);

    this.text = text;
  }


  render() {
    renderer.applyStyles(this.hovered ? this.style.hover.text : this.style.text);
    let size = renderer.measureText(this.text);
    this.size = new Vec(size.width, size.emHeightDescent);

    super.render();
    
    renderer.applyStyles(this.hovered ? this.style.hover.text : this.style.text);
    renderer.text(this.text, this.pos._add(this.style.padding));
  }
}