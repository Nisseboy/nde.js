class SettingCollection extends UIElementBase {
  constructor(pos, value, elementStyle, settingsTemplate, events) {
    super(pos, new Vec(0, 0), events);

    this.value = value;
    this.elementStyle = elementStyle;
    this.settingsTemplate = settingsTemplate;

    this.elements = {};

    let y = 0;
    for (let i in settingsTemplate) {
      let setting = settingsTemplate[i];      
      this.elements[i] = new setting.type(new Vec(pos.x + elementStyle.settingXOffset, pos.y + y), setting.size?setting.size:this.elementStyle.size, setting.style?setting.style:elementStyle, ...setting.args, {
        change: [value => {
          this.value[i] = value;
          this.fireEvent("change", this.value);
        }],
      });

      if (value[i] != undefined) this.elements[i].setValue(value[i]);

      this.value[i] = this.elements[i].value;

      y += (setting.size?setting.size.y:elementStyle.size.y) + (setting.gap != undefined?setting.gap:elementStyle.gap) + elementStyle.padding * 2;
      
    }
  }

  render() {
    for (let i in this.elements) {
      let elem = this.elements[i];

      renderer.set("fill", "rgba(255, 255, 255, 1)");
      renderer.set("font", `${this.elementStyle.size.y}px monospace`);
      renderer.text(i, new Vec(this.pos.x, elem.pos.y));

      elem.render();
    }
  }
}