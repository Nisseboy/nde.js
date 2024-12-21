class Camera {
  constructor(pos) {
    this.pos = pos;

    this.w = 16;

    this.dir = 0;

    this.renderW;
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
    v.mul(this.renderW / this.w);

    return v;
  }
  /**
   * Transforms screen pos to world pos
   * 
   * @param {Vec} v Screen pos
   * @return {Vec} World pos
   */
  from(v) {
    v = v._div(this.renderW / this.w);
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
    return v._mul(this.renderW / this.w);
  }
  /**
   * Scales all axes of a vector from camera scale
   * 
   * @param {Vec} v Scaled vector
   * @return {Vec} Unscaled vector
   */
  unScaleVec(v) {
    return v._div(this.renderW / this.w);
  }

  /**
   * Scales renderer transform
   */
  scaleTransform() {
    renderer.scale(new Vec(this.renderW / this.w, this.renderW / this.w));
  }
  /**
   * Unscales renderer transform
   */
  unScaleTransform() {
    renderer.scale(new Vec(1, 1)._div(this.renderW / this.w));
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