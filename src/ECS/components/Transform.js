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


  render() {
    nde.renderer._(() => {
      nde.renderer.translate(this.transform.pos);
      if (this.transform.dir) nde.renderer.rotate(this.transform.dir);

      nde.renderer.set("fill", "rgba(0,0,0,0)");
      nde.renderer.set("stroke", "rgba(255, 255, 255, 1)");
      nde.renderer.rect(this.transform.size._mul(-0.5), this.transform.size);
    });
  }
}