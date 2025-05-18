class Serializable {
  constructor(type) {
    this.type = type;
  }

  from(data) {
    if (data.type) this.type = data.type;
    return this;
  }

  copy() {
    return cloneData(this);
  }

  serialize() {
    return JSON.stringify(this);
  }
}

function cloneData(data, typeOverride = undefined) {
  if (typeof data == "string") data = JSON.parse(data);

  let type = typeOverride != undefined ? typeOverride : data.type;
  
  return new (eval(type))(type).from(data);
}