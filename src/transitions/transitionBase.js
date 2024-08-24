class TransitionBase {
  constructor(newScene, timer) {
    this.oldImg = new Img(new Vec(w, w / 16 * 9));
    this.newImg = new Img(this.oldImg.size);

    this.timer = timer;

    renderGame();
    renderer.display(this.oldImg);

    setScene(newScene);
    newScene.update(1/60);
    renderGame();
    renderer.display(this.newImg);
  }

  render() {
    renderer.set("fill", 0);
    renderer.rect(new Vec(0, 0), mainImg.size);

    if (this.timer.progress == 1) transition = undefined;
  }
}