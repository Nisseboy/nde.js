class PlayerController extends Component {
  constructor() {
    super();

    this.speed = 4;

    this.vel = new Vec(0, 0);
  }

  start() {
    this.audioSource = this.getComponent(AudioSource);
    this.sprite = this.getComponent(Sprite);

    this.sprite.tex = new StateMachineImg(
      new StateMachineNodeCondition(()=>{return (this.vel.x != 0 || this.vel.y != 0)}, 
        new StateMachineNodeResult(nde.tex["duck/walk"]),
        new StateMachineNodeResult(nde.tex["duck/1"]),
      )
    );


    
    this.on("step", (angle) => {
      this.transform.dir += angle;
      this.audioSource.play(nde.aud[`duck/step/${Math.floor(Math.random() * 4 + 1)}`]);
    })
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

    this.sprite.speed = speed / this.speed;   
    
  }
}