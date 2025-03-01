class Entity {
  constructor(pos, type) {
    this.pos = pos;
    this.dir = 0;
    this.speedMult = 1;
    this.movement = new Vec(0, 0);

    this.type = type;

    this.size = undefined;
    this.stepCooldown = undefined;
    this.currentStepCooldown = undefined;
    this.speed = undefined;
    this.texture = undefined;
  }

  update(dt) {
    if (this.movement.sqMag() > 0 && this.currentStepCooldown <= 0) {
      this.dir = Math.atan2(this.movement.y, this.movement.x) + (Math.random() - 0.5) * 0.5;
      
      this.pos.addV(new Vec(Math.cos(this.dir), Math.sin(this.dir)).mul(this.speed * this.stepCooldown));
      
      this.currentStepCooldown = this.stepCooldown;
    }
    
    this.currentStepCooldown -= dt * this.speedMult;
  }
}