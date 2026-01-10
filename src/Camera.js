class Camera extends Serializable {
  constructor(pos, props = {}) {
    super();

    this.pos = pos || new Vec(0, 0);

    this.w = 16;
    this.ar = props.ar || nde.ar;

    this.dir = 0;
  }

  from(data) {
    super.from(data);
    if (data.pos) this.pos = new Vec().from(data.pos);
    if (data.w) this.w = data.w;
    if (data.dir) this.dir = data.dir;
    
    return this;
  }

  /**
   * Transforms vector from world space to screen space
   * 
   * @param {Vec} v World space
   * @return {Vec} Screen space
   */
  transformVec(v) {
    v = v._subV(this.pos);
    v.addV(new Vec(this.w / 2, this.w / 2 * this.ar));
    v.mul(nde.w / this.w);

    return v;
  }
  /**
   * Transforms vector from screen space to world space
   * 
   * @param {Vec} v Screen space
   * @return {Vec} World space
   */
  untransformVec(v) {
    v = v._div(nde.w / this.w);
    v.subV(new Vec(this.w / 2, this.w / 2 * this.ar));
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
    return s * (nde.w / this.w);
  }
  /**
   * Scales number from screen space to world space
   * 
   * @param {number} s Screen space
   * @return {number} World space
   */
  unscale(s) {
    return s / (nde.w / this.w);
  }

  /**
   * Scales vector from world space to screen space
   * 
   * @param {Vec} v World space
   * @return {Vec} Screen space
   */
  scaleVec(v) {
    return v._mul(nde.w / this.w);
  }
  /**
   * Scales vector from screen space to world space
   * 
   * @param {Vec} v Screen space
   * @return {Vec} World space
   */
  unscaleVec(v) {
    return v._div(nde.w / this.w);
  }

  /**
   * Scales renderer from world space to screen space
   * 
   * @param {Renderer} r renderer
   */
  scaleRenderer(r = renderer) {
    r.scale(new Vec(r.size.x / this.w, r.size.y / (this.w * this.ar)));
  }
  /**
   * Scales renderer from screen space to world space
   * 
   * @param {Renderer} r renderer
   */
  unscaleRenderer(r = renderer) {
    r.scale(new Vec(this.w / r.size.x, (this.w * this.ar) / r.size.y));
  }

  /**
   * Transforms renderer from world space to screen space
   * 
   * @param {Renderer} r renderer
   */
  transformRenderer(r = renderer) {
    this.scaleRenderer(r);
    r.translate(new Vec(this.w / 2, this.w / 2 * this.ar));

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

    r.translate(new Vec(this.w / -2, this.w / -2 * this.ar));
    this.unscaleRenderer(r);
  }

  
  /**
   * Context where renderer is transformed
   * @param {Renderer} r renderer
   */

  _(r, context) {
    r._(()=>{
      this.transformRenderer(r);
      r.set("lineWidth", this.unscale(1));

      context();
    });
  }
}