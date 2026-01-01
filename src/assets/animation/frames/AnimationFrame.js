class AnimationFrame extends AnimationFrameBase {
  constructor(tex) {
    super();
    this.duration = 1;

    this.img = nde.tex[tex];
  }

  step(runningAnimation) {
    runningAnimation.img = this.img;
  }
}