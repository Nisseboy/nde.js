class Transform extends Component {
  constructor(pos = undefined, dir = 0, size = undefined) {
    super();

    this.pos = pos;
    if (!pos) this.pos = new Vec(0, 0);

    this.dir = dir;

    this.size = size;
    if (!size) this.size = new Vec(1, 1);
  }

  from(data) {
    super.from(data);

    this.pos = new Vec().from(data.pos);
    this.dir = data.dir;
    this.size = new Vec().from(data.size);

    return this;
  }
}