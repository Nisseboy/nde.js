class AudPool {
  constructor(aud) {
    this.aud = aud;

    this.auds = [];
  }

  get() {
    for (let i = 0; i < this.auds.length; i++) {
      if (this.auds[i].isPlaying) continue;

      return this.auds[i];
    }
    
    let aud = this.getNew();
    this.auds.push(aud);
    return aud;
  }
  getNew() {
    return this.aud.copy();
  }
}


function moveListener(pos) {
  if (audioContext.listener.positionX != undefined) {
    audioContext.listener.positionX.value = pos.x;
    audioContext.listener.positionY.value = 0;
    audioContext.listener.positionZ.value = pos.y;
  } else {
    audioContext.listener.setPosition(pos.x, 0, pos.y);
  }
}
function playAudio(audPool, pos) {
  let aud = audPool.get();
  aud.setPosition(pos.x, 1, pos.y);
  aud.gain = 1;
  aud.play();  
  return aud;
}