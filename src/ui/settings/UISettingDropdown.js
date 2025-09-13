class UISettingDropdown extends UISettingBase {
  constructor(props) {
    super(props);
    this.interactable = false;

    this.defaultStyle = {
      gap: 0,
    };
    this.fillStyle(props.style); 
    
    this.choices = props.choices || ["undefined"];
    this.value = props.value || this.choices[0];

    let oldMaxSize = this.style.maxSize;
    this.style.maxSize = new Vec(Infinity, Infinity);

    this.children = [
      new UIButton({
        style: {...this.style,
          growX: true,
          growY: true,
        },
        children: [
          new UIText({
            style: {...this.style},
            text: this.value,
          }),
          new UIText({
            style: {...this.style,
              minSize: this.style.minSize._sub((this.style.padding || 0) * 2),
            },

            text: "\u23F7",
          }),
        ],

        events: {mouseup: [() => {
          this.switchOpen();
        }]}
      }),
      new UIBase({
        style: {
          position: "relative",
          render: "hidden",
        },

        children: [
          new UIBase({
            style: {
              scroll: {...this.style.scroll,
                width: this.style.padding / 2,
              },
              direction: "column",
              gap: this.style.gap,
              maxSize: oldMaxSize,
            },
          }),
        ],
      }),
    ];
    this.container = this.children[1].children[0];

    let size = new Vec(0, 0);
    for (let choice of this.choices) {
      let elem = new UIButton({
        style: {...this.style,
          direction: "row",
          align: new Vec(0, 1),
          growX: true,
        },

        children: [
          new UIText({
            style: this.style,
            text: choice,
          }),
          new UIBase({
            style: {
              minSize: this.style.minSize._sub((props.style.padding || 0) * 2),
            },
          }),
        ],

        events: {mouseup: [() => {
          this.setValue(choice);

          this.switchOpen();
          
          this.fireEvent("input", this.value);
          this.fireEvent("change", this.value);
        }]},
      });

      this.container.children.push(elem);

      for (let c of elem.children) c.calculateSize();
      elem.calculateSize();

      size.x = Math.max(size.x, elem.size.x);
      size.y = Math.max(size.y, elem.size.y);
    }
    this.style.minSize.x = Math.max(this.style.minSize.x, size.x);
    this.style.minSize.y = Math.max(this.style.minSize.y, size.y);

    
    this.style.fill = "rgba(0, 0, 0, 0)";
    this.style.padding = 0;

    this.updateColors();
  }

  switchOpen() {
    if (this.children[0].style.render == "hidden") {
      this.children[0].style.render = "normal";
      this.children[1].style.render = "hidden";
    } else {
      this.children[0].style.render = "hidden";
      this.children[1].style.render = "last";
    }
  }
  updateColors() {
    let dropdown = this.children[1].children[0];
    for (let c of dropdown.children) {
      let name = c.children[0].text;
      let col = (name == this.value) ? "rgb(255, 255, 255)" : "rgba(0, 0, 0, 0)";

      c.children[1].style.fill = col;
      c.children[1].style.hover.fill = col;
    }
  }

  setValue(newValue) {
    super.setValue(newValue);

    this.updateColors();
    this.children[0].children[0].text = this.value;
    if (this.uiRoot) this.uiRoot.initUI();
  }
}

