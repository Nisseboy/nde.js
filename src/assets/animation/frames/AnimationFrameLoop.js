class AnimationFrameLoop extends AnimationFrameBase {
  constructor() {
    super();
  }

  step(runningAnimation) {
    runningAnimation.restart();
  }
}