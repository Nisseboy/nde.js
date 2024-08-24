class TimerTime extends TimerBase {
  constructor(seconds, callback) {
    super(callback);

    this.lengthTime = seconds;
  }

  tick(dt) {
    super.tick(dt);

    this.progress = Math.min(this.elapsedTime / this.lengthTime, 1);

    this.callback(this);

    if (this.progress >= 1) {
      this.stop();
    }
  }
}