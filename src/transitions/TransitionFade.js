class TransitionFade extends TransitionBase {
  constructor(newScene, timer) {
    super(newScene, timer);
  }

  render() {
    super.render();
    
    nde.renderer._(()=>{
      nde.renderer.set("filter", `opacity(${(1-this.timer.progress) * 100}%)`);
      nde.renderer.image(this.oldImg, new Vec(0, 0), this.oldImg.size);
      nde.renderer.set("filter", `opacity(${this.timer.progress * 100}%)`);
      nde.renderer.image(this.newImg, new Vec(0, 0), this.newImg.size);
    });
  }
}