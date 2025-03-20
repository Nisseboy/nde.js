class UIButtonText extends UIButton {
  constructor(props) {
    super(props);

    this.children = [new UIText({
      text: props.text,
      style: props.textStyle,
    })];
  }
}