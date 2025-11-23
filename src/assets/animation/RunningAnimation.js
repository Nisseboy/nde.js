class RunningAnimation extends Renderable {
  constructor(animation) {
    super();

    this.frames = animation.frames;
    this.dt = animation.dt;
    this.duration = animation.duration;

    this.img = undefined;

    this.events = {};

    this.timer = new TimerTime(this.duration, ()=>{this.step()});
    this.executedFrames = 0;
    this.executedTime = 0;
    this.step();
  }

  step() {    
    while (this.executedTime <= this.timer.elapsedTime) {
      let frame = this.frames[this.executedFrames];
      if (!frame) {
        this.fireEvent("done");
        return;
      }

      this.executedTime += frame.duration * this.dt;
      this.executedFrames++;

      frame.step(this);
    }
  }

  registerEvent(eventName, func) {
    if (!this.events[eventName]) this.events[eventName] = [];
    this.events[eventName].push(func);
  }
  unregisterEvent(eventName, func) {
    let events = this.events[eventName];
    if (!events) return false;

    let index = events.indexOf(func);
    if (index == -1) return false;

    events.splice(index, 1);
    return;
  }
  fireEvent(eventName, ...args) {
    let events = this.events[eventName];
    if (events) {
      for (let e of events) {
        if (e(...args) == false) return false;
      }
    }

    if (eventName != "*") this.fireEvent("*", eventName, ...args);
      
    return true;
  }


  getImg() {    
    return this.img;
  }

  start() {
    this.timer.start();
  }
  stop() {
    this.timer.stop();
  }

  restart() {
    this.timer.reset();
    this.executedFrames = 0;
    this.executedTime = 0;
    this.step();
  }
}