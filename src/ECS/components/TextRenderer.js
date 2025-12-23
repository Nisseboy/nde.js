class TextRenderer extends Component {
  constructor(text = "", style = {}) {
    super();

    this.text = text;
    this.style = {
      fill: style.fill || "rgb(255,255,255)",
      textAlign: style.textAlign || ["center", "middle"],
      font: style.font || "1px monospace",
    };
  }

  render() {
    nde.renderer._(() => {
      nde.renderer.setAll(this.style);
      nde.renderer.text(this.text, this.transform.pos);
    });
  }

  from(data) {
    super.from(data);

    this.text = data.text;
    this.style = data.style;

    return this;
  }
}