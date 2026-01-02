class InputManager {
  constructor() {
    this.log = [];
  }

  init() {
    
  }

  fire(eventName, ...args) {
    if (nde.debug) {
      let log = [eventName];
      for (let i = 0; i < args.length; i++) {
        let arg = args[i];
        
        if (arg instanceof Event) {      
          if (arg instanceof MouseEvent) {          
            log.push({
              altKey: arg.altKey,
              ctrlKey: arg.ctrlKey,
              metaKey: arg.metaKey,
              shiftKey: arg.shiftKey,

              button: arg.button,
              buttons: arg.buttons,
              clientX: arg.clientX,
              clientY: arg.clientY,

              deltaY: arg.deltaY,
            });
          } else if (arg instanceof KeyboardEvent) {
            log.push({
              altKey: arg.altKey,
              ctrlKey: arg.ctrlKey,
              metaKey: arg.metaKey,
              shiftKey: arg.shiftKey,

              code: arg.code,
              key: arg.key,
            });
          } else if (arg instanceof UIEvent) {
            
          }
        } else {
          log.push(arg);
        }
      }
      this.log.push(log);
    }
    nde.fire(eventName, ...args);    
  }
}