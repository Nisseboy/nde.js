class ButtonImage extends ButtonBase {
  constructor(pos, size, img, style, events) {
    super(pos, size, events);

    this.defaultStyle.image = {
      imageSmoothing: true,
    };
    
    this.fillStyle(style);

    this.img = img;
  }

  render() {
    super.render();

    renderer.applyStyles(this.hovered ? this.style.hover.image : this.style.image);
    
    renderer.image(this.img, this.pos._add(this.style.padding), this.size);
  }
}