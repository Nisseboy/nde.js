class Ob extends Serializable {
  constructor(props = {}, components = [], children = []) {
    super();

    this.name = props.name || "";

    this.components = components;
    this.transform = this.getComponent(Transform);
    if (!this.transform) {
      this.transform = new Transform();
      this.components.unshift(this.transform);
    }
    if (props.pos) this.transform.pos.from(props.pos);

    for (let c of this.components) {
      c.parent = this;
      c.transform = this.transform;
    }


    this.parent = undefined;
    this.children = children;
  }



  update(dt) {
    for (let c of this.components) {
      if (!c.hasStarted) {
        c.start();
        c.hasStarted = true;
      }

      c.update(dt);
    }

    for (let c of this.children) {
      c.update(dt);
    }
  }
  render() {
    for (let c of this.components) {
      c.render();
    }

    for (let c of this.children) {
      c.render();
    }
  }


  getComponent(type) {
    return this.components.find(e=>{return e instanceof type});
  }


  appendChild(ob) {
    if (ob.parent) {
      ob.parent.removeChild(ob);
    }

    this.children.push(ob);
    ob.parent = this;
  }
  removeChild(ob) {
    let index = this.children.indexOf(ob);
    if (index == -1) return false;

    this.children.splice(index, 1);
    ob.parent = undefined;
    return true;
  }
  setParent(ob) {
    if (this.parent) this.parent.removeChild(this);
    ob.appendChild(this);
  }

  remove() {
    if (this.parent) this.parent.removeChild(this);

    for (let c of this.components) {
      c.remove();
    }
    for (let c of this.children) {
      c.remove();
    }
  }


  from(data) {
    super.from(data);

    this.name = data.name;


    this.components = [];
    for (let c of data.components) this.components.push(cloneData(c));
    this.transform = this.getComponent(Transform);

    for (let c of this.components) {
      c.parent = this;
      c.transform = this.transform;
    }

  
    for (let c of data.children) {
      let c2 = cloneData(c);
      this.appendChild(c2);
    }


    return this;
  }
  strip() {
    delete this.transform;
    delete this.parent;
    
    for (let c of this.components) {
      delete c.parent;
      delete c.transform;
      delete c.hasStarted;
    }

    for (let c of this.children) {
      c.strip();
    }
  }
}