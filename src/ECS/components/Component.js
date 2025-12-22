class Component extends Serializable {
  constructor() {
    super();

    this.hasStarted = false;

    this.parent = undefined;
    this.transform = undefined;
  }


  start() {}
  update(dt) {}
  render() {}

  remove() {}


  getComponent(type) {
    return this.parent.getComponent(type);
  }


  from(data) {
    super.from(data);

    return this;
  }
}