class Animation {
  constructor(frames, dt) {
    this.frames = frames;
    this.dt = dt;

    this.duration = 0;
    for (let f of this.frames) this.duration += f.duration;
    this.duration *= dt;
  }

  start() {
    return new RunningAnimation(this);
  }
}