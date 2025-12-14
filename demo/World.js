class World extends Serializable {
  constructor() {
    super();

    this.entities = [
      new EntityPlayer(new Vec(0, 0)), 
    ];
  }

  from(data) {
    super.from(data);

    if (data.entities) this.entities = data.entities.map(e=>cloneData(e));

    return this;
  }
}