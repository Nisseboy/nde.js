class StateMachineImg extends StateMachine {
  constructor(rootNode) {
    super(rootNode);
  }

  parseResult(result) {
    if (this.result instanceof RunningAnimation) this.result.stop();

    if (result instanceof Animation) {  
      this.result = result.start({events: {"*": [(a, b) => {this.fireEvent(a, b);}]}});
    } else {
      this.result = result;
    }
    
    return this.result;
  }
}