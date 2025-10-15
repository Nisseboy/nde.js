class Img extends Asset {
  constructor(size) {
    super();

    this.size = size.copy();

    this.canvas = document.createElement("canvas");
    this.canvas.width = size.x;
    this.canvas.height = size.y;

    this.ctx = this.canvas.getContext("2d");
    if (this.ctx == null) throw new Error("2d context not supported?");
  }

  resize(size) {
    this.size = size.copy();

    this.canvas.width = size.x;
    this.canvas.height = size.y;
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

  set(property, value) {
    switch (property) {
      case "fill":
        this.ctx.fillStyle = this.parseColor(value);
        break;
      case "stroke":
        this.ctx.strokeStyle = this.parseColor(value);
        break;
      case "lineWidth":
        this.ctx.lineWidth = value;
        break;
      case "textAlign":
        this.ctx.textAlign = value[0];
        this.ctx.textBaseline = value[1];
        break;
      case "font":
        this.ctx.font = value;
        break;
      case "imageSmoothing":
        this.ctx.imageSmoothingEnabled = value;
        break;
      case "filter":
        this.ctx.filter = value;
        break;
    }
  }

  setAll(styles) {
    for (let s in styles) {      
      this.set(s, styles[s]);
    }
  }

  
  translate(pos) {
    this.ctx.translate(pos.x, pos.y);
  }
  rotate(radians) {
    this.ctx.rotate(radians);
  }
  scale(scale) {
    if (scale.x == undefined) scale = new Vec(scale, scale);
    this.ctx.scale(scale.x, scale.y);
  }
  getTransform() {
    return this.ctx.getTransform();
  }
  setTransform(transform) {
    this.ctx.setTransform(transform);
  }
  resetTransform() {
    this.ctx.resetTransform();
  }


  rect(pos, size) {    
    this.ctx.beginPath();    
    this.ctx.rect(pos.x, pos.y, size.x, size.y);
    this.ctx.fill();
    this.ctx.stroke();
  }
  ellipse(pos, size) {    
    this.ctx.beginPath();    
    this.ctx.ellipse(pos.x, pos.y, size.x, size.y, 0, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();
  }
  circle(pos, r) {    
    this.ctx.beginPath();    
    this.ctx.ellipse(pos.x, pos.y, r, r, 0, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();
  }
  line(pos1, pos2) {    
    this.ctx.beginPath();
    this.ctx.moveTo(pos1.x, pos1.y);
    this.ctx.lineTo(pos2.x, pos2.y);
    this.ctx.stroke();
  }
  image(img, pos, size) {
    if (!img) {
      console.error("No image supplied to renderer.image()");
    }

    if (img.isWrapper) img = img.get();
    this.ctx.drawImage(img.canvas, pos.x, pos.y, size.x, size.y);
  }

  text(t, pos) {
    t = t + "";

    let lines = t.split("\n");
    let y = 0;
    let step = 0;

    if (lines.length > 1) step = this.measureText(lines[0]).y;
    
    for (let l of lines) {
      this.ctx.fillText(l, pos.x, pos.y + y);   
      y += step;
    } 
  }
  measureText(text) {
    text = text + "";
    let size = new Vec(0, 0);
    

    let lines = text.split("\n");
    for (let line of lines) {
      let s = this.ctx.measureText(line);
      size.x = Math.max(size.x, s.width);
      size.y += s.fontBoundingBoxAscent + s.fontBoundingBoxDescent;
    }
    
    return size;
  }


  clipRect(pos, size, context) {
    this.ctx.save();
    
    this.ctx.beginPath();
    this.ctx.rect(pos.x, pos.y, size.x, size.y);
    this.ctx.clip();

    context();
    this.ctx.restore();
  }
  
  

  save() {
    this.ctx.save();
  }
  restore() {
    this.ctx.restore();
  }
  _(context) {
    this.save();
    context();
    this.restore();
  }
}