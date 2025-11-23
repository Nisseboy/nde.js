class StateMachine {
  constructor(rootNode) {
    this.rootNode = rootNode;

    this.lastChoice = undefined;
    this.events = {};
  }

  choose() {
    let node = this.rootNode;

    while (node && !node instanceof StateMachineNodeResult) {
      node = node.choose(this);
    }

    
    let choice = node?.result;
    if (choice != this.lastChoice) this.fireEvent("change", choice);
    this.lastChoice = choice;

    return choice;
  }


  

  registerEvent(eventName, func) {
    if (!this.events[eventName]) this.events[eventName] = [];
    this.events[eventName].push(func);
  }
  unregisterEvent(eventName, func) {
    let events = this.events[eventName];
    if (!events) return false;

    let index = events.indexOf(func);
    if (index == -1) return false;

    events.splice(index, 1);
    return;
  }
  fireEvent(eventName, ...args) {
    let events = this.events[eventName];
    if (events) {
      for (let e of events) {
        if (e(...args) == false) return false;
      }
    }
      
    return true;
  }
}