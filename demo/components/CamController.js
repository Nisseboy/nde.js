class CamController extends Component {
  constructor() {
    super();

    this.speed = 5;
  }
  
  update(dt) {
    let speedMult = nde.getKeyPressed("Run") ? 2 : 1;

    this.transform.pos.addV(new Vec(
      nde.getKeyPressed("Move Camera Right") - nde.getKeyPressed("Move Camera Left"),
      nde.getKeyPressed("Move Camera Down") - nde.getKeyPressed("Move Camera Up"),
    ).mul(speedMult * this.speed * dt));
  }
}