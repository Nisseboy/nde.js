class AudioSource extends Component {
  constructor(props = {}) {
    super();

    this._gain = undefined;
    this.playing = [];

    this.gain = props.gain != undefined ? props.gain : 1;
  }

  set gain(value) {
    this._gain = value;
    for (let i = 0; i < this.playing.length; i++) {
      this.playing[i].gain = value;
    }
  }
  get gain() {
    return this._gain;
  }


  start() {
    this.ob.audioSource = this;

    this.lastPos = this.transform.pos.copy();
  }


  update() {
    let hasMoved = !this.transform.pos.isEqualTo(this.lastPos);
    this.lastPos.from(this.transform.pos);

    for (let i = 0; i < this.playing.length; i++) {
      let aud = this.playing[i];
      if (!aud.isPlaying) {
        this.playing.splice(i, 1);
        i--;
        continue;
      }

      if (hasMoved) {
        aud.setPosition(this.transform.pos.x, 1, this.transform.pos.y);
      }
    }

  }


  play(audPool) {
    let aud = playAudio(audPool, this.transform.pos);
    aud.gain = this.gain;
    this.playing.push(aud);
  }

  from(data) {
    super.from(data);

    this.gain = data._gain;

    return this;
  }

  strip() {
    delete this.ob.audioSource;

    super.strip();
  }
}