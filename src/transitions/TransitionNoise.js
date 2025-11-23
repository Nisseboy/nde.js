class TransitionNoise extends TransitionBase {
  constructor(newScene, timer, sliding = false, w = 432) {
    super(newScene, timer);

    this.sliding = sliding;

    this.noiseTexture = new Img(new Vec(w, w / 16 * 9));
    this.outImage = new Img(nde.renderer.size);
    this.outImage.ctx.imageSmoothingEnabled = false;
  }

  render() {
    super.render();
    let lastRandom = 0;
    const random = () => {
      lastRandom = (1103515245  * lastRandom + 12345) % (2 ** 31);
      return lastRandom / 10000000 % 1;
    };


    let data = this.noiseTexture.ctx.getImageData(0, 0, this.noiseTexture.size.x, this.noiseTexture.size.y);
    let i, threshold;
    for (let x = 0; x < this.noiseTexture.size.x; x++) {
      for (let y = 0; y < this.noiseTexture.size.y; y++) {
        i = (x + y * this.noiseTexture.size.x) * 4;
        threshold = this.timer.progress;

        if (this.sliding) {
          threshold = (this.timer.progress * 1.3 - x/this.noiseTexture.size.x) * 2;
        }

        if (random() < threshold) {
          data.data[i  ] = 255;
          data.data[i+1] = 255;
          data.data[i+2] = 255;
          data.data[i+3] = 255;
        } else {
          data.data[i  ] = 0;
          data.data[i+1] = 0;
          data.data[i+2] = 0;
          data.data[i+3] = 0;
        }
      }
    }

    this.noiseTexture.ctx.putImageData(data, 0, 0);

    nde.renderer.image(this.oldImg, vecZero, nde.renderer.size);

    this.outImage.image(this.noiseTexture, vecZero, nde.renderer.size);
    this.outImage.ctx.globalCompositeOperation = 'source-in';
    this.outImage.image(this.newImg, vecZero, nde.renderer.size);
    this.outImage.ctx.globalCompositeOperation = 'source-over';

    nde.renderer.image(this.outImage, vecZero, nde.renderer.size);
  }
}