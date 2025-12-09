class EntityPlayer extends EntityBase {
  constructor(pos) {
    super(pos);

    this.size = new Vec(1, 1);
    this.speed = 4;
    this.texture = tex["duck/1"];
    this.name = "Player";

    this.stateMachine = new StateMachineImg(
      new StateMachineNodeCondition(()=>{return (this.vel.x != 0 || this.vel.y != 0)}, 
        new StateMachineNodeResult(tex["duck/walk"]),
        new StateMachineNodeResult(tex["duck/1"]),
      )
    );
    this.stateMachine.registerEvent("step", (angle) => {
      this.dir += angle;
      playAudio(auds[`duck/step/${Math.floor(Math.random() * 4 + 1)}`], this.pos);
    });
  }

  update(dt) {
    this.texture = this.stateMachine.choose();

    let speed = this.vel.mag();
    if (this.texture instanceof RunningAnimation) this.texture.speed = speed / this.speed;
  }

  from(data) {
    super.from(data);
    //Whatever extra data here
    return this;
  }
}