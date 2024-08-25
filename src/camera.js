class Camera {
  constructor(pos) {
    this.pos = pos;

    this.scale = 1;

    this.dir = 0;
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

  scaleVec(v) {
    return v._mul(w / 16 * this.scale);
  }
  unScaleVec(v) {
    return v._div(w / 16 * this.scale);
  }

  scale() {
    renderer.scale(new Vec(w / 16 * this.scale, w / 16 * this.scale));
  }
  unScale() {
    renderer.scale(new Vec(1, 1)._div(w / 16 * this.scale));
  }

  applyTransform() {
    renderer.scale(new Vec(w / 16, w / 16));
    renderer.translate(new Vec(8, 4.5));
    renderer.scale(new Vec(this.scale, this.scale));

    renderer.rotate(-this.dir);
    renderer.translate(this.pos._mul(-1));
  }
}