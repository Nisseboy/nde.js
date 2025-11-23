class StateMachineNodeBase {
  constructor(...children) {
    this.children = children;
  }

  choose(stateMachine) {}
}