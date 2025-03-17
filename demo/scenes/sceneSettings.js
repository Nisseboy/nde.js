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

        range: {
          text: {
            margin: 10,
            width: 80,
          },
        },

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
        overrideBackground: {type: SettingCheckbox, name: "Override Background",  args: {default: false},                style: {size: new Vec(50, 50)}},
        backgroundR:        {type: SettingRange,    name: "Background R",         args: {default: 19, min: 0, max: 255}},
        backgroundG:        {type: SettingRange,    name: "Background G",         args: {default: 19, min: 0, max: 255}, style: {setting: {hover: {range: {fill: "rgba(0, 255, 0, 1)", stroke: "rgba(0, 255, 0, 1)"}}}}},
        backgroundB:        {type: SettingRange,    name: "Background B",         args: {default: 19, min: 0, max: 255}, style: {setting: {hover: {range: {fill: "rgba(0, 0, 255, 1)", stroke: "rgba(0, 0, 255, 1)"}}}}},
      }, {
        input: [function (value) {
          
        }],
        change: [function (value) {
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