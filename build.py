import sys

files = [
  "src/ndv.js",
  "src/camera.js",
  "src/scenes/scene.js",
  
  "src/assets/asset.js",
  "src/assets/img.js",
  "src/assets/aud.js",

  "src/renderers/rendererBase.js",
  "src/renderers/rendererCanvas.js",

  "src/ui/UIBase.js",
  "src/ui/UIRoot.js",
  "src/ui/UIText.js",
  "src/ui/UIImage.js",
  "src/ui/buttons/UIButton.js",
  "src/ui/buttons/UIButtonText.js",
  "src/ui/buttons/UIButtonImage.js",

  "src/ui/settings/UISettingBase.js",
  "src/ui/settings/UISettingCollection.js",
  "src/ui/settings/UISettingCheckbox.js",
  "src/ui/settings/UISettingRange.js",
  "src/ui/settings/UISettingRGB.js",

  "src/timers/timerBase.js",
  "src/timers/timerFrames.js",
  "src/timers/timerTime.js",

  "src/transitions/transitionBase.js",
  "src/transitions/transitionFade.js",
  "src/transitions/transitionSlide.js",
  "src/transitions/transitionNoise.js",

  "src/index.js",
] 
outputFile = "release/nde" + sys.argv[1] + ".js"
fileHeader = '''
/*
This is a built version of nde (Nils Delicious Engine) and is basically all the source files stitched together, go to the github for source


*/
'''


output = fileHeader
for f in files:
  with open(f) as phille: output += "/* " + f + " */" + "\n" + phille.read() + "\n\n\n\n\n\n"

with open(outputFile, "w+") as f: f.write(output)