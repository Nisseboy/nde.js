class RendererBase {
  constructor() {
    this.img = new Img(new Vec(1, 1));
    
    this.set("fill", 255);
    this.set("stroke", 0);
    this.set("textAlign", ["left", "top"]);
    this.set("font", "16px monospace");
    this.set("imageSmoothing", true);
    this.set("filter", "none");
  }

  parseColor(c) {}

  set(property, val) {}

  translate(pos) {}
  rotate(radians) {}
  resetTransform() {}

  measureText(text) {}

  applyStyles(styles) {
    for (let s in styles) {      
      this.set(s, styles[s]);
    }
  }

  save() {}
  restore() {}

  rect(pos, size) {}
  text(t, pos) {}
  image(img, pos, size) {}

  display(targetImg) {
    targetImg.ctx.imageSmoothingEnabled = false;
    targetImg.ctx.drawImage(this.img.canvas, 0, 0, targetImg.size.x, targetImg.size.y);
  }
}