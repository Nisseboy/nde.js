class TransitionFade extends TransitionBase {
  constructor(newScene, timer) {
    super(newScene, timer);
  }

  render() {
    super.render();
    
    renderer.save();

    renderer.set("filter", `opacity(${(1-this.timer.progress) * 100}%)`);
    renderer.image(this.oldImg, new Vec(0, 0), this.oldImg.size);
    renderer.set("filter", `opacity(${this.timer.progress * 100}%)`);
    renderer.image(this.newImg, new Vec(0, 0), this.newImg.size);
    
    renderer.restore();
  }
}