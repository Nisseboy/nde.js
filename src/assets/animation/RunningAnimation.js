class RunningAnimation extends Renderable {
  constructor(animation, props = {}) {
    super();

    this.frames = animation.frames;
    this.dt = animation.dt;
    this.duration = animation.duration;
    this.speed = animation.speed;

    this.e = new EventHandler();
    if (props.events) this.e.events = props.events;
    if (props.listeners) this.e.listeners = props.listeners;
    
    this.img = undefined;

    this.timer = new TimerTime(100000000, ()=>{this.step()});
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
        this.fire("done");
        return;
      }

      this.executedTime += frame.duration * this.dt;
      this.executedFrames++;

      frame.step(this);            
    }
  }

  on(...args) {return this.e.on(...args)}
  off(...args) {return this.e.off(...args)}
  fire(...args) {return this.e.fire(...args)}


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