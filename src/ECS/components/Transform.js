class Transform extends Component {
  constructor(props = {}) {
    super();

    this.pos = props.pos || new Vec(0, 0);
    this.dir = props.dir || 0;
    this.size = props.size || new Vec(1, 1);
  }

  from(data) {
    super.from(data);

    this.pos = new Vec().from(data.pos);
    this.dir = data.dir;
    this.size = new Vec().from(data.size);

    return this;
  }
}