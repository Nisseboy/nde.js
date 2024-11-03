class Camera {
  constructor(pos) {
    this.pos = pos;

    this.w = 16;

    this.dir = 0;
  }

  /**
   * Transforms world pos to screen pos
   * 
   * @param {Vec} v World pos
   * @return {Vec} Screen pos
   */
  to(v) {
    v = v._subV(this.pos);
    v.addV(new Vec(this.w / 2 / this.scale, this.w / 2 / 16 * 9));
    v.mul(w / this.w);

    return v;
  }
  /**
   * Transforms screen pos to world pos
   * 
   * @param {Vec} v Screen pos
   * @return {Vec} World pos
   */
  from(v) {
    v = v._div(w / this.w);
    v.subV(new Vec(this.w / 2, this.w / 2 / 16 * 9));
    v.addV(this.pos);

    return v;
  }

  /**
   * Scales all axes of a vector to camera scale
   * 
   * @param {Vec} v Unscaled vector
   * @return {Vec} Scaled vector
   */
  scaleVec(v) {
    return v._mul(w / this.w);
  }
  /**
   * Scales all axes of a vector from camera scale
   * 
   * @param {Vec} v Scaled vector
   * @return {Vec} Unscaled vector
   */
  unScaleVec(v) {
    return v._div(w / this.w);
  }

  /**
   * Scales renderer transform
   */
  scaleTransform() {
    renderer.scale(new Vec(w / this.w, w / this.w));
  }
  /**
   * Unscales renderer transform
   */
  unScaleTransform() {
    renderer.scale(new Vec(1, 1)._div(w / this.w));
  }

  /**
   * Applies camera transform to renderer
   */
  applyTransform() {
    this.scaleTransform();
    renderer.translate(new Vec(this.w / 2, this.w / 2 / 16 * 9));

    renderer.rotate(-this.dir);
    renderer.translate(this.pos._mul(-1));
  }
}