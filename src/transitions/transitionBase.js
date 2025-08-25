class TransitionBase {
  constructor(newScene, timer) {
    this.oldImg = new Img(new Vec(nde.w, nde.w / 16 * 9));
    this.newImg = new Img(this.oldImg.size);

    this.timer = timer;

    nde.fireEvent("render");
    this.oldImg.ctx.imageSmoothingEnabled = false;
    this.oldImg.image(nde.renderer, vecZero, this.oldImg.size);

    nde.setScene(newScene);
    newScene.update(1/60);
    nde.fireEvent("render");
    this.newImg.ctx.imageSmoothingEnabled = false;
    this.newImg.image(nde.renderer, vecZero, this.newImg.size);
  }

  render() {
    nde.renderer.set("fill", 0);
    nde.renderer.rect(new Vec(0, 0), nde.mainImg.size);

    if (this.timer.progress == 1) nde.transition = undefined;
  }
}