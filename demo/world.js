class World extends Serializable {
  constructor(type = "World") {
    super(type);
    this.entities = [new EntityPlayer()];
  }
}