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

function createData(type, props) {
  if (typeof type == "string") type = eval(type);

  let data = new type(type.name);
  for (let p in props) data[p] = props[p];

  return data;
}

function cloneData(data, typeOverride = undefined) {
  let type = typeOverride != undefined ? typeOverride : data.type;
  
  return new (eval(type))(type).from(data);
}