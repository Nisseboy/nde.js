class StateMachineImg extends StateMachine {
  constructor(rootNode) {
    super(rootNode);

    this._speed = 1;
  }

  set speed(value) {
    if (this.result && this.result instanceof RunningAnimation) {
      this.result.speed = value;
    }
    this._speed = value;
  }
  get speed() {
    return this._speed;
  }

  parseResult(result) {
    if (this.result instanceof RunningAnimation) this.result.stop();

    if (result instanceof Animation) {  
      this.result = result.start({listeners: [this.e]});
      this.result.speed *= this.speed;
    } else {
      this.result = result;
    }
    
    return this.result;
  }
}