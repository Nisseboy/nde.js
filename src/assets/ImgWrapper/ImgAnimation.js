class ImgAnimation extends ImgWrapperBase {
  constructor(texs, timer, loop) {
    super();

    this.texs = texs;
    this.timer = timer;
    this.timer.loop = loop;
  }

  get() {
    let p = Math.floor(this.timer.progress * this.texs.length);
    if (this.timer.progress == 1) p--;
    let t = this.texs[p];
    
    return t;
  }

  start() {
    this.timer.start();
  }
  stop() {
    this.timer.stop();
  }
}