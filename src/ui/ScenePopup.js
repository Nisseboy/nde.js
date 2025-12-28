class ScenePopup extends Scene {
  constructor() {
    super();

    this.cam = new Camera(new Vec(800, 450));
    this.cam.w = 1600;
    this.cam.renderW = nde.w;

    this.img = undefined;

    this.ui = new UIRoot({
      children: [
        new UIBase({
          style: {
            pos: new Vec(800, 450),
            selfPos: new Vec(-0.5, -0.5),
          },
        }),
      ]
    });   
  }


  inputdown(key) {
    if (nde.getKeyEqual(key,"Pause")) {
      nde.resolvePopup();
    }
  }

  captureScreen() {
    this.img = new Img(new Vec(nde.w, nde.w * nde.ar));
    nde.fire("render");
    this.img.ctx.imageSmoothingEnabled = false;
    this.img.image(nde.renderer, vecZero, this.img.size);
  }

  render() {
    let cam = this.cam;
    cam.renderW = nde.w;

    cam._(renderer, ()=>{
      renderer.image(this.img, vecZero, new Vec(cam.w, cam.w * cam.ar));
      this.ui.renderUI();
    });
  }
}