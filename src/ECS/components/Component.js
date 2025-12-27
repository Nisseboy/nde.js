class Component extends Serializable {
  constructor() {
    super();

    this.hasStarted = false;

    this.ob = undefined;
    this.transform = undefined;

    this.clientOnly = false;
  }


  start() {}
  remove() {}
  update(dt) {}
  render() {}



  on(...args) {return this.ob.on(...args)}
  off(...args) {return this.ob.off(...args)}
  fire(...args) {return this.ob.fire(...args)}

  getComponent(...args) {return this.ob.getComponent(...args); }
  getComponents(...args) {return this.ob.getComponent(...args); }
  find(...args) {return this.ob.getComponent(...args); }
  findAll(...args) {return this.ob.getComponent(...args); }
  findId(...args) {return this.ob.getComponent(...args); }
  addComponent(...args) {return this.ob.addComponent(...args); }
  removeComponent(...args) {return this.ob.addComponent(...args); }

  from(data) {
    super.from(data);

    this.clientOnly = data.clientOnly;

    return this;
  }
  strip() {
    delete this.ob;
    delete this.transform;
    delete this.hasStarted;
  }
}