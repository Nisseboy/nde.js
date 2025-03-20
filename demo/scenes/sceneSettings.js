class SceneSettings extends Scene {
  constructor() {
    super();

    this.cam = new Camera(new Vec(800, 450));
    this.cam.w = 1600;
    this.cam.renderW = nde.w;

    //this.start(); //To initialize settings
  }

  start() {
    /*
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
        renderResolution:   {type: SettingRange,     args: {min: 25, max: 100, default: 100, step: 1},       name: "Render Resolution", events: {change: [e=>{window.dispatchEvent(new Event('resize'));}]}},

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
    */
   
    
    let buttonStyle = {
      minSize: new Vec(50, 50),

      padding: 10,

      fill: "rgb(0, 0, 0)",

      text: {font: "50px monospace"},

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
          value: ndeSettings,
          hasLabels: true,

          style: {
            gap: 10,

            row: {
              gap: 10,
            },
            label: {...buttonStyle,
            },
          },

          children: [
            new UISettingRange({
              name: "renderResolution", displayName: "Render Resolution",
              value: 100,
              min: 25, max: 100, step: 1,

              style: {...buttonStyle,

              },

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

              style: {...buttonStyle,

              }
            }),
            new UISettingRange({
              name: "backgroundG", displayName: "Background G",
              value: 19,
              min: 0, max: 255, step: 1,

              style: {...buttonStyle,

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

              style: {...buttonStyle,

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
              localStorage.setItem("ndeSettings", JSON.stringify(ndeSettings));          
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

    this.ui.renderUI();

    renderer.restore();
  }
}