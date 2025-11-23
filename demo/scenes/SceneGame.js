let world;
let player;

class SceneGame extends Scene {
  constructor() {
    super();

    this.cam = new Camera(new Vec(0, 0));
    this.cam.w = 16;
    this.cam.renderW = nde.w;
  }
  loadWorld(w) {
    this.world = w;

    this.player = this.world.entities[0];

    world = this.world;
    player = this.player;
  }

  start() {

  }

  inputdown(key) {
    if (nde.getKeyEqual(key,"Pause")) {
      nde.transition = new TransitionSlide(scenes.mainMenu, new TimerTime(0.2));
    }
  }
  inputup(key) {
    
  }

  update(dt) {    
    let speedMult = nde.getKeyPressed("Run") ? 2 : 1;
    this.player.move(new Vec(
      nde.getKeyPressed("Move Right") - nde.getKeyPressed("Move Left"),
      nde.getKeyPressed("Move Down") - nde.getKeyPressed("Move Up"),
    ).normalize().mul(this.player.speed * speedMult), dt);


    this.cam.pos.addV(new Vec(
      nde.getKeyPressed("Move Camera Right") - nde.getKeyPressed("Move Camera Left"),
      nde.getKeyPressed("Move Camera Down") - nde.getKeyPressed("Move Camera Up"),
    ).mul(dt * 5));
    moveListener(this.cam.pos);
    

    for (let i = 0; i < this.world.entities.length; i++) {
      let e = this.world.entities[i];
      e.update(dt);
    }    

  }

  render() {
    let cam = this.cam;
    cam.renderW = nde.w;


    renderer._(()=>{
      renderer.set("fill", "rgb(100, 100, 50)");
      renderer.rect(vecZero, new Vec(nde.w, nde.w / 16 * 9));
    });



    cam._(renderer, () => {
      for (let i = 0; i < this.world.entities.length; i++) {
        let e = this.world.entities[i];

        e.render();
      }
    });
  }
}