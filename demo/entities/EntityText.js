class EntityText extends EntityBase {
  constructor(type = "EntityText") {
    super(type);

    this.text = undefined;
    this.style = {
      fill: "rgb(255,255,255)",
      textAlign: ["center", "middle"],
      font: "1px monospace",
    };
  }

  update(dt) {}

  load() {}
  unload() {}


  render() {
    renderer.save();
    renderer.translate(this.pos);
    if (this.dir) renderer.rotate(this.dir);

    renderer.applyStyles(this.style);
    renderer.text(this.text, vecZero);

    renderer.restore();
  }

  from(data) {
    super.from(data);

    if (data.text) this.text = data.text;
    
    return this;
  }
}