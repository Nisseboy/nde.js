class InputManagerReplay extends InputManager {
  constructor(log, playbackDivisions = 1) {
    super();

    this.log = log;
    this.playbackDivisions = playbackDivisions;

    this.frame = 0;
    this.i = 0;
  }

  init() {
    requestAnimationFrame(() => {this.animationFrame()});
  }

  fire(eventName, ...args) {
    
  }

  animationFrame() {
    if (this.frame != -1) requestAnimationFrame(() => {this.animationFrame()});

    this.i++;
    if (this.i % this.playbackDivisions != 0) return;   
    
    while (true) {
      let frame = this.log[this.frame];
      if (!frame) {
        this.frame = -1;
        return;
      }

      nde.fire(...frame);
      this.frame++;

      if (frame[0] == "input_frame") return;
    }
  }
}