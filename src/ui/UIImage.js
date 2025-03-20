class UIImage extends UIBase {
  constructor(props) {
    super(props);
    this.children = [];

    this.defaultStyle.image = {
      imageSmoothing: true,
    };

    this.fillStyle(props.style);  

    this.image = props.image;
  }

  render() {
    renderer.applyStyles(this.hovered ? this.style.hover.image : this.style.image);

    renderer.image(this.image, this.pos, this.size);
  }
}