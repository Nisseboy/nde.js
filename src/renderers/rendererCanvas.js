class RendererCanvas extends RendererBase {
  constructor() {
    super();
    this.ctx = this.img.ctx;
  }

  parseColor(...args) {
    if (args.length == 1) {
      if (typeof args[0] == "string") return args[0];
      if (typeof args[0] == "number") return `rgba(${args[0]},${args[0]},${args[0]},1)`;
      if (args[0] instanceof Vec) return `rgba(${args[0].x},${args[0].y},${args[0].z},${args[0][3] == undefined ? 1 : args[0].w})`;
      if (typeof args[0] == "object") return `rgba(${args[0][0]},${args[0][1]},${args[0][2]},${args[0][3] == undefined ? 1 : args[0][3]})`;
    }
    return `rgba(${args[0]},${args[1]},${args[2]},${args[3] == undefined ? 1 : args[3]})`;
  }

  
  translate(pos) {
    this.img.ctx.translate(pos.x, pos.y);
  }
  rotate(radians) {
    this.img.ctx.rotate(radians);
  }
  scale(scale) {
    if (scale.x == undefined) scale = new Vec(scale, scale);
    this.img.ctx.scale(scale.x, scale.y);
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
      case "lineWidth":
        this.img.ctx.lineWidth = value;
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
    text = text + "";

    let size = this.img.ctx.measureText(text);

    let lines = text.split("\n").length;
    
    return new Vec(size.width, (size.fontBoundingBoxAscent + size.fontBoundingBoxDescent) * lines);
  }

  getTransform() {
    return this.img.ctx.getTransform();
  }
  setTransform(transform) {
    this.img.ctx.setTransform(transform);
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
  ellipse(pos, size) {    
    this.img.ctx.beginPath();    
    this.img.ctx.ellipse(pos.x, pos.y, size.x, size.y, 0, 0, Math.PI * 2);
    this.img.ctx.fill();
    this.img.ctx.stroke();
  }
  line(pos1, pos2) {    
    this.img.ctx.beginPath();
    this.img.ctx.moveTo(pos1.x, pos1.y);
    this.img.ctx.lineTo(pos2.x, pos2.y);
    this.img.ctx.stroke();
  }

  text(t, pos) {
    t = t + "";

    let lines = t.split("\n");
    let y = 0;
    let step = 0;

    if (lines.length > 1) step = this.measureText(lines[0]).y;
    
    for (let l of lines) {
      this.img.ctx.fillText(l, pos.x, pos.y + y);   
      y += step;
    } 
  }

  image(img, pos, size) {
    super.image(img, pos, size);
    if (img.isWrapper) img = img.get();
    this.img.ctx.drawImage(img.canvas, pos.x, pos.y, size.x, size.y);
  }

  display(targetImg) {
    super.display(targetImg);
  }
}