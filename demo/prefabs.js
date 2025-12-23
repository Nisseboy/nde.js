


const EntityPlayer = new Ob({
  name: "Player",
}, [
  new Sprite("duck/1"),
  new PlayerController(),
  new AudioSource(),
]);