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
      c.ob = this;
      c.transform = this.transform;
    }


    this.parent = undefined;
    this.children = children;


    this.e = new EventHandler();
  }



  update(dt) {
    for (let i = 0; i < this.components.length; i++) {
      let c = this.components[i];

      if (!c.hasStarted) {
        c.start();
        c.hasStarted = true;
      }

      c.update(dt);
    }

    for (let i = 0; i < this.children.length; i++) {
      this.children[i].update(dt);
    }
  }
  render() {
    for (let i = 0; i < this.components.length; i++) {
      this.components[i].render();
    }

    for (let i = 0; i < this.children.length; i++) {
      this.children[i].render();
    }
  }
  
  
  on(...args) {return this.e.on(...args)}
  off(...args) {return this.e.off(...args)}
  fire(...args) {return this.e.fire(...args)}


  getComponent(type) {
    return this.components.find(e=>{return e instanceof type});
  }
  getComponentRecursive(type) {
    let comp = this.components.find(e=>{return e instanceof type});
    if (comp) return comp;

    for (let i = 0; i < this.children.length; i++) {
      let comp = this.children[i].getComponentRecursive(type);
      if (comp) return comp;
    }
  }
  addComponent(component) {
    if (component.ob) {
      component.ob.removeComponent(component);
    }

    this.components.push(component);
    component.ob = this;
    component.transform = this.transform;
  }
  removeComponent(component) {
    let index = this.components.indexOf(component);
    if (index == -1) return false;

    this.component.splice(index, 1);
    component.ob = undefined;
    component.transform = undefined;
    return true;
  }


  appendChild(...obs) {
    for (let i = 0; i < obs.length; i++) {
      let ob = obs[i];
      
      if (ob.parent) {
        ob.parent.removeChild(ob);
      }

      this.children.push(ob);
      ob.parent = this;
    }
    
    
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

    for (let i = 0; i < this.components.length; i++) {
      this.components[i].remove();
    }

    for (let i = 0; i < this.children.length; i++) {
      this.children[i].remove();
    }
  }



  from(data) {
    super.from(data);

    this.name = data.name;


    this.components = [];
    for (let c of data.components) this.components.push(cloneData(c));
    this.transform = this.getComponent(Transform);

    for (let i = 0; i < this.components.length; i++) {
      let c = this.components[i];
      c.ob = this;
      c.transform = this.transform;
    }

  
    for (let i = 0; i < this.children.length; i++) {
      let c2 = cloneData(this.children[i]);
      this.appendChild(c2);
    }


    return this;
  }
  strip() {
    delete this.transform;
    delete this.parent;
    
    for (let i = 0; i < this.components.length; i++) {
      this.components[i].strip();
    }

    for (let i = 0; i < this.children.length; i++) {
      this.children[i].strip();
    }
  }
}