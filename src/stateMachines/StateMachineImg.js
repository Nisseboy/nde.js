class StateMachineImg extends StateMachine {
  constructor(rootNode) {
    super(rootNode);

    this.chosen = undefined;
  }

  choose() {
    let node = this.rootNode;

    while (node && !(node instanceof StateMachineNodeResult)) {
      node = node.choose(this);
    }

    
    let choice = node?.result;
    if (choice != this.lastChoice) {      
      if (this.chosen instanceof RunningAnimation) this.chosen.stop();

      if (choice instanceof Animation) {  
        this.chosen = choice.start({events: {"*": [(a, b) => {this.fireEvent(a, b);}]}});
      } else {
        this.chosen = choice;
      }

      this.fireEvent("change", this.chosen);
    }
    this.lastChoice = choice;

    return this.chosen;
  }
}