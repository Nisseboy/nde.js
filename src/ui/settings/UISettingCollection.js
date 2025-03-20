class UISettingCollection extends UISettingBase {
  constructor(props) {
    super(props);
    this.interactable = false;

    this.defaultStyle = {
      direction: "column",

      row: {growX: true, gap: 10},
      label: {},
    };
    this.fillStyle(props.style);  



    this.value = props.value || {};

    for (let i = 0; i < this.children.length; i++) {
      let c = this.children[i];

      let rowChildren = [c];
      
      if (props.hasLabels && c.displayName) {
        rowChildren.unshift(new UIBase({
          style: {growX: true},
        }));

        rowChildren.unshift(new UIText({
          text: c.displayName,

          style: this.style.label,
        }));
      }

      this.children[i] = new UISettingCollectionRow({
        style: this.style.row,

        children: rowChildren,
      });

      let name = c.name;
      if (name && c.value != undefined) {
        if (this.value[name]) c.setValue(this.value[name]);
        else this.value[name] = c.value;
  
        c.registerEvent("input", value => {
          this.value[name] = value;
          this.fireEvent("input", this.value);
        });
        c.registerEvent("change", value => {
          this.value[name] = value;
          this.fireEvent("change", this.value);
        });
      }
    }
return



    let y = 0;
    for (let i in template) {
      let setting = template[i];   

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
      renderer.text(this.template[i].name || i, new Vec(this.pos.x, elem.pos.y));

      elem.render();
    }
  }
}


class UISettingCollectionRow extends UIBase {
  render() {
    if (this.children.length == 3) this.children[0].hovered = this.children[2].hovered;
    
    super.render();
  }
}
