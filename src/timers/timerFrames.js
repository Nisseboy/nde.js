class TimerFrames extends TimerBase {
  constructor(frames, callback) {
    super(callback);

    this.lengthFrames = frames;
  }

  calculateProgress() {
    this.progress = Math.min(this.elapsedFrames / this.lengthFrames, 1);
    return this.progress;
  }
}