class EntityBase extends Serializable {
  constructor(type = "EntityBase") {
    super(type);

    this.pos = new Vec(0, 0);
    this.dir = 0;

    this.size = undefined;
    this.speed = undefined;
    this.texture = undefined;
    this.name = undefined;
  }

  update() {
    
  }

  move(movement, dt) {
    if (movement.sqMag() == 0) return false;

    this.pos.addV(movement._mul(dt));
    
    let diff = getDeltaAngle((Math.atan2(movement.y, movement.x)), this.dir);
    this.dir -= diff * 10 * dt;

    return true;
  }

  load() {}
  unload() {}


  render() {
    renderer.save();
    renderer.translate(this.pos);
    if (this.dir) renderer.rotate(this.dir);
    renderer.translate(this.size._mul(-0.5));

    renderer.image(tex[this.texture], vecZero, this.size);

    renderer.restore();
  }

  from(data) {
    super.from(data);

    if (data.pos) this.pos = new Vec().from(data.pos); else this.pos = new Vec(0, 0);
    if (data.dir) this.dir = data.dir;

    if (data.size) this.size = new Vec().from(data.size);
    if (data.speed) this.speed = data.speed;
    if (data.texture) this.texture = data.texture;
    if (data.name) this.name = data.name;

    return this;
  }
}