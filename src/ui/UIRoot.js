class UIRoot extends UIBase {
  constructor(props) {
    super(props);

    this.defaultStyle = {
      direction: "column"
    };

    this.fillStyle(props.style);

    if (props.pos) this.pos.from(props.pos);

    this.initUI();

    this.deepestScrollable = undefined;
    this.deepestScrollableDepth = 0;
    this.renderLast = [];

    nde.registerEvent("wheel", (e) => {this.wheel(e)});
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
      c.parent = element;

      this.fitSizePassHelper(c, depth + 1);
    }

    element.uiRoot = this;
    element.constrainScroll();
    element.calculateSize();

    this.depth = Math.max(this.depth, depth);
  }

  growSizePass() {
    this.growChildren();
  }

  positionPass() {
    this.positionChildren();
  }



  wheel(e) {
    if (!this.deepestScrollable) return;
    
    let delta = e.deltaY * 0.5;

    if (e.shiftKey) this.deepestScrollable.scroll.x += delta;
    else this.deepestScrollable.scroll.y += delta;

    this.deepestScrollable.constrainScroll();

    this.deepestScrollable.positionChildren();

    return false;
  }



  hoverPass() {    
    let mousePoint = new DOMPoint(nde.mouse.x, nde.mouse.y);
    let transformedMousePoint = mousePoint.matrixTransform(nde.renderer.getTransform().inverse());

    document.body.style.cursor = "auto";

    this.renderLast.length = 0;
    this.deepestScrollable = undefined;
    this.hoverPassHelper(this, false, false, transformedMousePoint);

    for (let elem of this.renderLast) {
      this.hoverPassHelper(elem[0], elem[1], elem[2], transformedMousePoint, true);
    }
  }
  hoverPassHelper(element, found, ignoreHover, pt, ignoreRenderLast = false) {
    if (element.style.render == "last" && !ignoreRenderLast) {
      this.renderLast.push([element, found, ignoreHover]);
      return;
    }
    if (element.style.render == "hidden") return;
    

    element.hovered = false;
    element.trueHovered = false;
    element.trueHoveredBottom = false;

    let clip = (element.style.maxSize.x != Infinity || element.style.maxSize.y != Infinity);
    let scrollable = clip && ((element.style.scroll.x && element.contentSize.x > element.size.x - element.style.padding * 2) || (element.style.scroll.y && element.contentSize.y > element.size.y - element.style.padding * 2));

    if (ignoreHover || (clip && 
      (pt.x < element.pos.x || 
      pt.x > element.pos.x + element.size.x || 
      pt.y < element.pos.y || 
      pt.y > element.pos.y + element.size.y))) {

      found = false;
      ignoreHover = true;
    } else {
      let inBounds = (pt.x >= element.pos.x && 
                    pt.x <= element.pos.x + element.size.x && 
                    pt.y >= element.pos.y && 
                    pt.y <= element.pos.y + element.size.y);
    
      element.trueHovered = inBounds;
      element.trueHoveredBottom = inBounds;
      
      if (inBounds) {
        if (element.interactable) {
          nde.hoveredUIElement = element;
          document.body.style.cursor = element.style.cursor;

          found = true;
        }

        if (scrollable) {
          this.deepestScrollable = element;          
        }
      }
      

      if (found) {
        element.hovered = true;
      }

      if (element.forceHover) {
        element.hovered = true;
        found = true;
      }
    }
    

    


    for (let c of element.children) {
      this.hoverPassHelper(c, found, ignoreHover, pt);

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

    let clip = (element.style.maxSize.x != Infinity || element.style.maxSize.y != Infinity);
    if (clip) {
      nde.renderer.clipRect(element.pos._add(element.style.padding), element.size._sub(element.style.padding * 2), () => {
        for (let c of element.children) {
          this.renderPassHelper(c, depth + 1);
        }
        
      });
      if (this.deepestScrollable == element || element.style.scroll.alwaysShow) element.renderScrollbars();
    } else {
      for (let c of element.children) {
        this.renderPassHelper(c, depth + 1);
      }
    }
  }
}