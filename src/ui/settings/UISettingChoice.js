class UISettingChoice extends UISettingBase {
  constructor(props) {
    super(props);
    this.interactable = false;

    this.defaultStyle = {
      direction: "column",
    };
    this.fillStyle(props.style); 
    
    this.choices = props.choices || ["undefined"];
    this.value = props.value || this.choices[0];

    for (let choice of this.choices) {
      let elem = new UIButton({
        style: {...this.style,
          direction: "row",
          align: new Vec(0, 1),
        },

        children: [
          new UIText({
            style: this.style,
            text: choice,
          }),
          new UIBase({
            style: {
              minSize: this.style.minSize._sub(this.style.padding * 2),
            },
          }),
        ],

        events: {mouseup: [() => {
          this.value = choice;

          this.updateColors();
          
          this.fireEvent("change", this.value);
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
}