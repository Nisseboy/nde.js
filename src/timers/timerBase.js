class TimerBase {
  constructor(callback = (timer) => {}) {
    this.elapsedFrames = 0;
    this.elapsedTime = 0;
    this.progress = 0;

    this.callback = callback;

    nde.timers.push(this);
  }

  tick(dt) {
    this.elapsedFrames++; 
    this.elapsedTime += dt;
  }
  
  stop() {
    let index = nde.timers.indexOf(this);
    if (index != -1) nde.timers.splice(index, 1);
  }

  reset() {
    this.elapsedFrames = 0;
    this.elapsedTime = 0;
    this.progress = 0;

    let index = nde.timers.indexOf(this);
    if (index != -1) nde.timers.splice(index, 1);

    nde.timers.push(this);
  }
}