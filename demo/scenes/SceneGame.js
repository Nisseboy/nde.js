class SceneGame extends Scene {
  constructor() {
    super();

    this.cam = new Camera(new Vec(0, 0));
    this.cam.w = 16;
    this.cam.renderW = nde.w;
  }
  createWorld() {
    let w = new Ob({name: "Root"}, [], [
      EntityPlayer.copy(),

      new Ob({name: "text", pos: new Vec(0, -4)}, [
        new TextRenderer("[w a s d shift], [arrow keys]", {}),
      ])
    ]);

    this.loadWorld(w);
  }
  loadWorld(w) {
    this.world = w;

    this.player = this.world.getComponents(PlayerInput)[0].ob;
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
    this.world.update(dt);

    this.cam.pos.from(this.player.transform.pos);
    moveListener(this.cam.pos);
  }

  render() {
    let cam = this.cam;
    cam.renderW = nde.w;


    renderer._(()=>{
      renderer.set("fill", "rgb(100, 100, 50)");
      renderer.rect(vecZero, new Vec(nde.w, nde.w / 16 * 9));
    });



    cam._(renderer, () => {
      this.world.render();
    });
  }
}