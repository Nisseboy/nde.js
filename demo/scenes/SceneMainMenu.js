class SceneMainMenu extends Scene {
  constructor() {
    super();
  }

  start() {
    
    this.ui = createDefaultUIRoot([
      new UIButtonImage({
        image: nde.tex["duck/1"],

        style: {...buttonStyle},
        imageStyle: {
          image: {imageSmoothing: false},
          minSize: new Vec(30, 30),
        },

        events: {mousedown: [() => {
          nde.transition = new TransitionSlide(scenes.game, new TimerTime(0.2));
        }]},
      }),

      new UIButtonText({
        style: {...buttonStyle,},
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
          nde.transition = new TransitionNoise(scenes.game, new TimerTime(0.4), false, 160);
        }]},
      }),

      new UIButtonText({
        style: {...buttonStyle},
        textStyle: {...buttonStyle},
        text: "Slide Noise",

        events: {mousedown: [() => {
          nde.transition = new TransitionNoise(scenes.game, new TimerTime(0.4), true, 160);
        }]},
      }),
          
      new UIBase({
        style: {
          minSize: buttonStyle.minSize || new Vec(0, 0),
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
    );     
  }

  render() {
    renderer._(()=>{
      renderer.set("fill", backgroundCol);
      renderer.rect(vecZero, renderer.size);
    });



    uicam._(renderer, ()=>{
      this.ui.renderUI();
    });
  }
}