class Sprite extends Component {
  constructor(texOrTexture) {
    super();

    if (typeof texOrTexture == "string") {
      this.tex = texOrTexture;
    } else {
      this.tex = Object.keys(nde.tex).find(key => nde.tex[key] == texOrTexture);
      if (this.tex == undefined) {
        this.tex = Math.floor(Math.random() * 100000) + "";
        nde.tex[this.tex] = texOrTexture;
      }
    }
  }

  render() {
    nde.renderer._(() => {
      nde.renderer.translate(this.transform.pos);
      if (this.transform.dir) nde.renderer.rotate(this.transform.dir);

      nde.renderer.image(nde.tex[this.tex], this.transform.size._mul(-0.5), this.transform.size);
    });
  }

  from(data) {
    super.from(data);

    this.tex = data.tex;

    return this;
  }
}