import sys

files = [
  "src/Serializable.js",
  "src/Vec.js",
  "src/Camera.js",
  "src/Scene.js",
  "src/EventHandler.js",
  
  "src/assets/Asset.js",
  "src/assets/EvalAsset.js",
  "src/assets/Renderable.js",
  "src/assets/Img.js",
  "src/assets/Aud.js",
  "src/assets/AudPool.js",
  "src/assets/animation/frames/AnimationFrameBase.js",
  "src/assets/animation/frames/AnimationFrame.js",
  "src/assets/animation/frames/AnimationFrameEvent.js",
  "src/assets/animation/frames/AnimationFrameLoop.js",
  "src/assets/animation/Animation.js",
  "src/assets/animation/RunningAnimation.js",

  "src/stateMachines/nodes/StateMachineNodeBase.js",
  "src/stateMachines/nodes/StateMachineNodeCondition.js",
  "src/stateMachines/nodes/StateMachineNodeResult.js",
  "src/stateMachines/StateMachine.js",
  "src/stateMachines/StateMachineImg.js",

  "src/ui/UIBase.js",
  "src/ui/UIRoot.js",
  "src/ui/UIText.js",
  "src/ui/UIImage.js",
  "src/ui/buttons/UIButton.js",
  "src/ui/buttons/UIButtonText.js",
  "src/ui/buttons/UIButtonImage.js",

  "src/ui/settings/UISettingBase.js",
  "src/ui/settings/UISettingCollection.js",
  "src/ui/settings/UISettingChoice.js",
  "src/ui/settings/UISettingDropdown.js",
  "src/ui/settings/UISettingCheckbox.js",
  "src/ui/settings/UISettingRange.js",
  "src/ui/settings/UISettingText.js",
  "src/ui/settings/UISettingRGB.js",

  "src/timers/TimerBase.js",
  "src/timers/TimerFrames.js",
  "src/timers/TimerTime.js",

  "src/transitions/TransitionBase.js",
  "src/transitions/TransitionFade.js",
  "src/transitions/TransitionSlide.js",
  "src/transitions/TransitionNoise.js",

  "src/ECS/components/Component.js",
  "src/ECS/components/Transform.js",
  "src/ECS/components/Sprite.js",
  "src/ECS/components/TextRenderer.js",
  "src/ECS/components/AudioSource.js",
  "src/ECS/Ob.js",

  "src/index.js",
] 
outputFile = "release/nde" + sys.argv[1] + ".js"
fileHeader = '''
/*
This is a built version of nde (Nils Delicious Engine) and is all the source files stitched together, https://github.com/nisseboy/nde.js


*/
'''


output = fileHeader
for f in files:
  with open(f) as phille: output += "/* " + f + " */" + "\n" + phille.read() + "\n\n\n\n\n\n"

with open(outputFile, "w+") as f: f.write(output)