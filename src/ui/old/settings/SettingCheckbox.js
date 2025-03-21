class SettingCheckbox extends SettingBase {
  constructor(pos, size, style, args, events) {
    super(pos, size, events, args.default);


    this.defaultStyle.checkbox = {
      fill: "rgba(255, 255, 255, 1)",
      stroke: "rgba(255, 255, 255, 1)",
    };
    
    this.fillStyle(style);
    
    this.setValue(args.default);

    this.funcA = e=>this.mouseup2(e);
    this.registerEvent("mouseup", e=>{this.mouseup1(e)});
    this.registerEvent("mousedown", e=>{
      this.forceHover = true;

      nde.registerEvent("mouseup", this.funcA);
    });
  }

  mouseup1(e) {
    if (!this.forceHover) return;

    this.setValue(!this.value);
    this.change();
  }

  mouseup2(e) {
    this.forceHover = false;

    nde.unregisterEvent("mouseup", this.funcA);
  }

  render() {
    super.checkHovered();
    super.render();  
    this.rendererTransform = renderer.getTransform();

    this.renderContent();
  }

  renderContent() {
    renderer.applyStyles(this.hovered ? this.style.hover.checkbox : this.style.checkbox);

    if (this.value) renderer.rect(this.pos._add(this.style.padding), this.size);   
  }
}