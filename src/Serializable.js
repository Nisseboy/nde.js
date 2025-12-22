class Serializable {
  constructor() {
    this.type = this.constructor.name;
  }

  from(data) {
    return this;
  }

  copy() {
    return cloneData(this);
  }
  strip() {}
  serialize() {
    let ob = this.copy();

    ob.strip();

    return JSON.stringify(ob);
  }
}

function cloneData(data, typeOverride = undefined) {
  if (typeof data == "string") data = JSON.parse(data);

  let type = data.type;
  if (!type) type = data.constructor.name;
  if (typeOverride) type = typeOverride;
  
  return new (eval(type))().from(data);
}