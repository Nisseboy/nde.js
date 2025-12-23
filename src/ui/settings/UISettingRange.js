class UISettingRange extends UISettingBase {
  constructor(props) {
    super(props);

    this.defaultStyle = {
      gap: 10,

      slider: {
        padding: 5,
        minSize: new Vec(300, 30),

        fill: "rgb(0, 0, 0)",
  
        active: {
          fill: "rgb(255, 255, 255)",
        },
      },

      number: {
        fill: "rgb(0, 0, 0)",
      },
    };
    this.fillStyle(props.style);
    this.style.fill = "rgba(0, 0, 0, 0)";
    this.style.hover.fill = "rgba(0, 0, 0, 0)";
    

    this.min = props.min;
    this.max = props.max;
    this.step = props.step || 1;


    this.initChildren();

    this.rangeSizeTotal = new Vec(0, 0);
    this.setValue(this.value);
    

    this.rendererTransform = undefined;

    this.funcA = e=>this.mousemove(e);
    this.funcB = e=>this.mouseup(e);

    this.on("mousedown", e=>{
      this.forceHover = true;

      this.mousemove(e);

      nde.on("mousemove", this.funcA);
      nde.on("mouseup", this.funcB);
    });
  }


  initChildren() {
    let numberSize = new Vec(0, 0);
    nde.renderer._(()=>{
      nde.renderer.setAll(this.style.number.text);
      numberSize.y = Math.max(nde.renderer.measureText(this.max).y, this.style.minSize.y);
      numberSize.x = Math.max(nde.renderer.measureText(this.max).x, this.style.minSize.x);
    });

    let sliderSize = new Vec(this.style.slider.minSize.x - numberSize.x - this.style.gap, this.style.slider.minSize.y);
    
    this.slider = new UIBase({
      style: {...this.style.slider.active,
        hover: this.style.hover.slider.active,
      },
    });
    this.range = new UIBase({
      style: {...this.style.slider,
        hover: this.style.hover.slider,
        minSize: sliderSize,
      },

      children: [this.slider],
    });
    this.number = new UISettingText({
      style: {...this.style.number,
        hover: this.style.hover.number,
        text: this.style.text,
        size: numberSize,
        editor: {
          numberOnly: true,
        },
      },

      value: 0,

      events: {change: [value => {
        this.setValue(value);
        this.fireInput();
        this.fireChange();
      }]},
    });

    this.children = [this.range, this.number];
  }



  calculateSize() {
    super.calculateSize();

    this.rangeSizeTotal.from(this.range.size).sub(this.range.style.padding * 2);

    this.sizeSlider();
  }

  mousemove(e) {
    let mousePoint = new DOMPoint(nde.mouse.x, nde.mouse.y);
    let transformedMousePoint = mousePoint.matrixTransform(this.rendererTransform.inverse());
    
    let progress = Math.min(Math.max((transformedMousePoint.x - this.pos.x - this.style.padding) / this.rangeSizeTotal.x, 0), 1); 

    this.setValue(progress * (this.max - this.min) + this.min);
    this.fireInput();
  }

  mouseup(e) {
    this.forceHover = false;

    nde.off("mousemove", this.funcA);
    nde.off("mouseup", this.funcB);

    this.fireChange();
  }

  setValue(newValue) {
    super.setValue(Math.round(newValue / this.step) * this.step);

    this.sizeSlider();
    
    this.number.setValue(this.value);
    
  }

  sizeSlider() {
    this.slider.size.x = (this.value - this.min) / (this.max - this.min) * this.rangeSizeTotal.x;
    this.slider.size.y = this.rangeSizeTotal.y;
  }

  render() {    
    super.render();
    
    this.rendererTransform = nde.renderer.getTransform();
  }
}