class RunningAnimation extends Renderable {
  constructor(animation, props = {}) {
    super();

    this.frames = animation.frames;
    this.dt = animation.dt;
    this.duration = animation.duration;
    this.speed = animation.speed;

    this.events = props.events || {}
    
    this.img = undefined;

    this.timer = new TimerTime(this.duration, ()=>{this.step()});
    this.lastTimerElapsedTime = 0;
    this.elapsedTime = 0;
    this.executedFrames = 0;
    this.executedTime = 0;
    
    this.step();
  }

  step() {    
    this.elapsedTime += (this.timer.elapsedTime - this.lastTimerElapsedTime) * this.speed;
    this.lastTimerElapsedTime = this.timer.elapsedTime;

    while (this.executedTime <= this.elapsedTime) {
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
    this.lastTimerElapsedTime = 0;
    this.elapsedTime = 0;
    this.executedFrames = 0;
    this.executedTime = 0;
    this.step();
  }
}