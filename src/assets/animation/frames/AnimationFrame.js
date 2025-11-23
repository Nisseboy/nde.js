class AnimationFrame extends AnimationFrameBase {
  constructor(img) {
    super();
    this.duration = 1;

    this.img = img;
  }

  step(runningAnimation) {
    runningAnimation.img = this.img;
  }
}