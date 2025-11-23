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
  let frame = AnimationFrame;
  let loop = AnimationFrameLoop;
  let event = AnimationFrameEvent;

  tex["duck/walk"] = new Animation([
    new event("step"),
    new frame(tex["duck/1"]),
    new loop(),
  ], 1/3);


  tex["duck/rot"] = new Animation([
    new frame(tex["duck/rot/1"]),
    new frame(tex["duck/rot/2"]),
    new frame(tex["duck/rot/3"]),
    new frame(tex["duck/rot/4"]),
    new frame(tex["duck/rot/5"]),
    new frame(tex["duck/rot/6"]),
    new frame(tex["duck/rot/7"]),
    new frame(tex["duck/rot/8"]),
    new loop(),
  ], 1/10);
}