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
    this.depth = 0;

    this.fitSizePass();
    this.growSizePass();
    this.positionPass();

    this.fireEvent("init");
  }

  renderUI() {
    nde.renderer._(()=>{
      this.hoverPass();
      this.renderPass();
    });
  }





  fitSizePass() {
    this.fitSizePassHelper(this, 0);
  }
  fitSizePassHelper(element, depth) {
    for (let c of element.children) {
      this.fitSizePassHelper(c, depth + 1);
    }

    element.uiRoot = this;
    element.calculateSize();

    this.depth = Math.max(this.depth, depth);
  }



  growSizePass() {
    this.growChildren();
  }



  positionPass() {
    this.positionChildren();
  }



  hoverPass() {    
    let mousePoint = new DOMPoint(nde.mouse.x, nde.mouse.y);
    let transformedMousePoint = mousePoint.matrixTransform(nde.renderer.getTransform().inverse());

    this.hoverPassHelper(this, false, transformedMousePoint);
  }
  hoverPassHelper(element, found, pt) {
    element.hovered = false;
    element.trueHovered = false;

    let inBounds = (pt.x >= element.pos.x && 
                    pt.x <= element.pos.x + element.size.x && 
                    pt.y >= element.pos.y && 
                    pt.y <= element.pos.y + element.size.y);
    
    element.trueHovered = inBounds;
    element.trueHoveredBottom = inBounds;

    if (
      !found &&
      element.interactable && 
      inBounds) 
    {
      nde.hoveredUIElement = element;

      found = true;
    }

    if (found) {
      element.hovered = true;
    }

    if (element.forceHover) {
      element.hovered = true;
      found = true;
    }

    for (let c of element.children) {
      this.hoverPassHelper(c, found, pt);

      if (c.trueHovered) element.trueHoveredBottom = false;
    }
  }



  renderPass() {
    this.renderPassHelper(this, 0);
  }
  renderPassHelper(element, depth) {
    if (nde.uiDebug) {
      element.debugColor = 255 / (this.depth + 1) * (depth + 1);
    } else element.debugColor = undefined;

    element.render();
    for (let c of element.children) {
      this.renderPassHelper(c, depth + 1);
    }
  }
}