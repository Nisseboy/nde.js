class SceneMainMenu extends Scene {
  constructor() {
    super();

    this.cam = new Camera(new Vec(16, 9));
    this.cam.w = 32;
  }

  start() {
    let buttonStyle = {
      padding: 0.2, 

      text: {font: "1px monospace", fill: 255}, 
      hover: {text: {fill: [255, 0, 0]}}
    };
    this.buttons = [
      new ButtonImage(new Vec(1, 1), new Vec(1, 1), tex["duck/1"], {padding: 0.2, image: {imageSmoothing: false}, hover: {fill: [255, 0, 0]}}, function () { 
        setScene(scenes.game);
      }),
      new ButtonText(new Vec(1, 3), "Fade", buttonStyle, function () {
        transition = new TransitionFade(scenes.game, new TimerTime(0.2));
      }),
      new ButtonText(new Vec(1, 5), "Slide", buttonStyle, function () {
        transition = new TransitionSlide(scenes.game, new TimerTime(0.2));
      }),
      new ButtonText(new Vec(1, 7), "Noise", buttonStyle, function () {
        transition = new TransitionNoise(scenes.game, new TimerTime(0.2));
      })
    ];
  }

  update(dt) {
    this.cam.pos.addV(new Vec(
      getKeyPressed("Move Camera Right") - getKeyPressed("Move Camera Left"),
      getKeyPressed("Move Camera Down") - getKeyPressed("Move Camera Up"),
    ).mul(dt * 10));
  }

  render() {
    let cam = this.cam;

    renderer.save();

    renderer.set("fill", 19);
    renderer.rect(new Vec(0, 0), new Vec(w, w / 16 * 9));
    
    renderer.restore();



    renderer.save();

    cam.applyTransform();
    renderer.set("lineWidth", cam.unScaleVec(new Vec(1)).x);

    this.buttons.forEach(e => e.render());

    renderer.restore();
  }
}