let world;
let player;

class SceneGame extends Scene {
  constructor() {
    super();

    this.cam = new Camera(new Vec(0, 0));
    this.cam.w = 16;
    this.cam.renderW = nde.w;
  }
  loadWorld() {
    world = new World();

    player = world.entities[0];
  }

  start() {
  
  }

  keydown(e) {
    this.handleInputDown(e.key);
  }
  keyup(e) {
    this.handleInputUp(e.key);
  }

  mousedown(e) {
    this.handleInputDown("mouse" + e.button);
  }
  mouseup(e) {
    this.handleInputUp("mouse" + e.button);
  }

  handleInputDown(code) {
    if (nde.getKeyEqual(code,"Pause")) {
      nde.transition = new TransitionSlide(scenes.mainMenu, new TimerTime(0.2));
    }
  }
  handleInputUp(code) {
    
  }

  update(dt) {    
    let speedMult = nde.getKeyPressed("Run") ? 2 : 1;
    player.move(new Vec(
      nde.getKeyPressed("Move Right") - nde.getKeyPressed("Move Left"),
      nde.getKeyPressed("Move Down") - nde.getKeyPressed("Move Up"),
    ).normalize().mul(player.speed * speedMult), dt);
    

    this.cam.pos.addV(new Vec(
      nde.getKeyPressed("Move Camera Right") - nde.getKeyPressed("Move Camera Left"),
      nde.getKeyPressed("Move Camera Down") - nde.getKeyPressed("Move Camera Up"),
    ).mul(dt * 5));
    

    for (let i = 0; i < world.entities.length; i++) {
      let e = world.entities[i];
      e.update(dt);
    }    
  }

  render() {
    let cam = this.cam;
    cam.renderW = nde.w;

    renderer.save();

    renderer.set("fill", "rgb(100, 100, 50)");
    renderer.rect(vecZero, new Vec(nde.w, nde.w / 16 * 9));

    renderer.restore();



    renderer.save();

    cam.transformRenderer();
    renderer.set("lineWidth", cam.unscale(1));

    for (let i = 0; i < world.entities.length; i++) {
      let e = world.entities[i];

      e.render();
    }

    renderer.restore();
  }
}