class SceneGame extends Scene {
  constructor() {
    super();

    this.cam = new Camera(new Vec(0, 0));
    this.cam.w = 16;
    this.cam.renderW = nde.w;
  }
  loadWorld() {
    this.world = new World();

    this.player = this.world.entities[0];
  }

  start() {
  
  }

  keydown(e) {
    if (nde.getKeyEqual(e.key,"Pause")) {
      nde.transition = new TransitionSlide(scenes.mainMenu, new TimerTime(0.2));
    }
  }

  update(dt) {
    let player = this.player;
    //this.cam.pos = this.car.pos.copy();
    
    player.movement = new Vec(
      nde.getKeyPressed("Move Right") - nde.getKeyPressed("Move Left"),
      nde.getKeyPressed("Move Down") - nde.getKeyPressed("Move Up"),
    );
    player.speedMult = nde.getKeyPressed("Run") ? 2.5 : 1

    this.cam.pos.addV(new Vec(
      nde.getKeyPressed("Move Camera Right") - nde.getKeyPressed("Move Camera Left"),
      nde.getKeyPressed("Move Camera Down") - nde.getKeyPressed("Move Camera Up"),
    ).mul(dt * 5));

    for (let i = 0; i < this.world.entities.length; i++) {
      let e = this.world.entities[i];
      e.update(dt);
    }    
  }

  render() {
    let cam = this.cam;
    cam.renderW = nde.w;

    renderer.save();

    renderer.set("fill", [100, 100, 50]);
    renderer.rect(new Vec(0, 0), new Vec(nde.w, nde.w / 16 * 9));

    renderer.restore();



    renderer.save();

    cam.applyTransform();
    renderer.set("lineWidth", cam.unScaleVec(new Vec(1)).x);

    for (let i = 0; i < this.world.entities.length; i++) {
      let e = this.world.entities[i];

      renderer.save();
      renderer.translate(e.pos);
      renderer.rotate(e.dir);
      renderer.image(tex[e.texture], e.size._mul(-0.5), e.size);
      renderer.restore();
    }

    renderer.save();
    renderer.set("fill", [200, 100, 100]);
    renderer.ellipse(new Vec(0, 0), new Vec(0.24, 0.24));
    renderer.restore();


    renderer.set("font", "1px monospace");
    renderer.set("textAlign", ["center", "top"]);
    renderer.set("fill", 255);
    renderer.text("[w a s d shift], [arrow keys]", new Vec(0, -4.5));
    
    renderer.restore();
  }
}