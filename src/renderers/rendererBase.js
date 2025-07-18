class RendererBase {
  constructor() {
    this.img = new Img(new Vec(1, 1));
    
    
    this.set("fill", 255);
    this.set("stroke", 0);
    this.set("lineWidth", 1);
    this.set("textAlign", ["left", "top"]);
    this.set("font", "16px monospace");
    this.set("imageSmoothing", true);
    this.set("filter", "none");
  }

  parseColor(c) {}

  set(property, val) {}

  translate(pos) {}
  rotate(radians) {}
  scale(scale) {}
  resetTransform() {}

  measureText(text) {}

  applyStyles(styles) {
    for (let s in styles) {      
      this.set(s, styles[s]);
    }
  }

  getTransform() {}
  setTransform(transform) {}

  save() {}
  restore() {}
  _(context) {
    this.save();
    context();
    this.restore();
  }

  rect(pos, size) {}
  ellipse(pos, size) {}
  text(t, pos) {}
  image(img, pos, size) {
    if (!img) {
      console.error("No image supplied to renderer.image()");
    }
  }

  display(targetImg) {
    targetImg.ctx.imageSmoothingEnabled = false;
    targetImg.ctx.drawImage(this.img.canvas, 0, 0, targetImg.size.x, targetImg.size.y);
  }
}