class Ob extends Serializable {
  constructor(props = {}, components = [], children = []) {
    super();

    this.name = props.name || "";
    this.children = [];
    this.id = props.id;
    if (this.id == undefined) this.randomizeId();
    this.active = true;

    this.components = components;
    this.transform = this.getComponent(Transform);
    if (!this.transform) {
      this.transform = new Transform();
      this.components.unshift(this.transform);
    }
    if (props.pos) this.transform.pos.from(props.pos);
    if (props.size) this.transform.size.from(props.size);
    if (props.dir != undefined) this.transform.dir = props.dir;

    for (let c of this.components) {
      c.ob = this;
      c.transform = this.transform;
    }


    this.parent = undefined;
    this.appendChild(...children);


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
    if (!this.active) return;

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


  addComponent(...components) {
    for (let i = 0; i < components.length; i++) {
      let component = components[i];

      if (component.ob) {
        component.ob.removeComponent(component);
      }

      this.components.push(component);
      component.ob = this;
      component.transform = this.transform;
    }
  }
  removeComponent(component) {
    let index = this.components.indexOf(component);
    if (index == -1) return false;

    this.components.splice(index, 1);
    component.ob = undefined;
    component.transform = undefined;
    return true;
  }

  getComponent(type) {
    return this.components.find(e=>{return e instanceof type});
  }
  getComponents(type, limit = 9999, arr = []) {
    let comp = this.components.find(e=>{return e instanceof type});
    if (comp) arr.push(comp);

    for (let i = 0; i < this.children.length; i++) {
      if (arr.length == limit) return arr;
      
      this.children[i].getComponents(type, limit, arr);
    }

    return arr;
  }

  find(fn) {
    let arr = this.findAll(fn, 1);
    if (arr) return arr[0];
  }
  findAll(fn, limit = 9999, arr = []) {
    if (fn(this)) arr.push(this);

    for (let i = 0; i < this.children.length; i++) {
      if (arr.length == limit) return arr;
      
      this.children[i].findAll(fn, limit, arr);
    }

    return arr;
  }

  findId(id) {
    if (this.id == id) return this;

    for (let i = 0; i < this.children.length; i++) {
      let res = this.children[i].findId(1);
      
      if (res) return res;
    }
  }
  randomizeId() {
    this.id = Math.floor(Math.random() * 1000000);

    for (let i = 0; i < this.children.length; i++) this.children[i].randomizeId();

    return this.id;
  }
  createLookupTable(table = {}) {
    table[this.id] = this;

    for (let i = 0; i < this.children.length; i++) {
      this.children[i].createLookupTable(table);
    }
    
    return table;
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
    this.id = data.id;
    this.active = data.active;


    this.components = [];
    for (let c of data.components) this.components.push(cloneData(c));
    this.transform = this.getComponent(Transform);

    for (let i = 0; i < this.components.length; i++) {
      let c = this.components[i];
      c.ob = this;
      c.transform = this.transform;
    }

  
    for (let i = 0; i < data.children.length; i++) {
      let c2 = cloneData(data.children[i]);
      this.appendChild(c2);
    }


    return this;
  }
  
  stripComponents() {
    for (let i = 0; i < this.components.length; i++) {
      this.components[i].strip();
    }

    for (let i = 0; i < this.children.length; i++) {
      this.children[i].stripComponents();
    }
  }
  stripObs() {
    delete this.transform;
    delete this.parent;
    delete this.e;

    for (let i = 0; i < this.children.length; i++) {
      this.children[i].stripObs();
    }
  }
  strip() {
    this.stripComponents();
    this.stripObs();
    
  }
  stripClientComponents() {
    for (let i = 0; i < this.components.length; i++) {
      if (this.components[i].clientOnly) {
        this.removeComponent(this.components[i]);
        i--;
      }
    }

    for (let i = 0; i < this.children.length; i++) {
      this.children[i].stripClientComponents();
    }
  }
}