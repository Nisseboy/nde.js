class World extends Serializable {
  constructor(type = "World") {
    super(type);

    this.entities = [
      new EntityPlayer(), 
      createData(EntityText, {pos: new Vec(0, -4), text: "[w a s d shift], [arrow keys]"})
    ];
  }

  from(data) {
    super.from(data);

    if (data.entities) this.entities = data.entities.map(e=>cloneData(e));

    return this;
  }
}