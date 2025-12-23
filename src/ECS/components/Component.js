class Component extends Serializable {
  constructor() {
    super();

    this.hasStarted = false;

    this.ob = undefined;
    this.transform = undefined;
  }


  start() {}
  remove() {}
  update(dt) {}
  render() {}



  on(...args) {return this.ob.on(...args)}
  off(...args) {return this.ob.off(...args)}
  fire(...args) {return this.ob.fire(...args)}
  getComponent(type) {
    return this.ob.getComponent(type);
  }


  from(data) {
    super.from(data);

    return this;
  }
  strip() {
    delete this.ob;
    delete this.transform;
    delete this.hasStarted;
  }
}