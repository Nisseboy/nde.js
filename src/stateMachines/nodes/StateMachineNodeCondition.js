class StateMachineNodeCondition extends StateMachineNodeBase {
  constructor(conditionF, ...children) {
    super(...children);
    
    this.conditionF = conditionF;
    this.children = children;
  }

  choose(stateMachine) {
    let result = this.conditionF(stateMachine);
    if (result == true) return this.children[0];
    if (result == false) return this.children[1];
    return this.children[2];
  }
}