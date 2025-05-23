class Aud extends Asset {
  constructor() {
    super();

    this.duration = undefined;

    this.audio = new Audio();

    this.instances = [];
  }

  restart() {
    this.stop();
    this.play();
  }

  play() {
    if (this.audio.paused) this.audio.play();
    else {
      let audio = new Audio(this.path);
      this.instances.push(audio);
      audio.play();

      audio.onended = () => {
        let index = this.instances.indexOf(audio);
        if (index != -1)
          this.instances.splice(index, 1);
      }
    }
  }
  stop() {    
    this.audio.stop();

    for (let i = 0; i < this.instances.length; i++) {
      this.instances[i].stop();
      this.instances.splice(i, 1);
      i--;
    }
  }
}