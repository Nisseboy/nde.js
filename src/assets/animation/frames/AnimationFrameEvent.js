class AnimationFrameEvent extends AnimationFrameBase {
  constructor(eventName, ...eventArgs) {
    super();

    this.eventName = eventName;
    this.eventArgs = eventArgs;
  }

  step(runningAnimation) {
    runningAnimation.fireEvent(this.eventName, ...this.eventArgs);
  }
}