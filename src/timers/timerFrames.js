class TimerFrames extends TimerBase {
  constructor(frames, callback) {
    super(callback);

    this.lengthFrames = frames;
  }

  tick(dt) {
    super.tick(dt);

    this.progress = Math.min(this.elapsedFrames / this.lengthFrames, 1);

    this.callback(this);

    if (this.progress >= 1) {
      this.stop();
    }
  }
}