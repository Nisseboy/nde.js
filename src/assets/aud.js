class Aud extends Asset {
  constructor(props = {}) {
    super();

    this.duration = undefined;
    this.baseGain = props.baseGain || 1;

    this.queueNodes();

    this.audioBuffer = undefined;
    this.currentSource = undefined;

    this.isPlaying = false;
  }

  load({path, name, gain = 1}) {
    return new Promise((resolve) => {
      this.baseGain = gain;
      
      fetch(path).then(res => {
        res.arrayBuffer().then(arrayBuffer => {
          audioContext.decodeAudioData(arrayBuffer).then(audioBuffer => {                    
            this.audioBuffer = audioBuffer;
            this.duration = audioBuffer.duration;

            resolve(this);
          });
        });
      }).catch(e => {
        console.error(`"${path}" not found`);

        resolve(this);
      });

      
      if (!nde.aud) nde.aud = {};
      nde.aud[name] = new AudPool(this);
    });
  }

  queueNodes() {
    if (audioContext.state != "suspended") {
      this.createNodes();
      return;
    } else {
      
      nde.on("audioContextStarted", () => {
        this.createNodes();
      });
    }
  }

  createNodes() {
    this.panner = audioContext.createPanner();
    this.panner.panningModel = 'HRTF';
    this.panner.distanceModel = 'inverse';
    this.panner.rolloffFactor = 1;
    this.panner.positionX.value = 0;
    this.panner.positionY.value = 1;
    this.panner.positionZ.value = 0;

    this.gainNode = audioContext.createGain();
    this.gainNode.gain.value = this.baseGain;
  }

  copy() {
    const newAud = new Aud();
    newAud.path = this.path;
    newAud.audioBuffer = this.audioBuffer;
    newAud.baseGain = this.baseGain;
    newAud.gain = this.gain;
    return newAud;
  }

  setPosition(x, y, z) {
    if (!this.panner) return;

    this.panner.positionX.value = x;
    this.panner.positionY.value = y;
    this.panner.positionZ.value = z;
  }

  set gain(value) {
    if (!this.gainNode) return;
    this.gainNode.gain.value = this.baseGain * value;    
  }
  get gain() {
    if (!this.gainNode) return 1;
    return this.gainNode.gain.value / this.baseGain;    
  }

  play() {
    if (!this.audioBuffer || !this.panner) return;
    
    const source = audioContext.createBufferSource();
    source.buffer = this.audioBuffer;

    source.connect(this.panner);
    this.panner.connect(this.gainNode);
    this.gainNode.connect(audioContext.destination);

    source.start(0);
    this.currentSource = source;
    this.isPlaying = true;
    source.onended = () => {this.isPlaying = false; this.currentSource = null;}
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