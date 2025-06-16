const audioContext = new (window.AudioContext || window.webkitAudioContext)();

class Aud extends Asset {
  constructor() {
    super();

    this.duration = undefined;

    this.panner = audioContext.createPanner();
    this.panner.panningModel = 'HRTF';
    this.panner.distanceModel = 'inverse';
    this.panner.positionX.value = 0;
    this.panner.positionY.value = 0;
    this.panner.positionZ.value = 1;

    this.audioBuffer = undefined;
    this.currentSource = undefined;
  }

  setPosition(pos) {
    this.panner.positionX.value = pos.x == undefined ? 0 : pos.x;
    this.panner.positionY.value = pos.y == undefined ? 0 : pos.y;
    this.panner.positionZ.value = pos.z == undefined ? 1 : pos.z;
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
  }
  stop() {    
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