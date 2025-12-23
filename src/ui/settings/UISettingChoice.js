class UISettingChoice extends UISettingBase {
  constructor(props) {
    super(props);
    this.interactable = false;

    this.defaultStyle = {
      direction: "column",
      gap: 10,
    };
    this.fillStyle(props.style); 
    this.style.fill = "rgba(0, 0, 0, 0)";
    this.style.padding = 0;
    
    this.choices = props.choices || ["undefined"];
    this.value = props.value || this.choices[0];

    

    for (let choice of this.choices) {
      let elem = new UIButton({
        style: {...props.style,
          direction: "row",
          align: new Vec(0, 1),
        },

        children: [
          new UIText({
            style: props.style,
            text: choice,
          }),
          new UIBase({
            style: {
              minSize: this.style.minSize._sub((props.style.padding || 0) * 2),
            },
          }),
        ],

        events: {mouseup: [() => {
          this.value = choice;

          this.updateColors();
          
          this.fire("input", this.value);
          this.fire("change", this.value);
        }]},
      });

      this.children.push(elem);
    }

    this.updateColors();
  }

  updateColors() {
    for (let c of this.children) {
      let name = c.children[0].text;
      let col = (name == this.value) ? "rgb(255, 255, 255)" : "rgba(0, 0, 0, 0)";

      c.children[1].style.fill = col;
      c.children[1].style.hover.fill = col;
    }
  }

  setValue(newValue) {
    super.setValue(newValue);

    this.updateColors();
  }
}