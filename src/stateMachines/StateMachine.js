class StateMachine {
  constructor(rootNode) {
    this.rootNode = rootNode;

    this.lastChoice = undefined;
    this.result = undefined;

    this.e = new EventHandler();
  }

  choose() {
    let choice = this.rootNode;

    while (choice && !(choice instanceof StateMachineNodeResult)) {
      choice = choice.choose(this);
    }


    if (choice != this.lastChoice) {    
      this.parseResult(choice.result);
      this.fire("change", this.result);
      this.lastChoice = choice;
    }

    return this.result;
  }

  parseResult(result) {
    this.result = result;
  }


  

  on(...args) {return this.e.on(...args)}
  off(...args) {return this.e.off(...args)}
  fire(...args) {return this.e.fire(...args)}
}