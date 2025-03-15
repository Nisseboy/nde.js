class SettingCollection extends UIElementBase {
  constructor(pos, value, style, settingsTemplate, events) {
    super(pos, new Vec(0, 0), events);

    this.value = value;

    this.defaultStyle = {
      hover: {}, //Irrelevant

      size: new Vec(500, 50),
      gap: 10,
      settingXOffset: 600,

      text: {
        font: "50px monospace",
        textAlign: ["left", "top"],
        fill: "rgba(255, 255, 255, 1)",
      },

      setting: {
        padding: 0,
      },
    };
    this.fillStyle(style);
    this.settingsTemplate = settingsTemplate;

    

    this.elements = {};

    let y = 0;
    for (let i in settingsTemplate) {
      let setting = settingsTemplate[i];   

      let settingStyle = style;
      if (setting.style) {        
        settingStyle = nestedObjectAssign({}, style, setting.style);
      }
      
      let events = setting.events || {};

      if (!events.input) events.input = [];
      if (!events.change) events.change = [];
      events.input.push(value => {
        this.value[i] = value;
        this.fireEvent("input", this.value);
      });
      events.change.push(value => {
        this.value[i] = value;
        this.fireEvent("change", this.value);
      });
      
      this.elements[i] = new setting.type(new Vec(pos.x + settingStyle.settingXOffset, pos.y + y), settingStyle.size, settingStyle.setting, setting.args, events);

      if (value[i] != undefined) this.elements[i].setValue(value[i]);

      this.value[i] = this.elements[i].value;

      
      y += settingStyle.size.y + settingStyle.gap + settingStyle.setting.padding * 2;
      
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

