class TimerBase {
  constructor(callback = (timer) => {}) {
    this.elapsedFrames = 0;
    this.elapsedTime = 0;
    this.progress = 0;

    this.playing = false;
    this.loop = false;

    this.callback = callback;

    this.start();
  }

  calculateProgress() {}

  tick(dt) {
    this.elapsedFrames++; 
    this.elapsedTime += dt;
    
    this.calculateProgress();

    this.callback(dt);

    if (this.progress == 1 && this.playing) {
      this.stop();

      if (!this.loop) return

      if (this.lengthFrames) this.elapsedFrames -= this.lengthFrames; else this.elapsedFrames = 0;
      if (this.lengthTime) this.elapsedTime -= this.lengthTime; else this.elapsedTime = 0;
      this.progress = this.calculateProgress();
      this.start();
    }
  }
  
  stop() {
    let index = nde.timers.indexOf(this);
    if (index != -1) nde.timers.splice(index, 1);
    this.playing = false;
  }
  start() {
    nde.timers.push(this);
    this.playing = true;
  }

  reset() {
    this.elapsedFrames = 0;
    this.elapsedTime = 0;
    this.progress = 0;

    this.stop();
    this.start();
  }
}