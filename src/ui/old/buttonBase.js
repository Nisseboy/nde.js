class ButtonBase extends UIElementBase {
  constructor(pos, size, events) {
    super(pos, size, events);
  }

  render() {
    super.checkHovered();
    super.render();  
  }
}