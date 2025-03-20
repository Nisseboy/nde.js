class UISettingRange extends UISettingBase {
  constructor(props) {
    super(props);

    this.defaultStyle = {
      gap: 10,

      slider: {
        padding: 10,
        minSize: new Vec(300, 50),

        fill: "rgb(0, 0, 0)",
        stroke: "rgb(0, 0, 0)",
  
        active: {
          fill: "rgb(255, 255, 255)",
          stroke: "rgb(255, 255, 255)",
        },
      },

      number: {
        minSize: new Vec(80, 50),
        align: new Vec(2, 1),

        fill: "rgb(0, 0, 0)",
        stroke: "rgb(0, 0, 0)",
        
        text: {
          fill: "rgb(255, 255, 255)",
          font: "40px monospace",
          textAlign: ["right", "middle"],
        },
      },
    };
    this.fillStyle(props.style);
    this.style.padding = 0;


    this.slider = new UIBase({
      style: {...this.style.slider.active,
        hover: this.style.hover.slider.active,
      },
    });
    this.range = new UIBase({
      style: {...this.style.slider,
        hover: this.style.hover.slider,
      },

      children: [this.slider],
    });
    this.numberText = new UIText({
      text: "",

      style: {text: {...this.style.number.text,
        hover: this.style.hover.number.text,
      }},
    });
    this.number = new UIBase({
      style: {...this.style.number,
        hover: this.style.hover.number,
      },

      children: [this.numberText],
    });

    this.children = [this.range, this.number];

    this.rangeSizeTotal = new Vec(0, 0);

    this.min = props.min;
    this.max = props.max;
    this.step = props.step || 1;

    this.rendererTransform = undefined;

    this.funcA = e=>this.mousemove(e);
    this.funcB = e=>this.mouseup(e);

    this.registerEvent("mousedown", e=>{
      this.forceHover = true;

      this.mousemove(e);

      nde.registerEvent("mousemove", this.funcA);
      nde.registerEvent("mouseup", this.funcB);
    });
    
    this.setValue(props.value);
  }

  calculateSize() {
    this.numberText.size.set(0, 0);

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

    nde.unregisterEvent("mousemove", this.funcA);
    nde.unregisterEvent("mouseup", this.funcB);

    this.fireChange();
  }

  setValue(newValue) {
    super.setValue(Math.round(newValue / this.step) * this.step);

    this.sizeSlider();
    this.numberText.text = this.value;
  }

  sizeSlider() {
    this.slider.size.x = (this.value - this.min) / (this.max - this.min) * this.rangeSizeTotal.x;
    this.slider.size.y = this.rangeSizeTotal.y;
  }

  render() {
    //super.render();

    this.rendererTransform = renderer.getTransform();
  }
}