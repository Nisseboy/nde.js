class UIText extends UIBase {
  constructor(props) {
    super(props);
    this.children = [];

    this.defaultStyle.text = {
      fill: "rgb(255, 255, 255)",

      font: "16px monospace",
      textAlign: ["left", "top"],
    };

    this.fillStyle(props.style);

    this.text = props.text;    
  }

  calculateSize() {
    nde.renderer.setAll(this.style.text);

    this.size = nde.renderer.measureText(this.text);    

    if (this.size.x < this.style.minSize.x) this.size.x = this.style.minSize.x;
    if (this.size.y < this.style.minSize.y) this.size.y = this.style.minSize.y;
  }

  render() {
    nde.renderer.setAll(this.hovered ? this.style.hover.text : this.style.text);

    super.renderDebug();

    nde.renderer.text(this.text, this.pos);
  }
}