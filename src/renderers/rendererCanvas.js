class RendererCanvas extends RendererBase {
  constructor() {
    super();
  }

  parseColor(...args) {
    if (args.length == 1) {
      if (typeof args[0] == "number") return `rgba(${args[0]},${args[0]},${args[0]},1)`;
      if (typeof args[0] == "object") return `rgba(${args[0][0]},${args[0][1]},${args[0][2]},1)`;
    }
    return `rgba(${args[0]},${args[1]},${args[2]},1)`;
  }

  
  translate(pos) {
    this.img.ctx.translate(pos.x, pos.y);
  }
  rotate(radians) {
    this.img.ctx.rotate(radians);
  }
  resetTransform() {
    this.img.ctx.resetTransform();
  }

  set(property, value) {
    switch (property) {
      case "fill":
        this.img.ctx.fillStyle = this.parseColor(value);
        break;
      case "stroke":
        this.img.ctx.strokeStyle = this.parseColor(value);
        break;
      case "textAlign":
        this.img.ctx.textAlign = value[0];
        this.img.ctx.textBaseline = value[1];
        break;
      case "font":
        this.img.ctx.font = value;
        break;
      case "imageSmoothing":
        this.img.ctx.imageSmoothingEnabled = value;
        break;
      case "filter":
        this.img.ctx.filter = value;
        break;
    }
  }

  measureText(text) {
    return this.img.ctx.measureText(text);
  }

  save() {
    this.img.ctx.save();
  }
  restore() {
    this.img.ctx.restore();
  }

  rect(pos, size) {    
    this.img.ctx.beginPath();    
    this.img.ctx.rect(pos.x, pos.y, size.x, size.y);
    this.img.ctx.fill();
    this.img.ctx.stroke();
  }

  text(t, pos) {
    this.img.ctx.fillText(t, pos.x, pos.y);    
  }

  image(img, pos, size) {
    this.img.ctx.drawImage(img.canvas, pos.x, pos.y, size.x, size.y);
  }

  display(targetImg) {
    super.display(targetImg);
  }
}