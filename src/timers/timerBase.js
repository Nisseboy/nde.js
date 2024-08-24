class TimerBase {
  constructor(callback = (timer) => {}) {
    this.elapsedFrames = 0;
    this.elapsedTime = 0;
    this.progress = 0;

    this.callback = callback;

    timers.push(this);
  }

  tick(dt) {
    this.elapsedFrames++; 
    this.elapsedTime += dt;
  }
  
  stop() {
    let index = timers.indexOf(this);
    if (index != -1) timers.splice(index, 1);
  }

  reset() {
    this.elapsedFrames = 0;
    this.elapsedTime = 0;
    this.progress = 0;

    let index = timers.indexOf(this);
    if (index != -1) timers.splice(index, 1);

    timers.push(this);
  }
}