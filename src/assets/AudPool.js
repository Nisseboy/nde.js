class AudPool {
  constructor(aud) {
    this.aud = aud;

    this.auds = [];
  }

  get() {
    for (let i = 0; i < this.auds.length; i++) {
      let aud = this.auds[i];

      if (aud.isPlaying) continue;

      return aud;
    }
    
    let aud = this.getNew();
    this.auds.push(aud);
    return aud;
  }
  getNew() {
    return this.aud.copy();
  }
}