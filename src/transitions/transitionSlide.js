class TransitionSlide extends TransitionBase {
  constructor(newScene, timer) {
    super(newScene, timer);
  }

  render() {
    super.render();

    let a = this.oldImg.size.x * this.timer.progress;
    let b = this.oldImg.size.x * (1 - this.timer.progress);

    let ctx = nde.renderer.ctx;
    
    nde.renderer._(()=>{
      ctx.beginPath();
      ctx.rect(0, 0, a, this.oldImg.size.y);
      ctx.clip();
      nde.renderer.image(this.newImg, new Vec(0, 0), this.oldImg.size);
    });
    nde.renderer._(()=>{
      ctx.beginPath();
      ctx.rect(a, 0, b, this.oldImg.size.y);
      ctx.clip();
      nde.renderer.image(this.oldImg, new Vec(0, 0), this.oldImg.size);
    });
  }
}