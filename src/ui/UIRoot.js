class UIRoot extends UIBase {
  constructor(props) {
    super(props);

    this.defaultStyle = {
      direction: "column"
    };

    this.fillStyle(props.style);

    if (props.pos) this.pos.from(props.pos);

    this.initUI();

    this.renderLast = [];
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

    document.body.style.cursor = "auto";

    this.renderLast.length = 0;
    this.hoverPassHelper(this, false, transformedMousePoint);

    for (let elem of this.renderLast) {
      this.hoverPassHelper(elem[0], elem[1], transformedMousePoint, true);
    }
  }
  hoverPassHelper(element, found, pt, ignoreRenderLast = false) {
    if (element.style.render == "last" && !ignoreRenderLast) {
      this.renderLast.push([element, found]);
      return;
    }
    if (element.style.render == "hidden") return;
    
    element.hovered = false;
    element.trueHovered = false;

    let inBounds = (pt.x >= element.pos.x && 
                    pt.x <= element.pos.x + element.size.x && 
                    pt.y >= element.pos.y && 
                    pt.y <= element.pos.y + element.size.y);
    
    element.trueHovered = inBounds;
    element.trueHoveredBottom = inBounds;

    if (
      element.interactable && 
      inBounds) 
    {
      nde.hoveredUIElement = element;
      document.body.style.cursor = element.style.cursor;

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
    this.renderLast.length = 0;
    this.renderPassHelper(this, 0);

    for (let elem of this.renderLast) {
      this.renderPassHelper(elem[0], elem[1], true);
    }
  }
  renderPassHelper(element, depth, ignoreRenderLast = false) {
    if (element.style.render == "last" && !ignoreRenderLast) {
      this.renderLast.push([element, depth]);
      return;
    }
    if (element.style.render == "hidden") return;

    if (nde.uiDebug) {
      element.debugColor = 255 / (this.depth + 1) * (depth + 1);
    } else element.debugColor = undefined;

    element.render();
    for (let c of element.children) {
      this.renderPassHelper(c, depth + 1);
    }
  }
}