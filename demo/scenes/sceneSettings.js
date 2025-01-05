class SceneSettings extends Scene {
  constructor() {
    super();

    this.cam = new Camera(new Vec(800, 450));
    this.cam.w = 1600;
    this.cam.renderW = nde.w;
  }

  start() {
    let buttonStyle = {
      padding: 10, 

      text: {font: "50px monospace", fill: "rgb(255, 255, 255)"}, 
      hover: {text: {fill: "rgb(255, 0, 0)"}}
    };


    let settingCollectionStyle = {
      size: new Vec(500, 50),
      gap: 10,
      settingXOffset: 600,

      text: {
        font: "50px monospace",
      },

      setting: {
        padding: 10, 
        hover: { 
          stroke: "rgba(255, 0, 0, 1)", 
          checkbox: {
            stroke: "rgba(255, 0, 0, 1)", 
            fill: "rgba(255, 0, 0, 1)"
          },
          range: {
            fill: "rgba(255, 0, 0, 1)", 
            stroke: "rgba(255, 0, 0, 1)"
          },
        },
      }
    };

    this.buttons = [
      new ButtonText(new Vec(50, 50), "Back", buttonStyle, {mousedown: [function () {
        nde.transition = new TransitionSlide(scenes.mainMenu, new TimerTime(0.2));
      }]}),

      new SettingCollection(new Vec(50, 150), ndeSettings, settingCollectionStyle, {
        overrideBackground: {type: CheckboxBase, args: [false], size: new Vec(50, 50), name: "Override Background"},
        backgroundR: {type: RangeBase, args: [0, 255, 19], name: "Background R"},
        backgroundG: {type: RangeBase, args: [0, 255, 19], name: "Background G", style: {setting: {padding: 10, hover: {range: {fill: "rgba(0, 255, 0, 1)", stroke: "rgba(0, 255, 0, 1)"}}}}},
        backgroundB: {type: RangeBase, args: [0, 255, 19], name: "Background B", style: {setting: {padding: 10, hover: {range: {fill: "rgba(0, 0, 255, 1)", stroke: "rgba(0, 0, 255, 1)"}}}}},
      }, {
        change: [function (value) {
          ndeSettings.backgroundR = Math.floor(ndeSettings.backgroundR);
          ndeSettings.backgroundG = Math.floor(ndeSettings.backgroundG);
          ndeSettings.backgroundB = Math.floor(ndeSettings.backgroundB);
          localStorage.setItem("ndeSettings", JSON.stringify(ndeSettings));
        }],
      }),
    ];
  }

  keydown(e) {
    if (nde.getKeyEqual(e.key,"Pause")) {
      nde.transition = new TransitionSlide(scenes.mainMenu, new TimerTime(0.2));
    }
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

    renderer.set("fill", ndeSettings.overrideBackground?[ndeSettings.backgroundR, ndeSettings.backgroundG, ndeSettings.backgroundB]:19);
    renderer.rect(new Vec(0, 0), new Vec(nde.w, nde.w / 16 * 9));
    
    renderer.restore();



    renderer.save();

    cam.applyTransform();
    renderer.set("lineWidth", cam.unScaleVec(new Vec(1)).x);

    this.buttons.forEach(e => e.render());

    renderer.restore();
  }
}