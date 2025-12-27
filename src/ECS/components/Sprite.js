class Sprite extends Component {
  constructor(texOrTexture) {
    super();

    this._tex = texOrTexture;

    this.texture = undefined;    

    //For animations/state machines
    this.animation = undefined;
    this._speed = 1;
    this.stateMachineImg = undefined;
  }

  set tex(value) {
    this._tex = value;
    
    this.texture = undefined;
    this.animation = undefined;
    this.stateMachineImg = undefined;
  }
  get tex() {
    return this._tex;
  }
  set speed(value) {
    if (this.stateMachineImg) {
      this.stateMachineImg.speed = value;

    } else if (this.texture instanceof RunningAnimation) {
      this.texture.speed = value;      
      
    }

    this._speed = value;
  }
  get speed() {
    return this._speed;
  }

  start() {
    this.ob.sprite = this;
  }

  render() {
    if (!this.tex) return;
    
    if (!this.texture) {
      this.tex = nde.getTex(this.tex);
      let texture = nde.tex[this.tex];

      if (texture instanceof Animation) {
        this.animation = texture;
        this.texture = this.animation.start({listeners: [this.e]});
        this.texture.speed *= this.speed;        

      } else if (texture instanceof RunningAnimation) {
        this.texture = texture;
        this.texture.speed *= this.speed;        
        this.texture.e.listeners.push(this.ob.e);

      } else if (texture instanceof StateMachineImg) {
        this.stateMachineImg = texture;
        this.stateMachineImg.speed = this.speed;
        this.stateMachineImg.e.listeners.push(this.ob.e);

      } else {
        this.texture = texture;
      }
    }

    if (this.stateMachineImg) {
      this.texture = this.stateMachineImg.choose();
    }

    nde.renderer._(() => {
      nde.renderer.translate(this.transform.pos);
      if (this.transform.dir) nde.renderer.rotate(this.transform.dir);

      nde.renderer.image(this.texture, this.transform.size._mul(-0.5), this.transform.size);
    });
  }

  from(data) {
    super.from(data);

    this.tex = data._tex;
    this.speed = data._speed;

    return this;
  }
  strip() {
    super.strip();
    delete this._texture;
    delete this.animation;
    delete this.stateMachineImg;
    delete this.ob.sprite;
  }
}