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
        if (this.value[name] != undefined) c.setValue(this.value[name]);
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
  }

  render() {
    for (let i in this.elements) {
      let elem = this.elements[i];      
      nde.renderer.setAll(this.style.text);
      nde.renderer.text(this.template[i].name || i, new Vec(this.pos.x, elem.pos.y));

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
