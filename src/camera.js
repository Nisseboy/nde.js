class Camera {
  constructor(pos) {
    this.pos = pos;

    this.w = 16;

    this.dir = 0;

    this.renderW;
  }

  /**
   * Transforms vector from world space to screen space
   * 
   * @param {Vec} v World space
   * @return {Vec} Screen space
   */
  transformVec(v) {
    v = v._subV(this.pos);
    v.addV(new Vec(this.w / 2 / this.scale, this.w / 2 / 16 * 9));
    v.mul(this.renderW / this.w);

    return v;
  }
  /**
   * Transforms vector from screen space to world space
   * 
   * @param {Vec} v Screen space
   * @return {Vec} World space
   */
  untransformVec(v) {
    v = v._div(this.renderW / this.w);
    v.subV(new Vec(this.w / 2, this.w / 2 / 16 * 9));
    v.addV(this.pos);

    return v;
  }

  /**
   * Scales number from world space to screen space
   * 
   * @param {number} s World space
   * @return {number} Screen space
   */
  scale(s) {
    return s * (this.renderW / this.w);
  }
  /**
   * Scales number from screen space to world space
   * 
   * @param {number} s Screen space
   * @return {number} World space
   */
  unscale(s) {
    return s / (this.renderW / this.w);
  }

  /**
   * Scales vector from world space to screen space
   * 
   * @param {Vec} v World space
   * @return {Vec} Screen space
   */
  scaleVec(v) {
    return v._mul(this.renderW / this.w);
  }
  /**
   * Scales vector from screen space to world space
   * 
   * @param {Vec} v Screen space
   * @return {Vec} World space
   */
  unscaleVec(v) {
    return v._div(this.renderW / this.w);
  }

  /**
   * Scales renderer from world space to screen space
   * 
   * @param {Renderer} r renderer
   */
  scaleRenderer(r = renderer) {
    r.scale(new Vec(this.renderW / this.w, this.renderW / this.w));
  }
  /**
   * Scales renderer from screen space to world space
   * 
   * @param {Renderer} r renderer
   */
  unscaleRenderer(r = renderer) {
    r.scale(new Vec(1, 1)._div(this.renderW / this.w));
  }

  /**
   * Transforms renderer from world space to screen space
   * 
   * @param {Renderer} r renderer
   */
  transformRenderer(r = renderer) {
    this.scaleRenderer(r);
    r.translate(new Vec(this.w / 2, this.w / 2 / 16 * 9));

    r.rotate(-this.dir);
    r.translate(this.pos._mul(-1));
  }

  /**
   * Transforms renderer from screen space to world space
   * 
   * @param {Renderer} r renderer
   */
  untransformRenderer(r = renderer) {
    r.translate(this.pos._mul(1));
    r.rotate(this.dir);

    r.translate(new Vec(this.w / -2, this.w / -2 / 16 * 9));
    this.unscaleRenderer(r);
  }



  //Compatibility
  applyTransform() {return this.transformRenderer()}
  unScaleVec(a) {return this.unscaleVec(a)}
  to(a) {return this.transformVec(a)}
  from(a) {return this.untransformVec(a)}
}