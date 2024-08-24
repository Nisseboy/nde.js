class Camera {
  constructor(pos) {
    this.pos = pos;

    this.scale = 1;
  }

  to(v) {
    v = v._subV(this.pos);
    v.addV(new Vec(8 / this.scale, 4.5 / this.scale));
    v.mul(w / 16 * this.scale);

    return v;
  }
  from(v) {
    v = v._div(w / 16 * this.scale);
    v.subV(new Vec(8 / this.scale, 4.5 / this.scale));
    v.addV(this.pos);

    return v;
  }

  toScale(v) {
    return v._mul(w / 16 * this.scale);
  }
  fromScale(v) {
    return v._div(w / 16 * this.scale);
  }
}