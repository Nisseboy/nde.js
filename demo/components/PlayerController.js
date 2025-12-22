class PlayerController extends Component {
  constructor() {
    super();

    this.speed = 4;

    this.vel = new Vec(0, 0);
  }

  start() {
    this.stateMachine = new StateMachineImg(
      new StateMachineNodeCondition(()=>{return (this.vel.x != 0 || this.vel.y != 0)}, 
        new StateMachineNodeResult(nde.tex["duck/walk"]),
        new StateMachineNodeResult(nde.tex["duck/1"]),
      )
    );
    this.stateMachine.registerEvent("step", (angle) => {
      this.transform.dir += angle;
      playAudio(nde.auds[`duck/step/${Math.floor(Math.random() * 4 + 1)}`], this.transform.pos);
    });
  }
  
  update(dt) {
    let speedMult = nde.getKeyPressed("Run") ? 2 : 1;

    let vel = new Vec(
      nde.getKeyPressed("Move Right") - nde.getKeyPressed("Move Left"),
      nde.getKeyPressed("Move Down") - nde.getKeyPressed("Move Up"),
    ).normalize().mul(this.speed * speedMult);

    this.vel.from(vel);
    let speed = this.vel.mag();
    vel.mul(dt);

    this.transform.pos.addV(vel);
    
    let diff = getDeltaAngle((Math.atan2(vel.y, vel.x)), this.transform.dir);
    if (speed != 0) this.transform.dir -= diff * 20 * dt;


    
    let t = this.stateMachine.choose();
    if (t instanceof RunningAnimation) t.speed = speed / this.speed;      
    
  }

  from(data) {
    super.from(data);

    
    return this;
  }
}