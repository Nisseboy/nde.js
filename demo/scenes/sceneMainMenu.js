class SceneMainMenu extends Scene {
  constructor() {
    super();

    this.cam = new Camera(new Vec(800, 450));
    this.cam.w = 1600;
    this.cam.renderW = nde.w;
  }

  start() {
    this.ui = new UIRoot({
      pos: new Vec(50, 50),


      style: {
        direction: "column",

        gap: 10,
      },

      children: [
        new UIButtonImage({
          image: tex["duck/1"],

          style: {...buttonStyle,
            hover: {
              fill: "rgb(255, 0, 0)",
            }
          },
          imageStyle: {
            image: {imageSmoothing: false},
            minSize: new Vec(30, 30),
          },

          events: {mousedown: [() => {
            nde.transition = new TransitionSlide(scenes.game, new TimerTime(0.2));
          }]},
        }),

        new UIButtonText({
          style: {...buttonStyle},
          textStyle: {...buttonStyle},
          text: "Fade",

          events: {mousedown: [() => {
            nde.transition = new TransitionFade(scenes.game, new TimerTime(0.2));
          }]},
        }),

        new UIButtonText({
          style: {...buttonStyle},
          textStyle: {...buttonStyle},
          text: "Slide",

          events: {mousedown: [() => {
            nde.transition = new TransitionSlide(scenes.game, new TimerTime(0.2));
          }]},
        }),

        new UIButtonText({
          style: {...buttonStyle},
          textStyle: {...buttonStyle},
          text: "Noise",

          events: {mousedown: [() => {
            nde.transition = new TransitionNoise(scenes.game, new TimerTime(0.2));
          }]},
        }),

        new UIBase({
          style: {
            minSize: new Vec(80, 80),
          },
        }),

        new UIButtonText({
          style: {...buttonStyle},
          textStyle: {...buttonStyle},
          text: "Settings",

          events: {mousedown: [() => {
            nde.transition = new TransitionSlide(scenes.settings, new TimerTime(0.2));
          }]},
        }),
      ],
    });    
  }

  render() {
    let cam = this.cam;
    cam.renderW = nde.w;

    renderer._(()=>{
      renderer.set("fill", backgroundCol);
      renderer.rect(vecZero, new Vec(nde.w, nde.w / 16 * 9));
    });



    cam._(renderer, ()=>{
      this.ui.renderUI();
    });
  }
}