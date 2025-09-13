class SceneSettings extends Scene {
  constructor() {
    super();

    this.cam = new Camera(new Vec(800, 450));
    this.cam.w = 1600;
    this.cam.renderW = nde.w;

    this.start(); //To initialize settings
  }

  start() {
    this.ui = createDefaultUIRoot([
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

          row: {gap: 10},
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
              minSize: buttonStyle.minSize || new Vec(0, 0),
            },
          }),

          new UISettingCheckbox({
            name: "overrideBackground", displayName: "Override Background",
            value: false,

            style: {...buttonStyle,}
          }),
          new UISettingRange({
            name: "backgroundR", displayName: "Background R",
            value: 19,
            min: 0, max: 255, step: 1,

            style: rangeStyle,
          }),
          new UISettingRange({
            name: "backgroundG", displayName: "Background G",
            value: 19,
            min: 0, max: 255, step: 1,

            style: rangeStyle,
          }),
          new UISettingRange({
            name: "backgroundB", displayName: "Background B",
            value: 19,
            min: 0, max: 255, step: 1,

            style: rangeStyle,
          }),
          
          new UIBase({
            style: {
              minSize: buttonStyle.minSize || new Vec(0, 0),
            },
          }),

          new UISettingChoice({
            name: "choice", displayName: "Choice",
            value: "B",
            choices: [
              "A", "B", "C"
            ],

            style: buttonStyle,
          }),
          
          new UIBase({
            style: {
              minSize: buttonStyle.minSize || new Vec(0, 0),
            },
          }),

          new UISettingDropdown({
            name: "dropdown", displayName: "Dropdown",
            value: "B",
            choices: [
              "A", "B", "C", "D", "E", "F", "G", "H", "I"
            ],

            style: {...buttonStyle, 
              maxSize: new Vec(Infinity, 100)
            },
          }),

          
          
          new UIBase({
            style: {
              minSize: buttonStyle.minSize || new Vec(0, 0),
            },
          }),

          new UISettingText({
            name: "text", displayName: "Text",
            value: "text123  42\nte12fffffffffffffffffffffffff\ntext123\ntext123\ntext123\ntext123",

            style: {...buttonStyle,
              minSize: new Vec(300, 100),
              editor: {
                multiLine: true,
              }
            },
          }),

          
        ],

        events: {
          input: [function (value) {
            setBackgroundCol();
          }],
          change: [function (value) {
            localStorage.setItem(settingsName, JSON.stringify(settings));          
          }],
        },
      }),
    ]);    
  }


  inputdown(key) {
    if (nde.getKeyEqual(key,"Pause")) {
      nde.transition = new TransitionSlide(scenes.mainMenu, new TimerTime(0.2));
    }
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