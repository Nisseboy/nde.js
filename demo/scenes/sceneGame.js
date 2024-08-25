class SceneGame extends Scene {
  constructor() {
    super();

    this.cam = new Camera(new Vec(0, 0));
  }
  loadWorld() {
    this.world = new World();

    this.player = this.world.entities[0];
  }

  start() {
  
  }

  keydown(e) {
    if (getKeyEqual(e.key,"Pause")) {
      transition = new TransitionSlide(scenes.mainMenu, new TimerTime(0.2));
    }
  }

  update(dt) {
    let player = this.player;
    //this.cam.pos = this.car.pos.copy();
    
    player.movement = new Vec(
      getKeyPressed("Move Right") - getKeyPressed("Move Left"),
      getKeyPressed("Move Down") - getKeyPressed("Move Up"),
    );
    player.speedMult = getKeyPressed("Run") ? 2.5 : 1

    for (let i = 0; i < this.world.entities.length; i++) {
      let e = this.world.entities[i];
      e.update(dt);
    }
  }

  render() {
    let cam = this.cam;

    renderer.set("fill", [100, 100, 50]);
    renderer.rect(new Vec(0, 0), new Vec(w, w / 16 * 9));

    renderer.save();
    cam.applyTransform();
    for (let i = 0; i < this.world.entities.length; i++) {
      let e = this.world.entities[i];

      renderer.save();
      renderer.translate(e.pos);
      renderer.rotate(e.dir);
      renderer.image(tex[e._type.texture], e._type.size._mul(-0.5), e._type.size);
      renderer.restore();

      renderer.save();
      cam.unScale();
      renderer.ellipse(new Vec(0, 0), cam.scaleVec(new Vec(1, 1)));
      renderer.restore();
    }
    renderer.restore();
  }
}