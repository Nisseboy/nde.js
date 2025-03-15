class SettingCollection extends UIElementBase {
  constructor(pos, value, style, settingsTemplate, events) {
    super(pos, new Vec(0, 0), events);

    this.value = value;

    this.defaultStyle = {
      hover: {}, //Irrelevant

      size: new Vec(500, 50),
      gap: 10,
      settingXOffset: 400,

      text: {
        font: "50px monospace",
        textAlign: ["left", "top"],
        fill: "rgba(255, 255, 255, 1)",
      },

      setting: {
        padding: 0,
      },
    };
    this.style = style;
    this.fillStyle(style);
    this.settingsTemplate = settingsTemplate;

    this.elements = {};

    let y = 0;
    for (let i in settingsTemplate) {
      let setting = settingsTemplate[i];            
      this.elements[i] = new setting.type(new Vec(pos.x + (setting.settingXOffset != undefined?setting.settingXOffset:style.settingXOffset), pos.y + y), (setting.style?.size)?setting.style.size:this.style.size, (setting.style?.setting)?setting.style.setting:style.setting, setting.args, {
        change: [value => {
          this.value[i] = value;
          this.fireEvent("change", this.value);
        }],
      });

      if (value[i] != undefined) this.elements[i].setValue(value[i]);

      this.value[i] = this.elements[i].value;

      y += (setting.size?setting.size.y:style.size.y) + (setting.gap != undefined?setting.gap:style.gap) + style.setting.padding * 2;
      
    }
  }

  render() {
    for (let i in this.elements) {
      let elem = this.elements[i];

      renderer.applyStyles(this.style.text);
      renderer.text(this.settingsTemplate[i].name || i, new Vec(this.pos.x, elem.pos.y));

      elem.render();
    }
  }
}