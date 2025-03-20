class UIRoot extends UIBase {
  constructor(props) {
    super(props);

    this.defaultStyle = {
      direction: "column"
    };

    this.fillStyle(props.style);

    if (props.pos) this.pos.from(props.pos);

    this.initUI();
  }

  initUI() {
    this.fitSizePass();
    this.growSizePass();
    this.positionPass();
  }

  renderUI() {
    renderer.save();

    this.hoverPass();
    this.renderPass();

    renderer.restore();
  }





  fitSizePass() {
    this.fitSizePassHelper(this);
  }
  fitSizePassHelper(element) {
    for (let c of element.children) {
      this.fitSizePassHelper(c);
    }

    element.calculateSize();
  }



  growSizePass() {
    this.growChildren();
  }



  positionPass() {
    this.positionChildren();
  }



  hoverPass() {    
    let mousePoint = new DOMPoint(nde.mouse.x, nde.mouse.y);
    let transformedMousePoint = mousePoint.matrixTransform(renderer.getTransform().inverse());

    this.hoverPassHelper(this, false, transformedMousePoint);
  }
  hoverPassHelper(element, found, pt) {
    element.hovered = element.forceHover;
    if (
      !found &&
      element.interactable && 
      pt.x >= element.pos.x && 
      pt.x <= element.pos.x + element.size.x && 
      pt.y >= element.pos.y && 
      pt.y <= element.pos.y + element.size.y) 
    {
      nde.hoveredUIElement = element;

      found = true;
    }

    if (found) {
      element.hovered = true;
    }

    if (element.forceHover) found = true;

    for (let c of element.children) {
      this.hoverPassHelper(c, found, pt);
    }
  }



  renderPass() {
    this.renderPassHelper(this);
  }
  renderPassHelper(element) {
    element.render();
    for (let c of element.children) {
      this.renderPassHelper(c);
    }
  }
}