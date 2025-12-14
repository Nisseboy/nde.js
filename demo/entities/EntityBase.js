class EntityBase extends Serializable {
  constructor(pos) {
    super();

    this.pos = pos || new Vec(0, 0);
    this.vel = new Vec(0, 0);
    this.dir = 0;

    this.size = undefined;
    this.speed = undefined;
    this.texture = undefined;
    this.name = undefined;
  }

  update(dt) {
    
  }

  move(movement, dt) {
    if (movement.sqMag() == 0) {this.vel.set(0, 0); return false};

    this.vel.from(movement);
    this.pos.addV(this.vel._mul(dt));
    
    let diff = getDeltaAngle((Math.atan2(movement.y, movement.x)), this.dir);
    this.dir -= diff * 20 * dt;

    return true;
  }

  load() {}
  unload() {}

  getBoundingBox() {
    return new Vec(this.pos.x - this.size.x / 2, this.pos.y - this.size.y / 2, this.size.x, this.size.y);
  }


  render() {
    renderer._(()=>{
      renderer.translate(this.pos);
      if (this.dir) renderer.rotate(this.dir);

      renderer.image(this.texture, this.size._mul(-0.5), this.size);
    });
  }

  from(data) {
    super.from(data);

    if (data.pos) this.pos = new Vec().from(data.pos);
    if (data.dir) this.dir = data.dir;

    if (data.size) this.size = new Vec().from(data.size);
    if (data.speed) this.speed = data.speed;
    if (data.name) this.name = data.name;

    return this;
  }
}