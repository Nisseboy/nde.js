class SceneSettings extends Scene {
  constructor() {
    super();

    this.cam = new Camera(new Vec(800, 450));
    this.cam.w = 1600;
    this.cam.renderW = nde.w;

    this.start(); //To initialize settings
  }

  start() {
  
    
    let buttonStyle = {
      minSize: new Vec(50, 50),

      padding: 10,

      fill: "rgb(0, 0, 0)",

      text: {font: "40px monospace"},

      hover: {
        text: {fill: "rgb(255, 0, 0)"},

        checkbox: {checked: {
          fill: "rgb(255, 0, 0)",
          stroke: "rgb(255, 0, 0)",
        }},

        slider: { active: {
          fill: "rgb(255, 0, 0)",
          stroke: "rgb(255, 0, 0)",
        }},
      },
    };
    let rangeStyle = {

      hover: {
        slider: { active: {
          fill: "rgb(255, 0, 0)",
          stroke: "rgb(255, 0, 0)",
        }},
      },
    };


    this.ui = new UIRoot({
      pos: new Vec(50, 50),

      style: {
        direction: "column",

        gap: 10,
      },

      children: [
        new UIButtonText({
          text: "Back",

          style: {...buttonStyle},
          textStyle: {...buttonStyle},

          events: {mousedown: [() => {
            nde.transition = new TransitionSlide(scenes.mainMenu, new TimerTime(0.2));
          }]},
        }),

        new UISettingCollection({
          value: settings,
          hasLabels: true,

          style: {
            gap: 10,

            row: {gap: 10,},
            label: {...buttonStyle,},
          },

          children: [
            new UISettingRange({
              name: "renderResolution", displayName: "Render Resolution",
              value: 100,
              min: 25, max: 100, step: 1,

              style: {...rangeStyle,},

              events: {
                change: [e=>{window.dispatchEvent(new Event('resize'));}]
              },
            }),

            new UIBase({
              style: {
                minSize: new Vec(50, 50)
              },
            }),

            new UISettingCheckbox({
              name: "overrideBackground", displayName: "Override Background",
              value: false,

              style: {...buttonStyle,
              }
            }),
            
            new UISettingRange({
              name: "backgroundR", displayName: "Background R",
              value: 19,
              min: 0, max: 255, step: 1,

              style: {...rangeStyle,},
            }),
            new UISettingRange({
              name: "backgroundG", displayName: "Background G",
              value: 19,
              min: 0, max: 255, step: 1,

              style: {...rangeStyle,

                hover: {slider: { active: {
                  fill: "rgb(0, 255, 0)",
                  stroke: "rgb(0, 255, 0)",
                }}},
              }
            }),
            new UISettingRange({
              name: "backgroundB", displayName: "Background B",
              value: 19,
              min: 0, max: 255, step: 1,

              style: {...rangeStyle,

                hover: {slider: { active: {
                  fill: "rgb(0, 0, 255)",
                  stroke: "rgb(0, 0, 255)",
                }}},
              }
            }),
          ],

          events: {
            input: [function (value) {
          
            }],
            change: [function (value) {
              localStorage.setItem(settingsName, JSON.stringify(settings));          
            }],
          },
        }),
      ],
    });    
  }

  keydown(e) {
    if (nde.getKeyEqual(e.key,"Pause")) {
      nde.transition = new TransitionSlide(scenes.mainMenu, new TimerTime(0.2));
    }
  }

  render() {
    let cam = this.cam;
    cam.renderW = nde.w;

    renderer.save();

    renderer.set("fill", settings.overrideBackground?[settings.backgroundR, settings.backgroundG, settings.backgroundB]:19);
    renderer.rect(vecZero, new Vec(nde.w, nde.w / 16 * 9));
    
    renderer.restore();



    renderer.save();

    cam.applyTransform();
    renderer.set("lineWidth", cam.unscale(1));
    this.ui.renderUI();

    renderer.restore();
  }
}