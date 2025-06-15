class World extends Serializable {
  constructor() {
    super();

    this.entities = [
      new EntityPlayer(new Vec(0, 0)), 
      new EntityText(new Vec(0, -4), "[w a s d shift], [arrow keys]"),
    ];
  }

  from(data) {
    super.from(data);

    if (data.entities) this.entities = data.entities.map(e=>cloneData(e));

    return this;
  }
}