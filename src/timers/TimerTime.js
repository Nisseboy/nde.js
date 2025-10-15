class TimerTime extends TimerBase {
  constructor(seconds, callback) {
    super(callback);

    this.lengthTime = seconds;
  }

  calculateProgress() {
    this.progress = Math.min(this.elapsedTime / this.lengthTime, 1);
    return this.progress;
  }
}