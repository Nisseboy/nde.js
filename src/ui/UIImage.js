class UIImage extends UIBase {
  constructor(props) {
    super(props);
    this.children = [];

    this.defaultStyle.image = {
      imageSmoothing: false,
    };

    this.fillStyle(props.style);  

    this.image = props.image;
  }

  render() {
    nde.renderer.setAll(this.hovered ? this.style.hover.image : this.style.image);

    super.renderDebug();

    nde.renderer.image(this.image, this.pos, this.size);
  }
}