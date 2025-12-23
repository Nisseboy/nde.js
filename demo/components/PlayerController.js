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

    //From "duck/walk" when thats the state
    this.on("step", (angle) => {
      this.transform.dir += angle;
      this.audioSource.play(nde.aud[`duck/step/${Math.floor(Math.random() * 4 + 1)}`]);
    })
  }
  
  update(dt) {
    let speedMult = nde.getKeyPressed("Run") ? 2 : 1;
    this.sprite.speed = speedMult;   

    this.vel.set(
      nde.getKeyPressed("Move Right") - nde.getKeyPressed("Move Left"),
      nde.getKeyPressed("Move Down") - nde.getKeyPressed("Move Up"),
    ).normalize().mul(this.speed * speedMult * dt);

    this.transform.pos.addV(this.vel);
    
    if (this.vel.sqMag() != 0) {
      let diff = getDeltaAngle((Math.atan2(this.vel.y, this.vel.x)), this.transform.dir);
      this.transform.dir -= diff * 20 * dt;
    }

    
  }
}