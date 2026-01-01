class Animation extends EvalAsset {
  constructor(frames = [], dt = 0.1) {
    super();

    this.frames = frames;
    this.dt = dt;
    this.speed = 1;

    this.duration = 0;
    for (let f of this.frames) this.duration += f.duration;
    this.duration *= dt;
  }

  start(props = {}) {
    return new RunningAnimation(this, props);
  }

  eval() {
    let ob = eval("let frame = AnimationFrame, loop = AnimationFrameLoop, event = AnimationFrameEvent;" + this.data);
    if (!nde.tex) nde.tex = {};
    nde.tex[this.name] = ob;
    return ob;
  }
}