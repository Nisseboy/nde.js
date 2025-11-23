let audiosPaths = [
"duck/step/1",
"duck/step/2",
"duck/step/3",
"duck/step/4",
];
let texturesPaths = [
"duck/1",
"duck/rot/1,2,3,4,5,6,7,8",
];


function preloadAnimations() {
  tex["duck/rot"] = new Animation([
    new AnimationFrame(tex["duck/rot/1"]),
    new AnimationFrame(tex["duck/rot/2"]),
    new AnimationFrame(tex["duck/rot/3"]),
    new AnimationFrame(tex["duck/rot/4"]),
    new AnimationFrame(tex["duck/rot/5"]),
    new AnimationFrame(tex["duck/rot/6"]),
    new AnimationFrame(tex["duck/rot/7"]),
    new AnimationFrame(tex["duck/rot/8"]),
    new AnimationFrameLoop(),
  ], 1/10);
}