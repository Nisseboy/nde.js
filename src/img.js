class Img {
  constructor(size) {
    this.size = size.copy();

    this.canvas = document.createElement("canvas");
    this.canvas.width = size.x;
    this.canvas.height = size.y;

    this.ctx = this.canvas.getContext("2d");
    if (this.ctx == null) throw new Error("2d context not supported?");

    this.loading = false;
    this.path = "";
  }

  resize(size) {
    this.size = size.copy();

    this.canvas.width = size.x;
    this.canvas.height = size.y;
  }
}

function loadImg(path) {
  let img = new Img(new Vec(1, 1));
  img.loading = true;
  img.path = path;
  unloadedAssets.push(img);

  let image = new Image();
  image.src = path;

  image.onload = e => {
    img.resize(new Vec(image.width, image.height));
    img.ctx.drawImage(image, 0, 0);
    img.loading = false;

    unloadedAssets.splice(unloadedAssets.indexOf(img));
  };
  image.onerror = e => {
    console.error(`"${path}" not found`);

    unloadedAssets.splice(unloadedAssets.indexOf(img));
  };

  return img;
}