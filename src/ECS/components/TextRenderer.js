class TextRenderer extends Component {
  constructor(text = "", props = {}) {
    super();

    this.text = text;
    this.style = {
      fill: props.fill || "rgb(255,255,255)",
      textAlign: props.textAlign || ["center", "middle"],
      font: props.font || "1px monospace",
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