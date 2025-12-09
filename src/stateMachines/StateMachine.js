class StateMachine {
  constructor(rootNode) {
    this.rootNode = rootNode;

    this.lastChoice = undefined;
    this.result = undefined;

    this.events = {};
  }

  choose() {
    let choice = this.rootNode;

    while (choice && !(choice instanceof StateMachineNodeResult)) {
      choice = choice.choose(this);
    }


    if (choice != this.lastChoice) {    
      this.parseResult(choice.result);
      this.fireEvent("change", this.result);
      this.lastChoice = choice;
    }

    return this.result;
  }

  parseResult(result) {
    this.result = result;
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