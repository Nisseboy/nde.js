class TransitionBase {
  constructor(newScene, timer) {
    this.oldImg = new Img(new Vec(nde.w, nde.w / 16 * 9));
    this.newImg = new Img(this.oldImg.size);

    this.timer = timer;

    nde.fireEvent("render");
    renderer.display(this.oldImg);

    nde.setScene(newScene);
    newScene.update(1/60);
    nde.fireEvent("render");
    renderer.display(this.newImg);
  }

  render() {
    renderer.set("fill", 0);
    renderer.rect(new Vec(0, 0), nde.mainImg.size);

    if (this.timer.progress == 1) nde.transition = undefined;
  }
}