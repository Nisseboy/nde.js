const audioContext = new (window.AudioContext || window.webkitAudioContext)();

class Aud extends Asset {
  constructor() {
    super();

    this.duration = undefined;

    this.panner = audioContext.createPanner();
    this.panner.panningModel = 'HRTF';
    this.panner.distanceModel = 'inverse';
    this.panner.positionX.value = 0;
    this.panner.positionY.value = 1;
    this.panner.positionZ.value = 0;
    this.position = new Vec(0, 1, 0);

    this.audioBuffer = undefined;
    this.currentSource = undefined;

    this.isPlaying = false;
  }

  copy() {
    const newAud = new Aud();
    newAud.path = this.path;
    newAud.audioBuffer = this.audioBuffer;
    newAud.setPosition(this.position);
    return newAud;
  }

  setPosition(xorpos, y, z) {
    if (xorpos.x != undefined) this.position.from(xorpos);
    else this.position.set(xorpos, y, z);
    
    this.panner.positionX.value = this.position.x;
    this.panner.positionY.value = this.position.y;
    this.panner.positionZ.value = this.position.z;
  }

  play() {
    if (!this.audioBuffer) {
      console.warn('Audio not loaded yet.');
      return;
    }
    
    const source = audioContext.createBufferSource();
    source.buffer = this.audioBuffer;
    source.connect(this.panner);
    this.panner.connect(audioContext.destination);
    source.start(0);
    this.currentSource = source;
    this.isPlaying = true;
    source.onended = () => {this.isPlaying = false;}
  }
  stop() {    
    this.isPlaying = false;
    if (this.currentSource) {
      try {
        this.currentSource.stop();
      } catch (e) {
          // Already stopped
      }
      this.currentSource.disconnect();
      this.currentSource = null;
    }
  }
}