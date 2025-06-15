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

  serialize() {
    return JSON.stringify(this);
  }
}

/*
function createData(type, props) {
  if (typeof type != "string") type = eval(type);

  let data = new type(type.name);
  for (let p in props) data[p] = props[p];

  return data;
}*/

function cloneData(data, typeOverride = undefined) {
  if (typeof data == "string") data = JSON.parse(data);

  let type = data.type;
  if (!type) type = data.constructor.name;
  if (typeOverride) type = typeOverride;
  
  console.log(type);
  
  return new (eval(type))().from(data);
}