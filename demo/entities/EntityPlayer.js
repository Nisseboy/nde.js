class EntityPlayer extends EntityBase {
  constructor(pos) {
    super(pos);

    this.size = new Vec(1, 1);
    this.speed = 4;
    this.texture = "duck/1";
    this.name = "Player";
  }

  from(data) {
    super.from(data);
    //Whatever extra data here
    return this;
  }
}