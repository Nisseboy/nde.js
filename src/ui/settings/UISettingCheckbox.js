class UISettingCheckbox extends UISettingBase {
  constructor(props) {
    super(props);

    this.defaultStyle.checkbox = {
      fill: "rgba(255, 255, 255, 0)",

      growX: true,
      growY: true,
        
      checked: {
        fill: "rgba(255, 255, 255, 1)",
        stroke: "rgba(255, 255, 255, 1)",
      },
    };
    this.fillStyle(props.style);

    this.initChildren();
    

    this.funcA = e=>this.mouseupGlobal(e);
    this.registerEvent("mouseup", e=>{this.mouseupLocal(e)});
    this.registerEvent("mousedown", e=>{
      this.forceHover = true;

      nde.registerEvent("mouseup", this.funcA);
    });

    

    this.setValue(props.value);
  }

  
  initChildren() {
    this.children = [new UIBase({
      
    })];
  }

  setValue(newValue) {
    super.setValue(newValue);

    let style = this.style.checkbox;
    if (this.value) style = {...style, ...this.style.checkbox.checked};

    let hoverStyle = this.style.hover.checkbox;
    if (this.value) hoverStyle = {...hoverStyle, ...this.style.hover.checkbox.checked};

    style.hover = hoverStyle;
    
    this.children[0].fillStyle(style);
  }

  mouseupLocal(e) {
    if (!this.forceHover) return;

    this.setValue(!this.value);
    this.fireInput();
    this.fireChange();
  }

  mouseupGlobal(e) {
    this.forceHover = false;

    nde.unregisterEvent("mouseup", this.funcA);
  }
}