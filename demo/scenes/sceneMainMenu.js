class SceneMainMenu extends Scene {
  constructor() {
    super();

    this.cam = new Camera(new Vec(800, 450));
    this.cam.w = 1600;
    this.cam.renderW = nde.w;
  }

  start() {
    let buttonStyle = {
      padding: 10, 

      text: {font: "50px monospace", fill: 255}, 
      hover: {text: {fill: [255, 0, 0]}}
    };
    this.buttons = [
      new ButtonImage(new Vec(50, 50), new Vec(50, 50), tex["duck/1"], {padding: 10, image: {imageSmoothing: false}, hover: {fill: [255, 0, 0]}}, function () { 
        nde.setScene(scenes.game);
      }),
      new ButtonText(new Vec(50, 150), "Fade", buttonStyle, function () {
        nde.transition = new TransitionFade(scenes.game, new TimerTime(0.2));
      }),
      new ButtonText(new Vec(50, 250), "Slide", buttonStyle, function () {
        nde.transition = new TransitionSlide(scenes.game, new TimerTime(0.2));
      }),
      new ButtonText(new Vec(50, 350), "Noise", buttonStyle, function () {
        nde.transition = new TransitionNoise(scenes.game, new TimerTime(0.2));
      })
    ];
  }

  update(dt) {
    this.cam.pos.addV(new Vec(
      nde.getKeyPressed("Move Camera Right") - nde.getKeyPressed("Move Camera Left"),
      nde.getKeyPressed("Move Camera Down") - nde.getKeyPressed("Move Camera Up"),
    ).mul(dt * 500));
  }

  render() {
    let cam = this.cam;
    cam.renderW = nde.w;

    renderer.save();

    renderer.set("fill", 19);
    renderer.rect(new Vec(0, 0), new Vec(nde.w, nde.w / 16 * 9));
    
    renderer.restore();



    renderer.save();

    cam.applyTransform();
    renderer.set("lineWidth", cam.unScaleVec(new Vec(1)).x);

    this.buttons.forEach(e => e.render());

    renderer.restore();
  }
}