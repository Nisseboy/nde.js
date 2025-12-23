class EventHandler {
  constructor() {
    this.events = {};

    this.listeners = [];
  }

  on(eventName, func, isPriority = false) {
    if (!this.events[eventName]) this.events[eventName] = [];
    if (isPriority) {
      this.events[eventName].unshift(func);
    } else {
      this.events[eventName].push(func);
    }
  }
  off(eventName, func) {
    let events = this.events[eventName];
    if (!events) return false;

    let index = events.indexOf(func);
    if (index == -1) return false;

    events.splice(index, 1);
    return true;
  }
  fire(eventName, ...args) {
    let events = this.events[eventName];
    if (events) {
      for (let i = 0; i < events.length; i++) {
        if (events[i](...args) == false) return false;
      }
    }
    
    for (let i = 0; i < this.listeners.length; i++) {
      this.listeners[i].fire(eventName, ...args);
    }
      
    return true;
  }
}