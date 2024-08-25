class Camera {
  constructor(pos) {
    this.pos = pos;

    this.w = 16;

    this.dir = 0;
  }

  to(v) {
    v = v._subV(this.pos);
    v.addV(new Vec(this.w / 2 / this.scale, this.w / 2 / 16 * 9));
    v.mul(w / this.w);

    return v;
  }
  from(v) {
    v = v._div(w / this.w);
    v.subV(new Vec(this.w / 2, this.w / 2 / 16 * 9));
    v.addV(this.pos);

    return v;
  }

  scaleVec(v) {
    return v._mul(w / this.w);
  }
  unScaleVec(v) {
    return v._div(w / this.w);
  }

  scaleTransform() {
    renderer.scale(new Vec(w / this.w, w / this.w));
  }
  unScaleTransform() {
    renderer.scale(new Vec(1, 1)._div(w / this.w));
  }

  applyTransform() {
    this.scaleTransform();
    renderer.translate(new Vec(this.w / 2, this.w / 2 / 16 * 9));

    renderer.rotate(-this.dir);
    renderer.translate(this.pos._mul(-1));
  }
}