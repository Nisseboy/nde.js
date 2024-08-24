class SceneMainMenu extends Scene {
  constructor() {
    super();
  }

  start() {
    let buttonStyle = {
      padding: 10, 

      text: {font: "40px monospace", fill: 255}, 
      hover: {text: {fill: [255, 0, 0]}}
    };
    this.buttons = [
      new ButtonImage(new Vec(20, 20), new Vec(40, 40), tex["duck/1"], {padding: 10, image: {imageSmoothing: false}, hover: {fill: [255, 0, 0]}}, function () { 
        setScene(scenes.game);
      }),
      new ButtonText(new Vec(20, 100), "Fade", buttonStyle, function () {
        transition = new TransitionFade(scenes.game, new TimerTime(0.2));
      }),
      new ButtonText(new Vec(20, 180), "Slide", buttonStyle, function () {
        transition = new TransitionSlide(scenes.game, new TimerTime(0.2));
      }),
      new ButtonText(new Vec(20, 260), "Noise", buttonStyle, function () {
        transition = new TransitionNoise(scenes.game, new TimerTime(0.2));
      })
    ];
  }

  update(dt) {
    
  }

  render() {
    renderer.set("fill", 19);
    renderer.rect(new Vec(0, 0), new Vec(w, w / 16 * 9));
    
    this.buttons.forEach(e => e.render());
  }
}