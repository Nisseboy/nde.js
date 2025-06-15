import sys

files = [
  "src/Serializable.js",
  "src/Vec.js",
  "src/Camera.js",
  "src/scenes/Scene.js",
  
  "src/assets/Asset.js",
  "src/assets/Img.js",
  "src/assets/Aud.js",

  "src/renderers/RendererBase.js",
  "src/renderers/RendererCanvas.js",

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

  "src/timers/TimerBase.js",
  "src/timers/TimerFrames.js",
  "src/timers/TimerTime.js",

  "src/transitions/TransitionBase.js",
  "src/transitions/TransitionFade.js",
  "src/transitions/TransitionSlide.js",
  "src/transitions/TransitionNoise.js",

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