class UIButtonImage extends UIButton {
  constructor(props) {
    super(props);

    this.children = [new UIImage({
      image: props.image,
      style: props.imageStyle,
    })];
  }
}