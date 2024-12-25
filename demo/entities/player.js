class Player extends Entity {
  constructor(pos, type = "player") {
    super(pos, type);

    this.size = new Vec(1, 1);
    this.movement = new Vec(0, 0);
    this.stepCooldown = 0.1;
    this.currentStepCooldown = 0;
    this.speed = 4;
    this.texture = "duck/1";
  }
}